'use client';

interface AnimatedTextProps {
  children: string;
  className?: string;
}

// TODO: Maybe add some nice text animations
export default function AnimatedText({ children, className }: AnimatedTextProps) {
  return <span className={className}>{children}</span>;
}

