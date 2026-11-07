export type ProjectId = 'grq' | 'stepcrafter' | 'more';
export type TechGroup = 'frontend' | 'backend' | 'contracts' | 'hosting' | 'watch';

export interface Project {
  id: ProjectId;
  active?: boolean;
  customerUrl?: string;
  website?: string;
  websiteLabel?: 'website' | 'github';
  preview: string;
  screenshots: string[];
  /** Optional link under each screenshot title, in the same order as `screenshots`. */
  screenshotUrls?: string[];
  tech: { group: TechGroup; tools: string[] }[];
}

export function screenshotSrc(id: ProjectId, filename: string) {
  return `/demos/${id}/${filename}`;
}

export const projects: Project[] = [
  {
    id: 'grq',
    active: false,
    customerUrl: 'https://www.imdb.com/name/nm0077149/',
    preview: '/demos/grq/preview.webp',
    screenshots: ['01.webp', '02.webp', '03.webp', '04.webp', '05.webp', '06.webp', '07.webp'],
    tech: [
      { group: 'frontend', tools: ['Next.js', 'TypeScript', 'Tailwind CSS', 'WebGL'] },
      { group: 'backend', tools: ['Node.js', 'PostgreSQL'] },
      { group: 'contracts', tools: ['Solidity'] },
      { group: 'hosting', tools: ['Google Cloud', 'Terraform'] },
    ],
  },
  {
    id: 'stepcrafter',
    active: true,
    website: 'https://stepcrafter.net',
    preview: '/demos/stepcrafter/preview.webp',
    screenshots: ['01.webp', '02.webp', '03.webp', '04.webp', '05.webp'],
    tech: [
      { group: 'frontend', tools: ['Next.js', 'TypeScript', 'Tailwind CSS'] },
      { group: 'backend', tools: ['Node.js', 'SQLite'] },
      { group: 'watch', tools: ['Garmin Monkey C'] },
    ],
  },
  {
    id: 'more',
    website: 'https://github.com/opticoding?tab=repositories',
    websiteLabel: 'github',
    preview: '/demos/more/preview.webp',
    screenshots: ['01.webp', '02.webp'],
    screenshotUrls: [
      'https://github.com/opticoding/snake-dash',
      'https://github.com/opticoding/investment-gains-calculator',
    ],
    tech: [],
  },
];
