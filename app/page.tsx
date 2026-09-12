import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import MeasureSection from '@/components/MeasureSection';
import StepsSection from '@/components/StepsSection';
import FinalCta from '@/components/FinalCta';
import Footer from '@/components/Footer';
import StickyCta from '@/components/StickyCta';
import ScrollReveals from '@/components/ScrollReveals';

export default function Page() {
  return (
    <>
      <ScrollReveals />
      <Nav />
      <main>
        <Hero />
        <MeasureSection />
        <StepsSection />
        <FinalCta />
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
