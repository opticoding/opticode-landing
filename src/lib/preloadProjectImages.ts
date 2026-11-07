import { preload } from 'react-dom';
import { projects, screenshotSrc, type Project } from '@/constants/projects';

interface ConnectionInfo {
  saveData?: boolean;
  effectiveType?: string;
}

export function preloadProjectImages(project: Project, includePreviews = false) {
  const connection = (navigator as Navigator & { connection?: ConnectionInfo }).connection;
  if (connection?.saveData || ['slow-2g', '2g'].includes(connection?.effectiveType ?? '')) return;

  const sources = project.screenshots.map((shot) => screenshotSrc(project.id, shot));
  if (includePreviews) sources.unshift(...projects.map((item) => item.preview));

  // React deduplicates these hints. Keep them out of render so static exports
  // never put gallery downloads on the initial page's critical path.
  for (const src of sources) preload(src, { as: 'image', fetchPriority: 'low' });
}
