'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon, ExternalLinkIcon } from '@/components/icons';
import { useLanguage } from '@/contexts/LanguageContext';
import { screenshotSrc, type Project } from '@/constants/projects';
import styles from './ProjectsSection.module.css';

interface ProjectGalleryProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectGallery({ project, onClose }: ProjectGalleryProps) {
  const { t } = useLanguage();
  const copy = t.projects;
  const title = copy.items[project.id].title;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const pointerStartedOutside = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const { overflow, paddingRight } = document.body.style;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const currentPadding = parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;

    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    dialog.showModal();

    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  const isOutside = (event: React.MouseEvent<HTMLDialogElement> | React.PointerEvent<HTMLDialogElement>) => {
    if (event.target !== event.currentTarget) return false;
    const bounds = event.currentTarget.getBoundingClientRect();
    return event.clientX < bounds.left || event.clientX > bounds.right
      || event.clientY < bounds.top || event.clientY > bounds.bottom;
  };

  return createPortal(
    <dialog
      ref={dialogRef}
      className={styles.gallery}
      aria-labelledby="project-gallery-title"
      aria-describedby="project-gallery-description"
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const dialog = dialogRef.current;
        if (!dialog) return;
        const stops = [...dialog.querySelectorAll<HTMLElement>('button, a[href]')];
        const first = stops[0];
        const last = stops[stops.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onPointerDown={(event) => { pointerStartedOutside.current = isOutside(event); }}
      onClick={(event) => {
        if (pointerStartedOutside.current && isOutside(event)) onClose();
        pointerStartedOutside.current = false;
      }}
    >
      <header className={styles.galleryHeader}>
        <div className={styles.galleryHeading}>
          <h2 id="project-gallery-title">{title}</h2>
          <p id="project-gallery-description">
            {project.screenshots.length} {project.screenshots.length === 1 ? copy.image : copy.images}
            {project.screenshots.length > 1 && <><span aria-hidden="true">/</span> {copy.scrollGallery}</>}
          </p>
        </div>
        <button
          ref={closeButtonRef}
          type="button"
          className={styles.galleryClose}
          onClick={onClose}
          aria-label={copy.closeGallery}
          autoFocus
        >
          <CloseIcon size={22} aria-hidden="true" />
        </button>
      </header>
      <div className={styles.galleryImages}>
        {project.screenshots.map((filename, index) => {
          const shotTitle = copy.items[project.id].screenshots[index];
          const shotUrl = project.screenshotUrls?.[index];
          return (
            <figure className={styles.galleryFigure} key={filename}>
              {/* eslint-disable-next-line @next/next/no-img-element -- the file's own ratio sets the height */}
              <img
                src={screenshotSrc(project.id, filename)}
                alt={`${title} — ${shotTitle}`}
                className={styles.galleryImage}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
              <figcaption>
                <div className={styles.shotCaption}>
                  <span>{shotTitle}</span>
                  {shotUrl && (
                    <a href={shotUrl} target="_blank" rel="noopener noreferrer" className={styles.shotLink}>
                      {shotUrl.replace(/^https?:\/\//, '')}
                      <ExternalLinkIcon size={13} aria-hidden="true" />
                      <span className="sr-only"> ({copy.newTab})</span>
                    </a>
                  )}
                </div>
                <span className={styles.shotIndex}>{String(index + 1).padStart(2, '0')} / {String(project.screenshots.length).padStart(2, '0')}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </dialog>,
    document.body,
  );
}
