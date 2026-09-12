'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/contexts/LanguageContext';
import { GlobeIcon, SmartphoneIcon, BoxIcon, ClockIcon, ZapIcon, TargetIcon, GitHubIcon, LinkedInIcon } from '@/components/icons';
import ContactPopup from '@/components/ContactPopup';
import AboutMePopup from '@/components/AboutMePopup';
import type { RoomController } from './createRoom';
import './room.css';

const SnakeGame = dynamic(() => import('@/components/SnakeGame'), { ssr: false });
const serviceIcons = [GlobeIcon, SmartphoneIcon, BoxIcon];
const reasonIcons = [ClockIcon, ZapIcon, TargetIcon];

function Arrow({ direction }: { direction: 'left' | 'right' }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={direction === 'left' ? 'M19 12H5m6-6-6 6 6 6' : 'M5 12h14m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function RoomExperience() {
  const { t, language, toggleLanguage } = useLanguage();
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [popup, setPopup] = useState<'contact' | 'about' | 'game' | null>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLElement | null)[]>([]);
  const controller = useRef<RoomController | null>(null);
  const activeRef = useRef(0);
  const headings = [t.hero.companyName, t.services.header, t.reasons.header, t.cta.headline];
  const closePopup = useCallback(() => setPopup(null), []);

  const navigate = useCallback((index: number) => {
    const next = ((index % 4) + 4) % 4;
    activeRef.current = next;
    setActive(next);
    controller.current?.turn(next);
  }, []);

  useEffect(() => {
    if (fallback) return;
    let cancelled = false;
    let instance: RoomController | null = null;
    setReady(false);
    const start = async () => {
      try {
        const { createRoom } = await import('./createRoom');
        if (cancelled || !hostRef.current) return;
        instance = await createRoom(
          hostRef.current,
          panelsRef.current.filter((panel): panel is HTMLElement => panel !== null),
          () => { if (!cancelled) setReady(true); },
          () => { if (!cancelled) { setFallback(true); setReady(true); } },
        );
        if (cancelled) { instance.dispose(); return; }
        controller.current = instance;
        instance.turn(activeRef.current);
      } catch {
        if (!cancelled) { setFallback(true); setReady(true); }
      }
    };
    void start();
    return () => {
      cancelled = true;
      instance?.dispose();
      controller.current = null;
    };
  }, [fallback]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (popup) return;
      const target = event.target as HTMLElement;
      if (target.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        navigate(activeRef.current + (event.key === 'ArrowRight' ? 1 : -1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate, popup]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // The arcade dialog owns keyboard navigation while it is open.
  const gameRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (popup !== 'game') return;
    const previous = document.activeElement as HTMLElement | null;
    gameRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePopup();
      if (event.key === 'Tab') {
        const buttons = gameRef.current?.querySelectorAll<HTMLElement>('button, a[href], [tabindex="0"]');
        if (!buttons?.length) return;
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); previous?.focus(); };
  }, [popup, closePopup]);

  return (
    <main className={`room-experience room-tone-${active}${fallback ? ' room-fallback' : ''}${ready || fallback ? ' is-ready' : ''}`}>
      <div className="room-world" ref={hostRef} />
      <div className="room-vignette" aria-hidden="true" />

      <header className="room-header">
        <button className="room-brand" onClick={() => navigate(0)} aria-label={t.hero.companyName}>
          <Image src="/opticode_logo_darkmode.svg" width={180} height={34} alt="OptiCode Logo" priority />
        </button>
        <nav className="room-top-nav" aria-label="Navigation">
          {[t.navbar.services, t.navbar.about, t.navbar.contact].map((label, index) => <button key={index} onClick={() => navigate(index + 1)} aria-current={active === index + 1 ? 'page' : undefined}>{label}</button>)}
        </nav>
        <div className="room-header-actions">
          <button className="room-mode" onClick={() => { setFallback(value => !value); setReady(true); }} aria-label={fallback ? (language === 'sv' ? 'Visa 3D-rummet' : 'Show 3D room') : (language === 'sv' ? 'Visa i 2D' : 'Show in 2D')}>{fallback ? '3D' : '2D'}</button>
          <button className="room-language" onClick={toggleLanguage} aria-label="Toggle language">
            <Image src="/gb.svg" width={28} height={21} alt="English" className={language === 'en' ? 'selected' : ''} />
            <span aria-hidden="true" />
            <Image src="/se.svg" width={28} height={21} alt="Swedish" className={language === 'sv' ? 'selected' : ''} />
          </button>
        </div>
      </header>

      <div className="room-source">
        {[0, 1, 2, 3].map(index => (
          <section key={index} ref={element => { panelsRef.current[index] = element; }} className={`wall-display wall-${index}`} inert={active !== index} aria-hidden={active !== index} aria-labelledby={`wall-heading-${index}`}>
            <div className="display-topline"><span className="display-status" aria-hidden="true" /><span>{t.hero.companyName}</span><span className="display-index" aria-hidden="true">0{index + 1} / 04</span></div>
            <div className="display-scroll" tabIndex={active === index ? 0 : -1}>
              {index === 0 && <div className="wall-hero">
                <div className="hero-symbol" aria-hidden="true"><Image src="/opticode_logo_square.png" alt="" width={88} height={88} priority /></div>
                <h1 id="wall-heading-0">{t.hero.companyName}</h1>
                <p className="wall-tagline">{t.hero.taglinePart1} <span>&</span> {t.hero.taglinePart2}</p>
                <p className="wall-intro">{t.hero.intro} <strong>{t.hero.highlight}</strong> {t.hero.introEnd}</p>
                <div className="wall-location"><span>{t.hero.locationBase}</span><i aria-hidden="true" /><span>{t.hero.locationAvailability}</span></div>
              </div>}
              {index === 1 && <div className="wall-content">
                <h2 id="wall-heading-1">{t.services.header}</h2>
                <p className="wall-subtitle">{t.services.subheader}</p>
                <div className="wall-columns">{t.services.items.map((item, i) => {
                  const Icon = serviceIcons[i];
                  return <article key={i}><div className="wall-item-icon"><Icon size={30} /><span aria-hidden="true">0{i + 1}</span></div><h3>{item.title}</h3><p>{item.description.split(new RegExp(`(${item.highlightedWord})`, 'gi')).map((part, p) => part.toLowerCase() === item.highlightedWord.toLowerCase() ? <strong key={p}>{part}</strong> : <span key={p}>{part}</span>)}</p></article>;
                })}</div>
              </div>}
              {index === 2 && <div className="wall-content">
                <h2 id="wall-heading-2">{t.reasons.header}</h2>
                <div className="wall-columns reason-columns">{t.reasons.features.map((feature, i) => {
                  const Icon = reasonIcons[i];
                  return <article key={i}><div className="wall-item-icon"><Icon size={30} /><span aria-hidden="true">0{i + 1}</span></div><h3>{feature.title}</h3><p>{feature.description}</p></article>;
                })}</div>
              </div>}
              {index === 3 && <div className="wall-contact">
                <div className="contact-orbit" aria-hidden="true"><span /><span /><span /></div>
                <h2 id="wall-heading-3">{t.cta.headline}</h2>
                <p>{t.cta.tagline}</p><p className="contact-location">{t.cta.tagline2}</p>
                <div className="wall-buttons"><button onClick={() => setPopup('about')}>{t.cta.button2}</button><button className="wall-primary" onClick={() => setPopup('contact')}>{t.cta.button1}<Arrow direction="right" /></button></div>
              </div>}
            </div>
            <div className="display-bottomline" aria-hidden="true"><span /><i /><i /><i /><span /></div>
          </section>
        ))}
      </div>

      <div className="room-controls">
        <button className="room-turn" onClick={() => navigate(active - 1)} aria-label={`${language === 'sv' ? 'Vänster' : 'Left'}: ${headings[(active + 3) % 4]}`}><Arrow direction="left" /></button>
        <div className="room-position">
          <div className="room-compass" aria-hidden="true"><div style={{ transform: `rotate(${active * 90}deg)` }}><i /></div></div>
          <div><span className="room-current" aria-live="polite">{headings[active]}</span><div className="room-dots">{headings.map((heading, i) => <button key={i} aria-label={heading} aria-current={active === i ? 'step' : undefined} onClick={() => navigate(i)}><span /></button>)}</div></div>
          <span className="room-count" aria-hidden="true">0{active + 1}<small>/ 04</small></span>
        </div>
        <button className="room-turn" onClick={() => navigate(active + 1)} aria-label={`${language === 'sv' ? 'Höger' : 'Right'}: ${headings[(active + 1) % 4]}`}><Arrow direction="right" /></button>
      </div>

      <footer className="room-footer">
        <span>© {new Date().getFullYear()} OptiCode AB. All rights reserved.</span>
        <div><button onClick={() => setPopup('game')} aria-label={t.snakeGame.title} title={t.snakeGame.title}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true"><path d="M6 8h12l3 9a2 2 0 0 1-3 2l-3-3H9l-3 3a2 2 0 0 1-3-2l3-9Z" stroke="currentColor" strokeWidth="1.4"/><path d="M8 10v5m-2.5-2.5h5m5.5-1h.01m2 2h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></button><a href="https://www.linkedin.com/in/davidmattiasson/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedInIcon size={18} /></a><a href="https://github.com/opticoding" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GitHubIcon size={18} /></a></div>
      </footer>

      {!fallback && <div className={`room-splash${ready ? ' loaded' : ''}`} aria-hidden={ready}>
        <div className="splash-orbit" aria-hidden="true"><div className="splash-cube">{[0, 1, 2, 3, 4, 5].map(i => <i key={i} />)}</div></div>
        <h2>{t.hero.companyName}</h2><p>{t.hero.taglinePart1} & {t.hero.taglinePart2}</p><div className="splash-progress" aria-hidden="true"><span /></div>
        <button className="splash-fallback" tabIndex={ready ? -1 : 0} onClick={() => { setFallback(true); setReady(true); }}>2D</button>
      </div>}

      <ContactPopup isOpen={popup === 'contact'} onClose={closePopup} />
      <AboutMePopup isOpen={popup === 'about'} onClose={closePopup} />
      {popup === 'game' && <div className="room-game-backdrop" onClick={closePopup}><div ref={gameRef} className="room-game" role="dialog" aria-modal="true" aria-label={t.snakeGame.title} onClick={event => event.stopPropagation()}><button className="room-game-close" aria-label="Close" onClick={closePopup}>×</button><SnakeGame /></div></div>}
    </main>
  );
}
