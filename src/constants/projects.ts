export type ProjectId = 'grq' | 'stepcrafter' | 'more';
export type TechGroup = 'frontend' | 'backend' | 'contracts' | 'hosting' | 'watch';

export interface ProjectScreenshot {
  filename: string;
  width: number;
  height: number;
}

export interface Project {
  id: ProjectId;
  active?: boolean;
  customerUrl?: string;
  website?: string;
  websiteLabel?: 'website' | 'github';
  preview: string;
  screenshots: ProjectScreenshot[];
  /** Optional link under each screenshot title, in the same order as `screenshots`. */
  screenshotUrls?: string[];
  tech: { group: TechGroup; tools: string[] }[];
}

export function screenshotSrc(id: ProjectId, screenshot: ProjectScreenshot) {
  return `/demos/${id}/${screenshot.filename}`;
}

export const projects: Project[] = [
  {
    id: 'grq',
    active: false,
    customerUrl: 'https://www.imdb.com/name/nm0077149/',
    preview: '/demos/grq/preview.webp',
    screenshots: [
      { filename: '01.webp', width: 995, height: 907 },
      { filename: '02.webp', width: 995, height: 907 },
      { filename: '03.webp', width: 995, height: 907 },
      { filename: '04.webp', width: 995, height: 907 },
      { filename: '05.webp', width: 995, height: 907 },
      { filename: '06.webp', width: 995, height: 907 },
      { filename: '07.webp', width: 995, height: 907 },
    ],
    tech: [
      { group: 'frontend', tools: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Three.js'] },
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
    screenshots: [
      { filename: '01.webp', width: 795, height: 795 },
      { filename: '02.webp', width: 1250, height: 1250 },
      { filename: '03.webp', width: 1250, height: 1250 },
      { filename: '04.webp', width: 1250, height: 1250 },
      { filename: '05.webp', width: 1250, height: 1250 },
    ],
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
    screenshots: [
      { filename: '01.webp', width: 1200, height: 635 },
      { filename: '02.webp', width: 1440, height: 720 },
    ],
    screenshotUrls: [
      'https://github.com/opticoding/snake-dash',
      'https://github.com/opticoding/investment-gains-calculator',
    ],
    tech: [],
  },
];
