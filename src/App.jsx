import { AboutSection } from "./components/About.jsx";
import { ContactFinale } from "./components/ContactFinale.jsx";
import { Hero } from "./components/Hero.jsx";
import { MarqueeSection } from "./components/MarqueeSection.jsx";
import { PortfolioMotion } from "./components/PortfolioMotion.jsx";
import { Projects } from "./components/Projects.jsx";
import { Strengths } from "./components/Strengths.jsx";

export default function App() {
  return (
    <>
      <PortfolioMotion />
      <main className="site-main">
        <Hero />
        <MarqueeSection />
        <AboutSection />
        <Strengths />
        <Projects />
        <ContactFinale />
      </main>
    </>
  );
}
