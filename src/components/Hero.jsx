import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { navItems, profile, seasonCarousel } from "../data/portfolio.js";
import { IntroCounter } from "./IntroCounter.jsx";
import { FadeIn } from "./TemplatePrimitives.jsx";

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef([]);
  const activeSlide = seasonCarousel.slides[activeIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % seasonCarousel.slides.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (index === activeIndex) {
        video.currentTime = video.currentTime || 0;
        video.play().catch(() => {});
        return;
      }

      video.pause();
      video.currentTime = 0;
    });
  }, [activeIndex]);

  const goToSlide = (index) => {
    setActiveIndex((index + seasonCarousel.slides.length) % seasonCarousel.slides.length);
  };

  return (
    <section
      className="hero-section carousel-hero"
      id="hero"
      aria-label="AIGC seasonal motion poster carousel"
      style={{ "--season-accent": activeSlide.accent }}
    >
      <IntroCounter />
      <div className="season-video-stack" aria-hidden="true">
        {seasonCarousel.slides.map((slide, index) => (
          <video
            className={`season-video ${index === activeIndex ? "is-active" : ""}`}
            key={slide.season}
            ref={(node) => {
              videoRefs.current[index] = node;
            }}
            muted
            loop
            playsInline
            preload={index === 0 ? "auto" : "metadata"}
          >
            <source src={slide.src} type="video/mp4" />
          </video>
        ))}
      </div>
      <div className="carousel-vignette" aria-hidden="true" />

      <FadeIn as="header" className="hero-nav sequence-nav" delay={0} y={-16}>
        <a className="brand-wordmark" href="#hero" aria-label="返回顶部">
          <img className="brand-logo" src="/assets/logo-liuzien.png" alt="Liu Zien" />
        </a>
        <nav aria-label="Primary navigation">
          {navItems.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="nav-cta" href={`mailto:${profile.email}`}>
          合作咨询
        </a>
      </FadeIn>

      <div className="season-hero-content">
        <FadeIn as="p" className="season-eyebrow" delay={0.12} y={18}>
          {seasonCarousel.eyebrow}
        </FadeIn>
        <div className="season-meta" aria-live="polite">
          <span>{activeSlide.index}</span>
          <span>{activeSlide.kicker}</span>
        </div>
        <h1 className="season-title" key={activeSlide.season}>
          {activeSlide.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        <p className="season-subtitle" key={`${activeSlide.season}-subtitle`}>
          {activeSlide.subtitle}
        </p>
      </div>

      <div className="season-arrow-controls" aria-label="轮播控制">
        <button type="button" onClick={() => goToSlide(activeIndex - 1)} aria-label="上一张">
          <ChevronLeft size={22} strokeWidth={2.4} />
        </button>
        <button type="button" onClick={() => goToSlide(activeIndex + 1)} aria-label="下一张">
          <ChevronRight size={22} strokeWidth={2.4} />
        </button>
      </div>
    </section>
  );
}
