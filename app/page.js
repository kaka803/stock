
import Navbar from "@/components/Navbar";
import VideoHero from "@/components/VideoHero";
import Hero from "@/components/Hero";
import Showcase from "@/components/Showcase";
import Features from "@/components/Features";
import BenchmarkSection from "@/components/BenchmarkSection";
import InvestmentFeatures from "@/components/InvestmentFeatures";
import GeneratedAssets from "@/components/GeneratedAssets";
import AccountBenefits from "@/components/AccountBenefits";
import SupportSection from "@/components/SupportSection";
import SecuritySection from "@/components/SecuritySection";
import PartnerSection from "@/components/PartnerSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-blue-500/30 transition-colors duration-300">
      <Navbar />
      <VideoHero />
      <Hero />
      <Showcase />
      <BenchmarkSection />
      <Features />
      <InvestmentFeatures />
      <GeneratedAssets />
      <AccountBenefits />
      <SecuritySection />
      <SupportSection />
      <PartnerSection />
      <Footer />
    </main>
  );
}
