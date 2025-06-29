import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { PoweredBy } from "@/components/PoweredBy";
import { OurTeam } from "@/components/OurTeam";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/ui/footer";
import { Stats } from "@/components/Stats";
import { Testimonials } from "@/components/Testimonials";
import { CTA } from "@/components/CTA";

import NavbarLogo from "@/components/logos/NavBarLogo";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <Testimonials />
      <PoweredBy />
      <OurTeam />
      <CTA />
      <Contact />
      <Footer logo={<NavbarLogo />} brandName="Conversational AI" />
    </div>
  );
}