'use client';

import { useEffect, useRef, useState } from 'react';
import { dispatchCursorGamePlaying } from '@/components/CustomCursor';
import { Button } from '@/components/ui/button';

// ── Constants ──────────────────────────────────────────────────────────────

const GRID = 15;
const CELL = 20;
const SIZE = GRID * CELL; // 300px

const BASE_SPEED = 300;
const MIN_SPEED = 60;
const SPEED_CONVERGE_SCORE = 40; // score at which speed approaches MIN_SPEED
const LS_KEY = 'opticode-snake-best';

type Dir = 'U' | 'D' | 'L' | 'R';
type Pt = { x: number; y: number };
type GameState = 'idle' | 'playing' | 'over';

const OPP: Record<Dir, Dir> = { U: 'D', D: 'U', L: 'R', R: 'L' };
const QUEUE_MAX = 4;

// Snake gradient: bright pink head → deep violet tail
const HEAD_RGB: [number, number, number] = [244, 114, 182];  // pink-400
const TAIL_RGB: [number, number, number] = [109,  40, 217];  // violet-600

function lerpRGB(a: [number, number, number], b: [number, number, number], t: number): string {
  return `rgb(${Math.round(a[0] * (1 - t) + b[0] * t)},${Math.round(a[1] * (1 - t) + b[1] * t)},${Math.round(a[2] * (1 - t) + b[2] * t)})`;
}

/** Exponential decay: fast at start, converges to MIN_SPEED around SPEED_CONVERGE_SCORE */
function speedFromScore(score: number): number {
  const decay = Math.exp(-score / (SPEED_CONVERGE_SCORE / 3.2));
  return Math.max(MIN_SPEED, Math.round(MIN_SPEED + (BASE_SPEED - MIN_SPEED) * decay));
}

function randomFood(snake: Pt[]): Pt {
  let f: Pt;
  do {
    f = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
  } while (snake.some(s => s.x === f.x && s.y === f.y));
  return f;
}

// ── Component ──────────────────────────────────────────────────────────────

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const dprRef = useRef(1);
  const dirQueue = useRef<Dir[]>([]);

  // All mutable game state in one ref — avoids stale closures in the RAF loop
  const g = useRef({
    state: 'idle' as GameState,
    snake: [{ x: 7, y: 7 }] as Pt[],
    dir: 'R' as Dir,
    food: { x: 11, y: 7 } as Pt,
    score: 0,
    speed: BASE_SPEED,
    lastTick: 0,
    frame: 0,
    eatFlash: 0,
  });

  // React state — only for overlay re-renders
  const [uiState, setUiState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [sessionBest, setSessionBest] = useState(0);
  const [pb, setPb] = useState(0);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) setPb(parseInt(saved, 10));
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // ── Canvas setup (DPR-aware for sharp retina rendering) ────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    dprRef.current = dpr;
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    canvas.style.width = `${SIZE}px`;
    canvas.style.height = `${SIZE}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    draw();
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Draw ─────────────────────────────────────────────────────────────────

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const state = g.current;
    state.frame++;

    // Background — same gradient as AboutMePopup (from-[#2B0B32] to-[#020202])
    const bgGrad = ctx.createLinearGradient(0, 0, SIZE, SIZE);
    bgGrad.addColorStop(0, '#130825');
    bgGrad.addColorStop(1, '#010101');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Subtle line grid
    ctx.strokeStyle = 'rgba(156, 91, 184, 0.15)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (let i = 0; i <= GRID; i++) {
      const p = i * CELL;
      ctx.moveTo(p, 0);
      ctx.lineTo(p, SIZE);
      ctx.moveTo(0, p);
      ctx.lineTo(SIZE, p);
    }
    ctx.stroke();

    // Eat flash effect
    if (state.eatFlash > 0) {
      ctx.fillStyle = `rgba(139, 7, 159, ${state.eatFlash * 0.03})`;
      ctx.fillRect(0, 0, SIZE, SIZE);
      state.eatFlash--;
    }

    // Food — pulsing radial glow orb
    const food = state.food;
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

    ctx.shadowBlur = 7;
    ctx.shadowColor = '#d946ef';
    ctx.fillStyle = '#e879f9';
    ctx.beginPath();
    ctx.arc(fx, fy, foodR, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake — render tail → head so head glow sits on top
    const snake = state.snake;
    const len = snake.length;

    for (let i = len - 1; i >= 0; i--) {
      const seg = snake[i];
      const isHead = i === 0;
      const t = len > 1 ? i / (len - 1) : 0;

      ctx.fillStyle = lerpRGB(HEAD_RGB, TAIL_RGB, t);

      if (isHead) {
        ctx.shadowBlur = 9;
        ctx.shadowColor = '#f472b6';
      } else if (i < 5) {
        ctx.shadowBlur = Math.max(1, Math.floor((7 - i) / 2));
        ctx.shadowColor = '#c026d3';
      } else {
        ctx.shadowBlur = 0;
      }

      const pad = isHead ? 1 : 2;
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

    // Eyes on head
    if (len > 0) {
      const head = snake[0];
      const d = state.dir;
      const hx = head.x * CELL + CELL / 2;
      const hy = head.y * CELL + CELL / 2;
      const eo = 3.5;
      const [e1x, e1y, e2x, e2y] =
        d === 'R' ? [2, -eo, 2,  eo] :
        d === 'L' ? [-2, -eo, -2,  eo] :
        d === 'U' ? [-eo, -2,  eo, -2] :
                    [-eo,  2,  eo,  2];

      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      ctx.shadowBlur = 0;
      ctx.beginPath(); ctx.arc(hx + e1x, hy + e1y, 1.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(hx + e2x, hy + e2y, 1.5, 0, Math.PI * 2); ctx.fill();
    }
  };

  // ── Game lifecycle ────────────────────────────────────────────────────────

  const endGame = () => {
    const state = g.current;
    state.state = 'over';
    dispatchCursorGamePlaying(false);
    cancelAnimationFrame(rafRef.current);

    const finalScore = state.score;
    setSessionBest(prev => Math.max(prev, finalScore));
    setPb(prev => {
      const newPb = Math.max(prev, finalScore);
      localStorage.setItem(LS_KEY, String(newPb));
      return newPb;
    });
    setUiState('over');
    draw();
  };

  const loop = (ts: number) => {
    const state = g.current;
    if (state.state !== 'playing') return;

    if (ts - state.lastTick >= state.speed) {
      state.lastTick = ts;
      if (dirQueue.current.length > 0) state.dir = dirQueue.current.shift()!;

      const head = state.snake[0];
      const d = state.dir;
      const next: Pt = {
        x: head.x + (d === 'R' ? 1 : d === 'L' ? -1 : 0),
        y: head.y + (d === 'D' ? 1 : d === 'U' ? -1 : 0),
      };

      if (
        next.x < 0 || next.x >= GRID ||
        next.y < 0 || next.y >= GRID ||
        state.snake.some(s => s.x === next.x && s.y === next.y)
      ) {
        endGame();
        return;
      }

      state.snake = [next, ...state.snake];

      if (next.x === state.food.x && next.y === state.food.y) {
        state.score++;
        state.eatFlash = 10;
        setScore(state.score);
        setSessionBest(prev => Math.max(prev, state.score));
        state.food = randomFood(state.snake);
        state.speed = speedFromScore(state.score);
      } else {
        state.snake.pop();
      }
    }

    draw();
    rafRef.current = requestAnimationFrame(loop);
  };

  const startGame = () => {
    cancelAnimationFrame(rafRef.current);
    const state = g.current;
    state.state = 'playing';
    state.snake = [{ x: 7, y: 7 }];
    state.dir = 'R';
    dirQueue.current = [];
    state.food = randomFood([{ x: 7, y: 7 }]);
    state.score = 0;
    state.speed = BASE_SPEED;
    state.lastTick = 0;
    state.frame = 0;
    state.eatFlash = 0;

    setScore(0);
    setUiState('playing');
    dispatchCursorGamePlaying(true);
    rafRef.current = requestAnimationFrame(loop);
  };

  // ── Keyboard controls ─────────────────────────────────────────────────────

  useEffect(() => {
    const keyMap: Record<string, Dir> = {
      ArrowUp: 'U', w: 'U', W: 'U',
      ArrowDown: 'D', s: 'D', S: 'D',
      ArrowLeft: 'L', a: 'L', A: 'L',
      ArrowRight: 'R', d: 'R', D: 'R',
    };

    const onKey = (e: KeyboardEvent) => {
      const dir = keyMap[e.key];
      if (!dir) return;
      // Always suppress arrow-key page scroll
      if (e.key.startsWith('Arrow')) e.preventDefault();
      // Push regardless of state; startGame wipes stale items before starting
      const q = dirQueue.current;
      const last = q.length > 0 ? q[q.length - 1] : g.current.dir;
      if (dir !== OPP[last] && q.length < QUEUE_MAX) q.push(dir);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // ── Touch swipe on canvas ─────────────────────────────────────────────────

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    let sx = 0, sy = 0;

    const onTouchStart = (e: TouchEvent) => {
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (g.current.state !== 'playing') return;
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
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  // ── D-pad tap handler ─────────────────────────────────────────────────────

  const dpad = (dir: Dir) => {
    if (g.current.state !== 'playing') return;
    const q = dirQueue.current;
    const last = q.length > 0 ? q[q.length - 1] : g.current.dir;
    if (dir !== OPP[last] && q.length < QUEUE_MAX) q.push(dir);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const isNewBest = score > 0 && score >= pb;

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
          className="flex items-center justify-between px-4 py-2 rounded-t-xl"
          style={{
            background: '#0a000f',
            border: '1px solid rgba(80, 0, 100, 0.7)',
            borderBottom: 'none',
          }}
        >
          <div className="font-urbanist text-sm">
            <span style={{ color: '#7c3aed' }}>Score </span>
            <span className="font-bold tabular-nums" style={{ color: '#f472b6' }}>{score}</span>
          </div>
          <div className="font-urbanist text-sm text-right">
            <span style={{ color: '#7c3aed' }}>Best </span>
            <span className="font-bold tabular-nums" style={{ color: '#f472b6' }}>{pb}</span>
          </div>
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
              <Button 
                variant="secondary"
                size="lg"
                className="h-[40px] bg-[#7c3aed] hover:bg-[#7c3aed]/90"
                
                onClick={startGame}
              >
                Start Game
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
              <div className={isNewBest ? 'mt-2' : 'mt-3'}>
                <Button 
                  variant="secondary"
                  size="lg"
                  className="h-[40px] bg-[#7c3aed] hover:bg-[#7c3aed]/90"
                  onClick={startGame}
                >
                  Play Again
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer — D-pad (touch) or hint text (desktop) */}
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
              🠜·🠝·🠟·🠞  OR  W·A·S·D
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────

function GameButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="font-urbanist font-bold text-sm px-8 py-2.5 rounded-full transition-shadow duration-200 select-none"
      style={{
        background: 'linear-gradient(135deg, #c026d3 0%, #7c3aed 100%)',
        color: 'white',
        boxShadow: '0 0 20px rgba(192, 38, 211, 0.35)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px rgba(244, 114, 182, 0.55)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(192, 38, 211, 0.35)';
      }}
    >
      {children}
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
