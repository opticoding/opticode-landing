'use client';

import { useEffect, useRef, useState } from 'react';
import { dispatchCursorGamePlaying } from '@/components/CustomCursor';
import { Button } from '@/components/ui/button';

// ── Constants ──────────────────────────────────────────────────────────────

const GRID_CONFIG = {
  S: { GRID: 16, CELL: 20 },
  L: { GRID: 32, CELL: 20 },
} as const;
const MIN_WIDTH_FOR_LARGE = 720;
const SNAKE_START = { x: 2, y: 6 };
const FOOD_START = { x: 5, y: 5 };

const BASE_SPEED = 300;
const MIN_SPEED = 100;
const SPEED_CONVERGE_SCORE = 30;
const LS_KEY_S = 'opticode-snake-best-S';
const LS_KEY_L = 'opticode-snake-best-L';

// Auto mode: score at which we switch from BFS to pure Hamiltonian cycle
const AUTO_THRESHOLD_S = 256;   // small grid
const AUTO_THRESHOLD_L = 512;  // large grid
const AUTO_SPEED = 50;         // fixed speed in auto mode (ms per tick)

function getLsKey(gridSize: 'S' | 'L'): string {
  return gridSize === 'S' ? LS_KEY_S : LS_KEY_L;
}

type Dir = 'U' | 'D' | 'L' | 'R';
type Pt = { x: number; y: number };
type GameState = 'idle' | 'playing' | 'over' | 'won';

const OPP: Record<Dir, Dir> = { U: 'D', D: 'U', L: 'R', R: 'L' };
const QUEUE_MAX = 3;

const HEAD_RGB: [number, number, number] = [244, 114, 182];
const TAIL_RGB: [number, number, number] = [109,  40, 217];

function lerpRGB(a: [number, number, number], b: [number, number, number], t: number): string {
  return `rgb(${Math.round(a[0] * (1 - t) + b[0] * t)},${Math.round(a[1] * (1 - t) + b[1] * t)},${Math.round(a[2] * (1 - t) + b[2] * t)})`;
}

function speedFromScore(score: number): number {
  const decay = Math.exp(-score / (SPEED_CONVERGE_SCORE / 3.2));
  return Math.max(MIN_SPEED, Math.round(MIN_SPEED + (BASE_SPEED - MIN_SPEED) * decay));
}

function randomFood(snake: Pt[], grid: number): Pt {
  let f: Pt;
  do {
    f = { x: Math.floor(Math.random() * grid), y: Math.floor(Math.random() * grid) };
  } while (snake.some(s => s.x === f.x && s.y === f.y));
  return f;
}

// ── Hamiltonian cycle & pathfinding (pure functions) ──────────────────────

/**
 * Builds a Hamiltonian cycle for an even N×N grid.
 *
 * Construction:
 *   - Even columns (0,2,…): sweep DOWN rows 1..N-1
 *   - Odd  columns (1,3,…): sweep UP   rows N-1..1
 *   - Even→odd transition: step RIGHT at bottom row
 *   - Odd→even transition: step RIGHT at row 1
 *   - After last (odd) column: step UP to row 0
 *   - Return highway:  row 0 leftward from col N-2 to col 0
 *   - Cycle closes:    (0,0) → (0,1)  [adjacent ✓]
 *
 * Verified cell count: N*(N-1) + 1 + (N-1) = N²  ✓
 */
function buildHamiltonianCycle(N: number): Pt[] {
  const cycle: Pt[] = [];
  for (let c = 0; c < N; c++) {
    if (c % 2 === 0) {
      for (let r = 1; r < N; r++) cycle.push({ x: c, y: r });
    } else {
      for (let r = N - 1; r >= 1; r--) cycle.push({ x: c, y: r });
    }
  }
  cycle.push({ x: N - 1, y: 0 });          // step up to row 0
  for (let c = N - 2; c >= 0; c--) cycle.push({ x: c, y: 0 }); // row-0 highway
  return cycle;
}

function ptKey(p: Pt, GRID: number): number {
  return p.y * GRID + p.x;
}

function getNeighborPts(p: Pt, GRID: number): Pt[] {
  const out: Pt[] = [];
  if (p.x > 0)        out.push({ x: p.x - 1, y: p.y });
  if (p.x < GRID - 1) out.push({ x: p.x + 1, y: p.y });
  if (p.y > 0)        out.push({ x: p.x, y: p.y - 1 });
  if (p.y < GRID - 1) out.push({ x: p.x, y: p.y + 1 });
  return out;
}

function gridNeighbors(k: number, GRID: number): number[] {
  const x = k % GRID;
  const y = (k - x) / GRID;
  const out: number[] = [];
  if (x > 0)        out.push(k - 1);
  if (x < GRID - 1) out.push(k + 1);
  if (y > 0)        out.push(k - GRID);
  if (y < GRID - 1) out.push(k + GRID);
  return out;
}

function ptToDir(from: Pt, to: Pt): Dir {
  if (to.x > from.x) return 'R';
  if (to.x < from.x) return 'L';
  if (to.y > from.y) return 'D';
  return 'U';
}

/** Distance to nearest edge (0 = on boundary, 1 = one step in, etc.). */
function edgeDistance(pt: Pt, GRID: number): number {
  return Math.min(pt.x, pt.y, GRID - 1 - pt.x, GRID - 1 - pt.y);
}

/** True if cell is within margin cells of any edge (margin 1 = avoid outer ring). */
function isNearEdge(pt: Pt, GRID: number, margin = 1): boolean {
  return edgeDistance(pt, GRID) <= margin;
}

/** Cost for pathfinding: higher near edges so we prefer interior routes. */
function edgeStepCost(pt: Pt, GRID: number): number {
  const d = edgeDistance(pt, GRID);
  return d <= 1 ? 5 : 1; // 5x cost for edge cells
}

/** BFS shortest path from start to target; tail cell is treated as passable. */
function bfsPath(start: Pt, target: Pt, snake: Pt[], GRID: number): Pt[] | null {
  const startKey  = ptKey(start,  GRID);
  const targetKey = ptKey(target, GRID);
  const blocked   = new Set(snake.map(p => ptKey(p, GRID)));
  blocked.delete(startKey);
  blocked.delete(ptKey(snake[snake.length - 1], GRID)); // tail moves away next tick

  const parent = new Map<number, number>();
  parent.set(startKey, -1);
  const queue: number[] = [startKey];

  while (queue.length > 0) {
    const curr = queue.shift()!;
    for (const nb of gridNeighbors(curr, GRID)) {
      if (parent.has(nb) || blocked.has(nb)) continue;
      parent.set(nb, curr);
      if (nb === targetKey) {
        const path: Pt[] = [];
        let c = nb;
        while (c !== startKey) {
          path.unshift({ x: c % GRID, y: Math.floor(c / GRID) });
          c = parent.get(c)!;
        }
        return path;
      }
      queue.push(nb);
    }
  }
  return null;
}

/**
 * Path to target preferring routes that avoid edges (for food chasing).
 * Uses Dijkstra with higher cost for edge cells — will still reach food on edge when needed.
 */
function pathToTargetAvoidingEdges(
  start: Pt,
  target: Pt,
  snake: Pt[],
  GRID: number
): Pt[] | null {
  const startKey  = ptKey(start, GRID);
  const targetKey = ptKey(target, GRID);
  const blocked   = new Set(snake.map(p => ptKey(p, GRID)));
  blocked.delete(startKey);
  blocked.delete(ptKey(snake[snake.length - 1], GRID));

  const dist = new Map<number, number>();
  const parent = new Map<number, number>();
  dist.set(startKey, 0);
  parent.set(startKey, -1);

  type Entry = [number, number];
  const pq: Entry[] = [[0, startKey]];

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, curr] = pq.shift()!;
    if (curr === targetKey) {
      const path: Pt[] = [];
      let c = curr;
      while (c !== startKey) {
        path.unshift({ x: c % GRID, y: Math.floor(c / GRID) });
        c = parent.get(c)!;
      }
      return path;
    }
    if (d > (dist.get(curr) ?? Infinity)) continue;

    for (const nb of gridNeighbors(curr, GRID)) {
      if (blocked.has(nb)) continue;
      const nbPt = { x: nb % GRID, y: Math.floor(nb / GRID) };
      const stepCost = edgeStepCost(nbPt, GRID);
      const newDist = d + stepCost;
      const oldDist = dist.get(nb) ?? Infinity;
      if (newDist < oldDist) {
        dist.set(nb, newDist);
        parent.set(nb, curr);
        pq.push([newDist, nb]);
      }
    }
  }
  return null;
}

/** Flood-fill: can src reach dst through non-body cells? */
function canReach(src: Pt, dst: Pt, snake: Pt[], GRID: number): boolean {
  const srcKey = ptKey(src, GRID);
  const dstKey = ptKey(dst, GRID);
  if (srcKey === dstKey) return true; // trivially reachable (handles length-1 snake)

  const blocked = new Set(snake.map(p => ptKey(p, GRID)));
  blocked.delete(srcKey);
  blocked.delete(dstKey);

  const visited = new Set<number>([srcKey]);
  const queue: number[] = [srcKey];

  while (queue.length > 0) {
    const curr = queue.shift()!;
    for (const nb of gridNeighbors(curr, GRID)) {
      if (visited.has(nb) || blocked.has(nb)) continue;
      if (nb === dstKey) return true;
      visited.add(nb);
      queue.push(nb);
    }
  }
  return false;
}

/**
 * Count cells reachable from head through non-body cells.
 * Used for the eating safety check: we need enough open space for the
 * grown snake to maneuver, which head→tail connectivity can't capture
 * when the body separates the two endpoints.
 */
function floodCount(head: Pt, snake: Pt[], GRID: number): number {
  const headKey = ptKey(head, GRID);
  const blocked = new Set(snake.map(p => ptKey(p, GRID)));
  blocked.delete(headKey);

  let count = 1;
  const visited = new Set<number>([headKey]);
  const queue: number[] = [headKey];

  while (queue.length > 0) {
    const curr = queue.shift()!;
    for (const nb of gridNeighbors(curr, GRID)) {
      if (visited.has(nb) || blocked.has(nb)) continue;
      visited.add(nb);
      count++;
      queue.push(nb);
    }
  }
  return count;
}

/**
 * Check if a cell is occupied by the snake body (excludes head).
 */
function isBodyOccupied(pt: Pt, snake: Pt[], GRID: number): boolean {
  const key = ptKey(pt, GRID);
  return snake.some((p, i) => i > 0 && ptKey(p, GRID) === key);
}

/**
 * Simulate exactly ONE step (eating if nextHead is the food cell) and verify
 * that the resulting head can still reach the resulting tail.
 *
 * Because the path is recalculated every tick, a single-step check is the
 * right granularity: we only commit to one move at a time, so checking the
 * full path ahead is both unnecessary and misleading (intermediate body
 * positions during a multi-step simulation differ from reality, since the
 * real snake reconsiders every tick and may take a different route).
 *
 * Head-can-reach-tail ≡ the snake can always "unwind" behind itself, meaning
 * it can never be permanently trapped by its own body.
 */
function isStepSafe(nextHead: Pt, snake: Pt[], food: Pt, GRID: number): boolean {
  const willEat = nextHead.x === food.x && nextHead.y === food.y;
  const simSnake = willEat ? [nextHead, ...snake] : [nextHead, ...snake.slice(0, -1)];
  return canReach(simSnake[0], simSnake[simSnake.length - 1], simSnake, GRID);
}

/**
 * Find a safe move: neighbor not occupied by body with floodCount >= snakeLength.
 * When preferPt is provided and valid it is returned immediately (Hamiltonian hint).
 * Otherwise returns the neighbor with the largest reachable free space, preferring interior over edge.
 */
function findSafeMove(
  head: Pt,
  snake: Pt[],
  GRID: number,
  preferPt?: Pt | null
): Pt | null {
  const neighbors = getNeighborPts(head, GRID);
  let bestPt: Pt | null = null;
  let bestCount = -1;
  const EDGE_PENALTY = 50; // prefer interior when both are safe

  for (const pt of neighbors) {
    if (isBodyOccupied(pt, snake, GRID)) continue;
    const newSnake = [pt, ...snake.slice(0, -1)];
    const count = floodCount(pt, newSnake, GRID);
    if (count < newSnake.length) continue;

    // Immediately honour the hinted cell (e.g. Hamiltonian next step)
    if (preferPt && pt.x === preferPt.x && pt.y === preferPt.y) return pt;

    const effectiveCount = count - (isNearEdge(pt, GRID) ? EDGE_PENALTY : 0);
    if (effectiveCount > bestCount) {
      bestCount = effectiveCount;
      bestPt = pt;
    }
  }
  return bestPt;
}

// ── Component ──────────────────────────────────────────────────────────────

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const dprRef    = useRef(1);
  const dirQueue  = useRef<Dir[]>([]);

  const g = useRef({
    state:     'idle' as GameState,
    snake:     [{ x: 7, y: 7 }] as Pt[],
    dir:       'R' as Dir,
    food:      { x: 11, y: 7 } as Pt,
    score:     0,
    speed:     BASE_SPEED,
    lastTick:  0,
    frame:     0,
    eatFlash:  0,
  });

  // ── Auto mode ────────────────────────────────────────────────────────────
  const autoModeRef          = useRef(false);
  const hamiltonianCycleRef  = useRef<Pt[]>([]);
  const hamiltonianIndexRef  = useRef<number[]>([]); // cell key → cycle index
  const autoPathRef          = useRef<Pt[]>([]);     // for visualization
  const autoPhaseRef         = useRef<1 | 2>(1);     // current AI phase
  const gridRef              = useRef(16);            // current GRID for RAF closures
  const autoThresholdRef     = useRef(AUTO_THRESHOLD_S);
  const startGameRef         = useRef<() => void>(() => {});

  // React state (overlay re-renders only)
  const [uiState, setUiState]         = useState<GameState>('idle');
  const [score, setScore]             = useState(0);
  const [sessionBest, setSessionBest] = useState(0);
  const [pb, setPb]                   = useState(0);
  const [isTouch, setIsTouch]         = useState(false);
  const [gridSize, setGridSize]       = useState<'S' | 'L'>('S');
  const [showGridToggle, setShowGridToggle] = useState(false);
  const [autoMode, setAutoMode]       = useState(false);
  const [autoPhaseUI, setAutoPhaseUI] = useState<1 | 2>(1);

  const { GRID, CELL } = GRID_CONFIG[gridSize];
  const SIZE      = GRID * CELL;
  const MAX_SCORE = GRID * GRID - 1;
  const speedMult = gridSize === 'L' ? 0.5 : 1;

  // Keep refs current on each render
  gridRef.current         = GRID;
  autoThresholdRef.current = gridSize === 'S' ? AUTO_THRESHOLD_S : AUTO_THRESHOLD_L;

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(getLsKey(gridSize));
    setPb(saved ? parseInt(saved, 10) : 0);
  }, [gridSize]);

  useEffect(() => {
    const check = () => setShowGridToggle(window.innerWidth >= MIN_WIDTH_FOR_LARGE);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Build / rebuild Hamiltonian cycle whenever grid changes
  useEffect(() => {
    const cycle = buildHamiltonianCycle(GRID);
    hamiltonianCycleRef.current = cycle;
    const indexMap = new Array(GRID * GRID).fill(0);
    cycle.forEach((pt, i) => { indexMap[pt.y * GRID + pt.x] = i; });
    hamiltonianIndexRef.current = indexMap;
  }, [GRID]);

  // Auto-restart only after game-over/win — not when the user just toggles the mode on idle
  useEffect(() => {
    if (autoMode && (uiState === 'over' || uiState === 'won')) {
      const t = setTimeout(() => startGameRef.current(), 700);
      return () => clearTimeout(t);
    }
  }, [autoMode, uiState]);

  // ── Canvas setup ──────────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    cancelAnimationFrame(rafRef.current);
    dispatchCursorGamePlaying(false);
    dirQueue.current   = [];
    autoPathRef.current = [];
    g.current = {
      state: 'idle', snake: [SNAKE_START], dir: 'R',
      food: FOOD_START, score: 0, speed: BASE_SPEED,
      lastTick: 0, frame: 0, eatFlash: 0,
    };
    setScore(0);
    setUiState('idle');

    const dpr = window.devicePixelRatio || 1;
    dprRef.current = dpr;
    canvas.width  = SIZE * dpr;
    canvas.height = SIZE * dpr;
    canvas.style.width  = `${SIZE}px`;
    canvas.style.height = `${SIZE}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    draw();
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridSize, SIZE]);

  // ── Draw ──────────────────────────────────────────────────────────────────

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const state = g.current;
    state.frame++;

    // Background
    const bgGrad = ctx.createLinearGradient(0, 0, SIZE, SIZE);
    bgGrad.addColorStop(0, '#130825');
    bgGrad.addColorStop(1, '#010101');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Grid lines
    ctx.strokeStyle = 'rgba(156, 91, 184, 0.15)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (let i = 0; i <= GRID; i++) {
      const p = i * CELL;
      ctx.moveTo(p, 0); ctx.lineTo(p, SIZE);
      ctx.moveTo(0, p); ctx.lineTo(SIZE, p);
    }
    ctx.stroke();

    // Eat flash
    if (state.eatFlash > 0) {
      ctx.fillStyle = `rgba(139, 7, 159, ${state.eatFlash * 0.03})`;
      ctx.fillRect(0, 0, SIZE, SIZE);
      state.eatFlash--;
    }

    // ── Auto-mode path visualization ────────────────────────────────────────
    if (autoModeRef.current && state.state === 'playing') {
      const pts = autoPathRef.current;
      if (pts.length > 0) {
        if (autoPhaseRef.current === 2) {
          // Phase 2: fading dot trail along Hamiltonian cycle ahead
          for (let i = 0; i < pts.length; i++) {
            const t     = i / pts.length;
            const alpha = 0.22 * (1 - t * t); // quadratic fade
            const cx = pts[i].x * CELL + CELL / 2;
            const cy = pts[i].y * CELL + CELL / 2;
            ctx.fillStyle = `rgba(168, 85, 247, ${alpha})`;
            ctx.beginPath();
            ctx.arc(cx, cy, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          // Phase 1: animated dashed route to food
          ctx.save();
          ctx.strokeStyle = 'rgba(244, 114, 182, 0.35)';
          ctx.lineWidth   = 1.5;
          ctx.setLineDash([4, 6]);
          ctx.lineDashOffset = -(state.frame * 0.5) % 10; // marching ants
          ctx.shadowBlur  = 6;
          ctx.shadowColor = 'rgba(244, 114, 182, 0.5)';
          ctx.beginPath();
          const head = state.snake[0];
          ctx.moveTo(head.x * CELL + CELL / 2, head.y * CELL + CELL / 2);
          pts.forEach(pt => ctx.lineTo(pt.x * CELL + CELL / 2, pt.y * CELL + CELL / 2));
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    // Food — pulsing radial glow orb
    if (state.state !== 'idle') {
      const food  = state.food;
      const pulse = Math.sin(state.frame * 0.07) * 0.5 + 0.5;
      const fx = food.x * CELL + CELL / 2;
      const fy = food.y * CELL + CELL / 2;
      const foodR = 3.5 + pulse * 2;

      const grad = ctx.createRadialGradient(fx, fy, 0, fx, fy, CELL * 0.9);
      grad.addColorStop(0, `rgba(217, 70, 239, ${0.28 + pulse * 0.15})`);
      grad.addColorStop(0.5, `rgba(168, 85, 247, ${0.09 + pulse * 0.06})`);
      grad.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(fx, fy, CELL * 0.9, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur  = 7;
      ctx.shadowColor = '#d946ef';
      ctx.fillStyle   = '#e879f9';
      ctx.beginPath();
      ctx.arc(fx, fy, foodR, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Snake — tail → head so head glow sits on top
    const snake = state.snake;
    const len   = snake.length;
    for (let i = len - 1; i >= 0; i--) {
      const seg    = snake[i];
      const isHead = i === 0;
      const t      = len > 1 ? i / (len - 1) : 0;

      ctx.fillStyle = lerpRGB(HEAD_RGB, TAIL_RGB, t);
      if (isHead) {
        ctx.shadowBlur  = 9;
        ctx.shadowColor = '#f472b6';
      } else if (i < 5) {
        ctx.shadowBlur  = Math.max(1, Math.floor((7 - i) / 2));
        ctx.shadowColor = '#c026d3';
      } else {
        ctx.shadowBlur = 0;
      }

      const pad    = isHead ? 1 : 2;
      const radius = isHead ? 5 : 3;
      const x = seg.x * CELL + pad;
      const y = seg.y * CELL + pad;
      const w = CELL - pad * 2;
      const h = CELL - pad * 2;

      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(x, y, w, h, radius);
      } else {
        ctx.rect(x, y, w, h);
      }
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // Eyes
    if (len > 0) {
      const head = snake[0];
      const d    = state.dir;
      const hx   = head.x * CELL + CELL / 2;
      const hy   = head.y * CELL + CELL / 2;
      const eo   = 3.5;
      const [e1x, e1y, e2x, e2y] =
        d === 'R' ? [2, -eo, 2,  eo] :
        d === 'L' ? [-2, -eo, -2,  eo] :
        d === 'U' ? [-eo, -2,  eo, -2] :
                    [-eo,  2,  eo,  2];
      ctx.fillStyle   = 'rgba(255,255,255,0.92)';
      ctx.shadowBlur  = 0;
      ctx.beginPath(); ctx.arc(hx + e1x, hy + e1y, 1.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(hx + e2x, hy + e2y, 1.5, 0, Math.PI * 2); ctx.fill();
    }
  };

  // ── Game lifecycle ─────────────────────────────────────────────────────────

  const endGame = (won = false) => {
    const state  = g.current;
    state.state  = won ? 'won' : 'over';
    dispatchCursorGamePlaying(false);
    cancelAnimationFrame(rafRef.current);
    autoPathRef.current = [];

    const finalScore = state.score;
    if (!autoModeRef.current) {
      setSessionBest(prev => Math.max(prev, finalScore));
      setPb(prev => {
        const newPb = Math.max(prev, finalScore);
        localStorage.setItem(getLsKey(gridSize), String(newPb));
        return newPb;
      });
    }
    setUiState(won ? 'won' : 'over');
    draw();
  };

  const loop = (ts: number) => {
    const state = g.current;
    if (state.state !== 'playing') return;

    if (ts - state.lastTick >= state.speed) {
      state.lastTick = ts;

      // ── Direction decision ───────────────────────────────────────────────
      if (autoModeRef.current) {
        const GRID_N    = gridRef.current;
        const cycle     = hamiltonianCycleRef.current;
        const indexMap  = hamiltonianIndexRef.current;
        const threshold = autoThresholdRef.current;
        const { snake, food, score: sc } = state;
        const head      = snake[0];
        const headKey   = ptKey(head, GRID_N);
        const headIdx   = indexMap[headKey];

        if (sc >= threshold) {
          // ── Phase 2: Hamiltonian cycle, but verify next cell isn't blocked by body ──
          autoPhaseRef.current = 2;
          const nextPt = cycle[(headIdx + 1) % cycle.length];
          if (!isBodyOccupied(nextPt, snake, GRID_N)) {
            state.dir = ptToDir(head, nextPt);
            const preview: Pt[] = [];
            for (let i = 1; i <= GRID_N; i++) {
              preview.push(cycle[(headIdx + i) % cycle.length]);
            }
            autoPathRef.current = preview;
          } else {
            // Next cell on cycle is blocked — find safe alternative (chase tail or any safe move)
            const tail = snake[snake.length - 1];
            const pathToTail = bfsPath(head, tail, snake, GRID_N);
            if (pathToTail && pathToTail.length > 0) {
              const nextHead = pathToTail[0];
              const newSnake = [nextHead, ...snake.slice(0, -1)];
              if (floodCount(nextHead, newSnake, GRID_N) >= newSnake.length) {
                state.dir = ptToDir(head, nextHead);
                autoPathRef.current = pathToTail;
              } else {
                const safePt = findSafeMove(head, snake, GRID_N, nextPt);
                if (safePt) {
                  state.dir = ptToDir(head, safePt);
                  autoPathRef.current = [safePt];
                } else {
                  state.dir = ptToDir(head, nextPt);
                  autoPathRef.current = [];
                }
              }
            } else {
              const safePt = findSafeMove(head, snake, GRID_N, nextPt);
              if (safePt) {
                state.dir = ptToDir(head, safePt);
                autoPathRef.current = [safePt];
              } else {
                state.dir = ptToDir(head, nextPt);
                autoPathRef.current = [];
              }
            }
          }
        } else {
          // ── Phase 1: Path to food (prefer avoiding edges) if step is safe; scored fallback otherwise ──
          autoPhaseRef.current = 1;
          let moved = false;

          // Use edge-avoiding path to food when moving one step leaves snake safe.
          // Prefers interior routes; will still go to edge when food is there.
          const path = pathToTargetAvoidingEdges(head, food, snake, GRID_N);
          if (path && path.length > 0 && isStepSafe(path[0], snake, food, GRID_N)) {
            state.dir = ptToDir(head, path[0]);
            autoPathRef.current = path;
            moved = true;
          }

          if (!moved) {
            // BFS step is unsafe or no path exists.
            // Score every safe neighbour using two hard tiers:
            //   Tier A (tail reachable): snake can always unwind — these win outright.
            //     Within tier A, prefer food-accessible moves, then most free space.
            //   Tier B (tail not reachable): backup only if tier A is empty.
            //     Pick the move that leaves the most free space.
            // "Tail reachable" is a hard requirement, not just a bonus, because
            // taking a move where the tail is cut off guarantees eventual death.
            const GRID_CELLS = GRID_N * GRID_N;
            const neighbors = getNeighborPts(head, GRID_N);
            const tail = snake[snake.length - 1];

            let bestSafePt: Pt | null = null;   // tier A
            let bestSafeScore = -Infinity;
            let bestAnyPt: Pt | null = null;     // tier B
            let bestAnySpace = -1;

            const EDGE_PENALTY = GRID_CELLS * 0.3; // prefer interior when we have a choice
            for (const pt of neighbors) {
              if (isBodyOccupied(pt, snake, GRID_N)) continue;
              const newSnake = [pt, ...snake.slice(0, -1)];
              const space = floodCount(pt, newSnake, GRID_N);
              if (space < newSnake.length) continue; // dead-end pocket

              const tailOk = canReach(pt, tail, newSnake, GRID_N);
              const foodOk = canReach(pt, food, newSnake, GRID_N);
              const nearEdge = isNearEdge(pt, GRID_N);

              if (tailOk) {
                const score = (foodOk ? GRID_CELLS : 0) + space - (nearEdge ? EDGE_PENALTY : 0);
                if (score > bestSafeScore) { bestSafeScore = score; bestSafePt = pt; }
              } else {
                const score = space - (nearEdge ? EDGE_PENALTY : 0);
                if (score > bestAnySpace) { bestAnySpace = score; bestAnyPt = pt; }
              }
            }

            const chosen = bestSafePt ?? bestAnyPt;
            if (chosen) {
              state.dir = ptToDir(head, chosen);
              autoPathRef.current = [chosen];
              moved = true;
            }
          }

          if (!moved) {
            // Absolute last resort: next Hamiltonian step (may self-collide, unavoidable).
            const nextPt = cycle[(headIdx + 1) % cycle.length];
            state.dir = ptToDir(head, nextPt);
            autoPathRef.current = [];
          }
        }

        // Sync phase to UI (cheap; skip re-render if unchanged)
        setAutoPhaseUI(autoPhaseRef.current);
      } else {
        if (dirQueue.current.length > 0) state.dir = dirQueue.current.shift()!;
      }

      // ── Move ─────────────────────────────────────────────────────────────
      const head = state.snake[0];
      const d    = state.dir;
      const next: Pt = {
        x: head.x + (d === 'R' ? 1 : d === 'L' ? -1 : 0),
        y: head.y + (d === 'D' ? 1 : d === 'U' ? -1 : 0),
      };

      // Exclude the tail from self-collision: it vacates its cell this same tick
      // (unless we eat, but food can never spawn on the tail via randomFood).
      const bodyWithoutTail = state.snake.slice(0, -1);
      if (
        next.x < 0 || next.x >= GRID ||
        next.y < 0 || next.y >= GRID ||
        bodyWithoutTail.some(s => s.x === next.x && s.y === next.y)
      ) {
        endGame();
        return;
      }

      state.snake = [next, ...state.snake];

      if (next.x === state.food.x && next.y === state.food.y) {
        state.score++;
        state.eatFlash = 10;
        setScore(state.score);
        if (!autoModeRef.current) setSessionBest(prev => Math.max(prev, state.score));
        if (state.score >= MAX_SCORE) { endGame(true); return; }
        state.food  = randomFood(state.snake, GRID);
        state.speed = autoModeRef.current ? AUTO_SPEED : speedFromScore(state.score) * speedMult;
      } else {
        state.snake.pop();
      }
    }

    draw();
    rafRef.current = requestAnimationFrame(loop);
  };

  const startGame = () => {
    cancelAnimationFrame(rafRef.current);
    const state      = g.current;
    state.state      = 'playing';
    state.snake      = [SNAKE_START];
    state.dir        = 'R';
    dirQueue.current  = [];
    autoPathRef.current = [];
    state.food       = randomFood(state.snake, GRID);
    state.score      = 0;
    state.speed      = autoModeRef.current ? AUTO_SPEED : BASE_SPEED * speedMult;
    state.lastTick   = 0;
    state.frame      = 0;
    state.eatFlash   = 0;
    autoPhaseRef.current = 1;

    setScore(0);
    setUiState('playing');
    setAutoPhaseUI(1);
    // Don't steal the cursor when the AI is driving — user is just watching
    if (!autoModeRef.current) dispatchCursorGamePlaying(true);
    rafRef.current = requestAnimationFrame(loop);
  };

  // Always keep startGameRef current so the auto-restart effect can call it
  startGameRef.current = startGame;

  // ── Keyboard controls ──────────────────────────────────────────────────────

  useEffect(() => {
    const keyMap: Record<string, Dir> = {
      ArrowUp: 'U', w: 'U', W: 'U',
      ArrowDown: 'D', s: 'D', S: 'D',
      ArrowLeft: 'L', a: 'L', A: 'L',
      ArrowRight: 'R', d: 'R', D: 'R',
    };

    const onKey = (e: KeyboardEvent) => {
      // Block manual input while auto is running
      if (autoModeRef.current) return;

      const dir = keyMap[e.key];
      if (!dir) return;
      if (e.key.startsWith('Arrow')) e.preventDefault();
      const q    = dirQueue.current;
      const last = q.length > 0 ? q[q.length - 1] : g.current.dir;
      if (dir !== OPP[last] && q.length < QUEUE_MAX) q.push(dir);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // ── Touch swipe ────────────────────────────────────────────────────────────

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    let sx = 0, sy = 0;

    const onTouchStart = (e: TouchEvent) => {
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (g.current.state !== 'playing' || autoModeRef.current) return;
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      let dir: Dir | null = null;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) > 15) dir = dx > 0 ? 'R' : 'L';
      } else {
        if (Math.abs(dy) > 15) dir = dy > 0 ? 'D' : 'U';
      }
      if (dir) {
        const q = dirQueue.current;
        const last = q.length > 0 ? q[q.length - 1] : g.current.dir;
        if (dir !== OPP[last] && q.length < QUEUE_MAX) q.push(dir);
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend',   onTouchEnd,   { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend',   onTouchEnd);
    };
  }, []);

  // ── D-pad ──────────────────────────────────────────────────────────────────

  const dpad = (dir: Dir) => {
    if (g.current.state !== 'playing' || autoModeRef.current) return;
    const q    = dirQueue.current;
    const last = q.length > 0 ? q[q.length - 1] : g.current.dir;
    if (dir !== OPP[last] && q.length < QUEUE_MAX) q.push(dir);
  };

  const toggleGridSize = () => setGridSize(prev => (prev === 'S' ? 'L' : 'S'));

  const toggleAutoMode = () => {
    const next = !autoModeRef.current;
    autoModeRef.current = next;
    setAutoMode(next);
  };

  const stopGame = () => {
    cancelAnimationFrame(rafRef.current);
    dispatchCursorGamePlaying(false);
    autoPathRef.current = [];
    g.current.state = 'idle';
    setUiState('idle');
    draw();
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const isNewBest = !autoMode && score > 0 && score >= pb;

  return (
    <section
      className="w-full flex flex-col items-center pb-16 lg:pb-24 px-4"
      style={{ background: 'linear-gradient(180deg, #020202 0%,rgb(8, 0, 21) 50%, #020202 100%)' }}
    >
      <h2 className="font-audiowide text-xl lg:text-2xl text-white mb-6 text-center">
        Play some snake before you leave
      </h2>

      <div className="flex flex-col" style={{ width: SIZE }}>
        {/* Score bar */}
        <div
          className="flex items-center justify-between px-4 py-2 rounded-t-xl min-h-[43px]"
          style={{
            background: '#0a000f',
            border: '1px solid rgba(80, 0, 100, 0.7)',
            borderBottom: 'none',
          }}
        >
          <div className="font-urbanist text-sm flex-1 min-w-0">
            <span style={{ color: '#7c3aed' }}>Score </span>
            <span className="font-bold tabular-nums" style={{ color: '#f472b6' }}>{score}</span>
          </div>

          {/* STOP button — visible only while auto is actively playing */}
          {autoMode && uiState === 'playing' && (
            <button
              type="button"
              onClick={stopGame}
              className="font-urbanist text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 mx-2 transition-all hover:brightness-125 active:scale-95"
              style={{
                color: '#f472b6',
                background: 'rgba(244, 114, 182, 0.12)',
                border: '1px solid rgba(244, 114, 182, 0.35)',
                boxShadow: '0 0 8px rgba(244, 114, 182, 0.25)',
                letterSpacing: '0.08em',
              }}
              aria-label="Stop AI game"
            >
              STOP
            </button>
          )}

          {showGridToggle && (!autoMode || uiState !== 'playing') && (
            <button
              type="button"
              onClick={toggleGridSize}
              className="font-urbanist text-xs font-medium px-2 py-1 rounded transition-all select-none shrink-0 hover:brightness-125"
              style={{
                color: '#f472b6',
                background: 'rgba(124, 58, 237, 0.2)',
                border: '1px solid rgba(244, 114, 182, 0.3)',
              }}
              aria-label={`Grid size: ${gridSize === 'S' ? 'Small' : 'Large'}. Click to toggle.`}
            >
              <span style={{ opacity: gridSize === 'S' ? 1 : 0.5 }}>S</span>
              <span className="mx-1" style={{ color: '#a78bfa', opacity: 0.6 }}>|</span>
              <span style={{ opacity: gridSize === 'L' ? 1 : 0.5 }}>L</span>
            </button>
          )}

          {(!autoMode || uiState !== 'playing') && (
            <div className="font-urbanist text-sm text-right flex-1 min-w-0">
              <span style={{ color: '#7c3aed' }}>Best </span>
              <span className="font-bold tabular-nums" style={{ color: '#f472b6' }}>{pb}</span>
            </div>
          )}
        </div>

        {/* Canvas + overlays */}
        <div
          className="relative overflow-hidden"
          style={{
            width: SIZE,
            height: SIZE,
            border: '1px solid rgba(80, 0, 100, 0.7)',
            boxShadow: '0 0 60px rgba(124,58,237,0.07), 0 0 120px rgba(244,114,182,0.03)',
            ...(uiState === 'playing' && { touchAction: 'none' }),
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              display: 'block',
              touchAction: uiState === 'playing' ? 'none' : undefined,
            }}
          />

          {/* Idle overlay */}
          {uiState === 'idle' && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-4"
              style={{ background: 'rgba(6, 0, 14, 0.88)', backdropFilter: 'blur(3px)' }}
            >
              <AutoToggle on={autoMode} onToggle={toggleAutoMode} />
              <Button
                variant="secondary"
                size="lg"
                className="h-[40px] bg-[#7c3aed] hover:bg-[#7c3aed]/90"
                onClick={startGame}
              >
                {autoMode ? 'Watch AI' : 'Start Game'}
              </Button>
            </div>
          )}

          {/* Game over overlay */}
          {uiState === 'over' && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-2"
              style={{ background: 'rgba(6, 0, 14, 0.90)', backdropFilter: 'blur(5px)' }}
            >
              <p
                className="font-audiowide text-lg mb-1"
                style={{ color: '#f472b6', textShadow: '0 0 20px rgba(244,114,182,0.45)' }}
              >
                Game Over
              </p>
              <p className="font-urbanist text-sm" style={{ color: '#a78bfa' }}>
                Score: <span className="font-bold" style={{ color: '#f472b6' }}>{score}</span>
              </p>
              {isNewBest && (
                <p className="font-urbanist text-xs" style={{ color: '#d946ef' }}>
                  ✦ New Personal Best!
                </p>
              )}
              <div className={isNewBest ? 'mt-2 flex flex-col items-center gap-3' : 'mt-3 flex flex-col items-center gap-3'}>
                <AutoToggle on={autoMode} onToggle={toggleAutoMode} />
                {autoMode ? (
                  <p className="font-urbanist text-xs" style={{ color: 'rgba(167,139,250,0.6)' }}>
                    restarting…
                  </p>
                ) : (
                  <Button
                    variant="secondary"
                    size="lg"
                    className="h-[40px] bg-[#7c3aed] hover:bg-[#7c3aed]/90"
                    onClick={startGame}
                  >
                    Play Again
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Win overlay */}
          {uiState === 'won' && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-2"
              style={{ background: 'rgba(6, 0, 14, 0.90)', backdropFilter: 'blur(5px)' }}
            >
              <p
                className="font-audiowide text-lg mb-1 text-center"
                style={{ color: '#f472b6', textShadow: '0 0 20px rgba(244,114,182,0.45)' }}
              >
                Well Done!
              </p>
              <p className="font-urbanist text-sm text-center" style={{ color: '#a78bfa' }}>
                You beat the game
              </p>
              <p className="font-urbanist text-sm text-center" style={{ color: '#a78bfa' }}>
                Score: <span className="font-bold" style={{ color: '#f472b6' }}>{score}</span>
              </p>
              {isNewBest && (
                <p className="font-urbanist text-xs" style={{ color: '#d946ef' }}>
                  ✦ New Personal Best!
                </p>
              )}
              <div className={isNewBest ? 'mt-2 flex flex-col items-center gap-3' : 'mt-3 flex flex-col items-center gap-3'}>
                <AutoToggle on={autoMode} onToggle={toggleAutoMode} />
                {autoMode ? (
                  <p className="font-urbanist text-xs" style={{ color: 'rgba(167,139,250,0.6)' }}>
                    restarting…
                  </p>
                ) : (
                  <Button
                    variant="secondary"
                    size="lg"
                    className="h-[40px] bg-[#7c3aed] hover:bg-[#7c3aed]/90"
                    onClick={startGame}
                  >
                    Play Again
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-center rounded-b-xl"
          style={{
            background: '#0a000f',
            border: '1px solid rgba(80, 0, 100, 0.7)',
            borderTop: 'none',
            minHeight: isTouch ? 180 : 32,
            padding: isTouch ? '12px 16px' : '6px 16px',
          }}
        >
          {isTouch ? (
            <div className="relative flex flex-col items-center w-full gap-3">
              <span className="font-urbanist text-xs" style={{ color: '#a78bfa' }}>
                Swipe or use the arrows
              </span>
              <DpadButton dir="U" onClick={() => dpad('U')} icon="↑" />
              <div className="flex items-center justify-center gap-3">
                <DpadButton dir="L" onClick={() => dpad('L')} icon="←" />
                <DpadButton dir="D" onClick={() => dpad('D')} icon="↓" />
                <DpadButton dir="R" onClick={() => dpad('R')} icon="→" />
              </div>
            </div>
          ) : (
            <span className="font-urbanist text-xs" style={{ color: '#a78bfa' }}>
              {autoMode
                ? (autoPhaseUI === 2 ? '∞ hamiltonian cycle' : '⬡ pathfinding')
                : '🠜·🠝·🠟·🠞  OR  W·A·S·D'}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────

function AutoToggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-2 select-none transition-opacity hover:opacity-90"
      aria-pressed={on}
      aria-label={on ? 'Disable AI auto-play' : 'Enable AI auto-play'}
    >
      {/* pill track */}
      <span
        className="relative inline-flex items-center rounded-full transition-all duration-200"
        style={{
          width: 36,
          height: 20,
          background: on
            ? 'linear-gradient(90deg, #7c3aed, #c026d3)'
            : 'rgba(255,255,255,0.1)',
          border: on
            ? '1px solid rgba(192,38,211,0.6)'
            : '1px solid rgba(255,255,255,0.18)',
          boxShadow: on ? '0 0 8px rgba(192,38,211,0.45)' : 'none',
        }}
      >
        {/* thumb */}
        <span
          className="absolute rounded-full transition-all duration-200"
          style={{
            width: 14,
            height: 14,
            left: on ? 19 : 2,
            background: on ? '#f0abfc' : 'rgba(255,255,255,0.5)',
            boxShadow: on ? '0 0 4px rgba(240,171,252,0.6)' : 'none',
          }}
        />
      </span>
      <span
        className="font-urbanist text-xs font-medium"
        style={{ color: on ? '#e879f9' : 'rgba(167,139,250,0.6)' }}
      >
        {on ? 'AI mode' : 'AI mode'}
      </span>
    </button>
  );
}

function DpadButton({ dir, onClick, icon }: { dir: Dir; onClick: () => void; icon: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center w-14 h-14 rounded-xl select-none active:scale-95 transition-transform"
      style={{
        background: 'rgba(43, 11, 50, 0.48)',
        border: '1px solid rgba(244, 114, 182, 0.22)',
        color: 'rgba(244, 114, 182, 0.52)',
        fontSize: '1.25rem',
      }}
      aria-label={`Move ${dir === 'U' ? 'up' : dir === 'D' ? 'down' : dir === 'L' ? 'left' : 'right'}`}
    >
      {icon}
    </button>
  );
}
