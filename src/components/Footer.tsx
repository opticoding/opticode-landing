'use client';

import Image from 'next/image';
import { LinkedInIcon, GitHubIcon } from '@/components/icons';

export default function Footer() {
  return (
      <footer className="w-full flex flex-col justify-center items-center pt-8 pb-16 gap-12 border-t border-white-border">
        {/* Content */}
        <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center gap-12 lg:gap-8 w-full max-w-[450px] lg:max-w-[800px] px-8 sm:px-16 lg:px-0">
          {/* Logo */}
          <div className="flex items-center w-full lg:w-[404px] h-auto lg:h-[76px] justify-center lg:justify-start">
            <Image 
              src="/opticode_logo_darkmode.svg" 
              alt="OptiCode Logo" 
              width={322}
              height={61}
              className="w-full h-auto lg:w-[404px] lg:h-[76px]"
            />
          </div>

          {/* Social Media Icons */}
          <div className="flex flex-row justify-center items-center gap-6 px-6 py-2 w-[136px] lg:w-[152px] h-12 lg:h-14 border border-white-border rounded-full">
          <a 
            href="https://www.linkedin.com/in/joohansson/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="cursor-interactive hover:brightness-75 transition-all duration-200"
          >
            <LinkedInIcon size={32} className="lg:w-10 lg:h-10" />
          </a>
          <a 
            href="https://github.com/opticoding" 
            target="_blank" 
            rel="noopener noreferrer"
            className="cursor-interactive hover:brightness-75 transition-all duration-200"
          >
            <GitHubIcon size={32} className="lg:w-10 lg:h-10" />
          </a>
        </div>
      </div>
    </footer>
  );
}

