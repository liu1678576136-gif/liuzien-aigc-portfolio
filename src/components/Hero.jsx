import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { navItems, profile, seasonCarousel } from "../data/portfolio.js";
import { IntroCounter } from "./IntroCounter.jsx";
import { FadeIn } from "./TemplatePrimitives.jsx";

const AUTO_SLIDE_DELAY = 4200;

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVideoMounted, setIsVideoMounted] = useState(false);
  const activeSlide = seasonCarousel.slides[activeIndex];
  const activePoster = activeSlide.src
    .replace("/season-carousel/", "/season-carousel/posters/")
    .replace(/\.mp4$/i, ".jpg");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % seasonCarousel.slides.length);
    }, AUTO_SLIDE_DELAY);

    return () => window.clearTimeout(timer);
  }, [activeIndex]);

  useEffect(() => {
    setIsVideoMounted(false);
    const timeout = window.setTimeout(() => setIsVideoMounted(true), activeIndex === 0 ? 350 : 0);

    return () => window.clearTimeout(timeout);
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
        <img
          className="season-poster"
          src={activePoster}
          alt=""
          fetchPriority="high"
        />
        {isVideoMounted ? (
          <video
            className="season-video is-active"
            key={activeSlide.season}
            muted
            loop
            autoPlay
            playsInline
            preload="metadata"
            poster={activePoster}
          >
            <source src={activeSlide.src} type="video/mp4" />
          </video>
        ) : null}
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
