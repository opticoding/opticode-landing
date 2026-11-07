'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import AnimatedText from '@/components/AnimatedText';
import { ArrowLeftIcon, ArrowRightIcon, ExternalLinkIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import ProjectGallery from '@/components/ProjectGallery';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { SectionId } from '@/constants/constants';
import { projects, screenshotSrc, type Project } from '@/constants/projects';
import styles from './ProjectsSection.module.css';

function ProjectPreview({ project }: { project: Project }) {
  const { t } = useLanguage();
  const [source, setSource] = useState(project.preview);
  const fallback = project.screenshots[0]
    ? screenshotSrc(project.id, project.screenshots[0])
    : project.preview;

  return (
    <div className={styles.preview}>
      <Image
        src={source}
        alt={`${t.projects.items[project.id].title} — ${t.projects.preview}`}
        width={1440}
        height={720}
        sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) calc(100vw - 64px), (max-width: 1439px) 55vw, 760px"
        className={styles.previewImage}
        onError={() => {
          if (source !== fallback) setSource(fallback);
        }}
      />
    </div>
  );
}

interface ProjectPickerProps {
  activeIndex: number;
  onSelect: (index: number) => void;
}

function ProjectPicker({ activeIndex, onSelect }: ProjectPickerProps) {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState({ start: false, end: false });

  const updateOverflow = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    setOverflow({ start: scroller.scrollLeft > 1, end: scroller.scrollLeft < maxScroll - 1 });
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    updateOverflow();
    const observer = new ResizeObserver(updateOverflow);
    observer.observe(scroller);
    if (scroller.firstElementChild) observer.observe(scroller.firstElementChild);
    return () => observer.disconnect();
  }, [updateOverflow]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const tab = scroller?.firstElementChild?.children[activeIndex] as HTMLElement | undefined;
    if (!scroller || !tab) return;
    scroller.scrollTo({
      left: tab.offsetLeft - (scroller.clientWidth - tab.offsetWidth) / 2,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }, [activeIndex, reduceMotion]);

  return (
    <div className={styles.projectPicker} data-overflow-start={overflow.start} data-overflow-end={overflow.end}>
      <div
        ref={scrollerRef}
        className={styles.projectTabs}
        role="group"
        aria-label={t.projects.chooseProject}
        onScroll={updateOverflow}
      >
        <div className={styles.projectTabList}>
          {projects.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`${styles.projectChoice} cursor-interactive`}
              aria-pressed={index === activeIndex}
              aria-controls="project-slide"
              onClick={() => onSelect(index)}
            >
              {t.projects.items[item.id].title}
            </button>
          ))}
        </div>
      </div>
      <span className={styles.pickerMore} aria-hidden="true">…</span>
    </div>
  );
}

export default function ProjectsSection() {
  const { t } = useLanguage();
  const copy = t.projects;
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [galleryProject, setGalleryProject] = useState<Project | null>(null);
  const { elementRef: introRef, isVisible: isIntroVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.15,
    resetScrollDistance: 500,
  });
  const { elementRef: carouselRef, isVisible: isCarouselVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.1,
    resetScrollDistance: 500,
  });
  const reduceMotion = useReducedMotion();
  const project = projects[activeIndex];
  const details = copy.items[project.id];

  const selectProject = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const moveProject = (step: number) => {
    setDirection(step);
    setActiveIndex((index) => (index + step + projects.length) % projects.length);
  };

  return (
    <section id={SectionId.PROJECTS} className={styles.section} aria-labelledby="projects-heading">
      <div className={styles.container}>
        <div ref={introRef} className={styles.introReveal} data-visible={isIntroVisible}>
          <header className={styles.sectionHeader}>
            <div>
              <h2 id="projects-heading"><AnimatedText>{copy.header}</AnimatedText></h2>
              <p><AnimatedText>{copy.subheader}</AnimatedText></p>
            </div>
            <div className={styles.controls}>
              <span className={styles.counter} aria-hidden="true">
                <span>{String(activeIndex + 1).padStart(2, '0')}</span> / {String(projects.length).padStart(2, '0')}
              </span>
              <button
                type="button"
                className={`${styles.arrowButton} cursor-interactive`}
                onClick={() => moveProject(-1)}
                aria-label={copy.previous}
                aria-controls="project-slide"
              >
                <ArrowLeftIcon size={22} aria-hidden="true" />
              </button>
              <button
                type="button"
                className={`${styles.arrowButton} cursor-interactive`}
                onClick={() => moveProject(1)}
                aria-label={copy.next}
                aria-controls="project-slide"
              >
                <ArrowRightIcon size={22} aria-hidden="true" />
              </button>
            </div>
          </header>

          <ProjectPicker activeIndex={activeIndex} onSelect={selectProject} />
        </div>

        <div
          ref={carouselRef}
          className={`${styles.carousel} ${styles.contentReveal}`}
          data-visible={isCarouselVisible}
          role="region"
          aria-roledescription={copy.carousel}
          aria-label={copy.header}
        >
          <motion.article
            key={project.id}
            id="project-slide"
            className={styles.project}
            data-has-tech={project.tech.length > 0}
            role="group"
            aria-roledescription={copy.slide}
            aria-label={`${activeIndex + 1} ${copy.of} ${projects.length}: ${details.title}`}
            initial={reduceMotion ? false : { opacity: 0, x: direction * 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3, ease: 'easeOut' }}
          >
            <ProjectPreview project={project} />

            <div className={styles.details}>
              <div className={styles.projectHeading}>
                {typeof project.active === 'boolean' && (
                  <p className={styles.status} data-active={project.active}>
                    <span aria-hidden="true" />{project.active ? copy.active : copy.inactive}
                  </p>
                )}
                <h3>{details.title}</h3>
              </div>
              <dl className={styles.metadata}>
                {details.customer && (
                  <div>
                    <dt>{copy.customer}</dt>
                    <dd>
                      {project.customerUrl ? (
                        <a
                          href={project.customerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${styles.customerLink} cursor-interactive`}
                        >
                          {details.customer}
                          <span className="sr-only"> ({copy.newTab})</span>
                        </a>
                      ) : details.customer}
                    </dd>
                  </div>
                )}
                <div><dt>{copy.type}</dt><dd>{details.type}</dd></div>
              </dl>
              <div className={styles.description}>
                {details.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <div className={styles.actions}>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className={styles.showMore}
                  onClick={() => setGalleryProject(project)}
                  aria-haspopup="dialog"
                >
                  {copy.showMore}
                </Button>
                {project.active !== false && project.website && (
                  <a href={project.website} target="_blank" rel="noopener noreferrer" className={`${styles.website} cursor-interactive`}>
                    {copy[project.websiteLabel ?? 'website']}
                    <ExternalLinkIcon size={17} aria-hidden="true" />
                    <span className="sr-only"> ({copy.newTab})</span>
                  </a>
                )}
              </div>
            </div>

            {project.tech.length > 0 && (
              <div className={styles.tech}>
                <h4>{copy.tech}</h4>
                <dl className={styles.techGroups}>
                  {project.tech.map(({ group, tools }) => (
                    <div key={group}>
                      <dt>{copy.techGroups[group]}</dt>
                      <dd>{tools.join(', ')}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </motion.article>
        </div>
        <p className="sr-only" role="status" aria-atomic="true">
          {details.title}, {activeIndex + 1} {copy.of} {projects.length}
        </p>
      </div>
      {galleryProject && <ProjectGallery project={galleryProject} onClose={() => setGalleryProject(null)} />}
    </section>
  );
}
