'use client';

import Image from 'next/image';
import { LinkedInIcon, GitHubIcon } from '@/components/icons';

export default function Footer() {
  return (
      <footer className="w-full flex flex-col justify-center items-center pt-10 pb-12 gap-8 border-t border-white-border">
        {/* Content */}
        <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center gap-8 w-full max-w-desktop px-8 lg:px-16 2xl:px-0">
          {/* Logo */}
          <div className="flex items-center justify-center lg:justify-start">
            <Image 
              src="/opticode_logo_darkmode.svg"
              alt="OptiCode Logo"
              width={200}
              height={38}
              className="w-[180px] h-auto sm:w-[200px] lg:w-[240px]"
            />
          </div>

          {/* Social Media Icons */}
          <div className="flex flex-row justify-center items-center gap-5 px-5 py-2 border border-white-border rounded-full h-12">
            <a 
              href="https://www.linkedin.com/in/davidmattiasson/"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-interactive hover:opacity-70 transition-opacity duration-200"
              aria-label="LinkedIn"
            >
              <LinkedInIcon size={28} />
            </a>
            <a 
              href="https://github.com/opticoding" 
              target="_blank" 
              rel="noopener noreferrer"
              className="cursor-interactive hover:opacity-70 transition-opacity duration-200"
              aria-label="GitHub"
            >
              <GitHubIcon size={28} />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <p className="font-urbanist text-xs text-white/30">
          © {new Date().getFullYear()} OptiCode AB. All rights reserved.
        </p>
      </footer>
  );
}

