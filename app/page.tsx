import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { PoweredBy } from "@/components/PoweredBy";
import { OurTeam } from "@/components/OurTeam";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/ui/footer";

import NavbarLogo from "@/components/logos/NavBarLogo";
export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <PoweredBy />
      <OurTeam />
      <Contact />
      <Footer logo={<NavbarLogo />} brandName="Conversational AI" />
    </div>
  );
}
