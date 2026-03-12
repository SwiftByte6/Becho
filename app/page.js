import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import ImpactStats from '@/components/landing/ImpactStats';
import Footer from '@/components/landing/Footer';

export const metadata = {
  title: 'Becho | Circular Economy Marketplace',
  description: 'Connect surplus materials with businesses that can reuse them and reduce environmental waste.',
};

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[rgba(247,239,226,0.72)]" />
        <div
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            backgroundImage: "url('/LandingPage/landingBack.png')",
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center top',
            backgroundRepeat: 'repeat',
            backgroundSize: '540px auto',
            opacity: 0.38,
          }}
        />
        <div className="relative z-30">
          <HowItWorks />
          <ImpactStats />
        </div>
      </div>
      <Footer />
    </>
  );
}
