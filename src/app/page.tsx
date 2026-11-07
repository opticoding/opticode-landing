import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import ReasonsSection from '@/components/ReasonsSection';
import ProjectsSection from '@/components/ProjectsSection';
import CTASection from '@/components/CTASection';
import SnakeGame from '@/components/SnakeGame';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="w-full mx-auto overflow-hidden">
      <HeroSection />
      <ServicesSection />
      <ReasonsSection />
      <ProjectsSection />
      <CTASection />
      <SnakeGame />
      <Footer />
    </main>
  );
}
