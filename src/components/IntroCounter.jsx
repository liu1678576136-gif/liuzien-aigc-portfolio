import { useEffect, useState } from "react";
import CountUp from "./CountUp.jsx";

const EXIT_DURATION = 380;

export function IntroCounter() {
  const [isReducedMotion, setIsReducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [isLeaving, setIsLeaving] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setIsReducedMotion(mediaQuery.matches);

    mediaQuery.addEventListener("change", syncPreference);
    return () => mediaQuery.removeEventListener("change", syncPreference);
  }, []);

  const finishIntro = () => {
    setIsLeaving(true);
    window.setTimeout(() => setIsVisible(false), EXIT_DURATION);
  };

  useEffect(() => {
    if (!isReducedMotion) return undefined;

    const timer = window.setTimeout(finishIntro, 160);
    return () => window.clearTimeout(timer);
  }, [isReducedMotion]);

  if (!isVisible) return null;

  return (
    <div className={`intro-counter${isLeaving ? " is-leaving" : ""}`} aria-hidden="true">
      <div className="intro-counter-system">LZE / PORTFOLIO SYSTEM</div>
      <div className="intro-counter-readout">
        {isReducedMotion ? "100" : <CountUp from={0} to={100} duration={1.6} onEnd={finishIntro} />}
        <span>%</span>
      </div>
      <div className="intro-counter-progress">
        <span className={isReducedMotion ? "is-complete" : ""} />
      </div>
    </div>
  );
}
