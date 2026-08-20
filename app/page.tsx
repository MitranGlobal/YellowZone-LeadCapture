import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import StatBand from '@/components/StatBand';
import LedgerSection from '@/components/LedgerSection';
import StandardSection from '@/components/StandardSection';
import FrameworkSection from '@/components/FrameworkSection';
import PathSection from '@/components/PathSection';
import FitSection from '@/components/FitSection';
import ProofSection from '@/components/ProofSection';
import FaqSection from '@/components/FaqSection';
import FinalCta from '@/components/FinalCta';
import Footer from '@/components/Footer';
import StickyCta from '@/components/StickyCta';
import LeadModal from '@/components/LeadModal';
import ScrollReveals from '@/components/ScrollReveals';

export default function Page() {
  return (
    <>
      <ScrollReveals />
      <Nav />
      <main>
        <Hero />
        <StatBand />
        <LedgerSection />
        <StandardSection />
        <FrameworkSection />
        <PathSection />
        <FitSection />
        <ProofSection />
        <FaqSection />
        <FinalCta />
      </main>
      <Footer />
      <StickyCta />
      <LeadModal />
    </>
  );
}
