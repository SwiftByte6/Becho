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
      <HowItWorks />
      <ImpactStats />
      <Footer />
    </>
  );
}
