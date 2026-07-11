import { circularGalleryItems } from "../data/portfolio.js";
import CircularGallery from "./CircularGallery.jsx";

export function HeroGallery() {
  return (
    <section className="hero-gallery-section" aria-label="Selected AI motion frames">
      <div className="hero-gallery-copy">
        <p>Motion Frame Gallery</p>
        <h2>Selected AI Visual Frames</h2>
      </div>
      <div className="hero-gallery-stage">
        <CircularGallery
          items={circularGalleryItems}
          bend={2.2}
          textColor="#f5fbff"
          borderRadius={0.045}
          font="bold 24px Kanit"
          scrollSpeed={1.5}
          scrollEase={0.045}
        />
      </div>
    </section>
  );
}
