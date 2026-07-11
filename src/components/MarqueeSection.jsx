import { useEffect, useRef, useState } from "react";
import { ExternalLink, X } from "lucide-react";

const mediaItems = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  {
    src: "/assets/marquee/july-06-motion.mp4",
    poster: "/assets/marquee/july-06-poster.png",
    label: "JULY 06 MOTION",
    type: "video",
  },
  {
    src: "/assets/marquee/starry-sky-motion.mp4",
    label: "STARRY SKY MOTION",
    type: "video",
  },
  {
    src: "/assets/marquee/spring-commercial-motion.mp4",
    label: "SPRING COMMERCIAL MOTION",
    type: "video",
  },
  {
    src: "/assets/marquee/ding4-marquee-motion.mp4",
    label: "DING 4 MOTION",
    type: "video",
  },
  {
    src: "/assets/marquee/june-07-motion.mp4",
    label: "JUNE 07 MOTION",
    type: "video",
  },
  {
    src: "/assets/marquee/skincare-ad-motion.mp4",
    label: "SKINCARE AD MOTION",
    type: "video",
  },
  {
    src: "/assets/marquee/tech-ecommerce-ad-motion.mp4",
    label: "TECH ECOMMERCE AD MOTION",
    type: "video",
  },
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
  {
    src: "/assets/marquee/tianwang-38-festival.jpg",
    label: "TIANWANG 38 FESTIVAL",
    type: "image",
  },
  {
    src: "/assets/marquee/tianwang-double12-poster.jpg",
    label: "TIANWANG DOUBLE 12 POSTER",
    type: "image",
  },
  {
    src: "/assets/marquee/sports-opening-poster.jpg",
    label: "SPORTS OPENING POSTER",
    type: "image",
  },
  {
    src: "/assets/marquee/running-wall-poster.jpg",
    label: "RUNNING WALL POSTER",
    type: "image",
  },
  {
    src: "/assets/marquee/shoes-cny-men-display.jpg",
    label: "SHOES CNY MEN DISPLAY",
    type: "image",
  },
  {
    src: "/assets/marquee/shoes-new-year.jpg",
    label: "SHOES NEW YEAR POSTER",
    type: "image",
  },
  {
    src: "/assets/marquee/kangming-womens-day-poster.jpg",
    label: "KANGMING WOMENS DAY POSTER",
    type: "image",
  },
  {
    src: "/assets/marquee/cancer-cake-poster.jpg",
    label: "CANCER CAKE POSTER",
    type: "image",
  },
  {
    src: "/assets/marquee/x3-poster-motion.mp4",
    label: "X3 POSTER MOTION",
    type: "video",
  },
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
];

const rowOneOrigin = mediaItems.slice(0, 11);
const rowTwoOrigin = mediaItems.slice(11);
const rowOneItems = [...rowOneOrigin, ...rowOneOrigin, ...rowOneOrigin];
const rowTwoItems = [...rowTwoOrigin, ...rowTwoOrigin, ...rowTwoOrigin];

function getMediaSource(item) {
  return typeof item === "string" ? item : item.src;
}

function getMediaType(item) {
  if (typeof item !== "string") return item.type;
  return item.endsWith(".mp4") ? "video" : "image";
}

function getMediaPoster(item) {
  return typeof item === "string" ? undefined : item.poster;
}

function getMediaLabel(item) {
  if (typeof item !== "string") return item.label;

  return item
    .split("/")
    .pop()
    .replace(/^hero-/, "")
    .replace(/-preview-.+\.(gif|mp4)$/, "")
    .replace(/\.(gif|mp4)$/, "")
    .replaceAll("-", " ")
    .toUpperCase();
}

export function MarqueeSection() {
  const sectionRef = useRef(null);
  const rowOneRef = useRef(null);
  const rowTwoRef = useRef(null);
  const [activeMedia, setActiveMedia] = useState(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    let raf = 0;

    const updateRows = () => {
      const section = sectionRef.current;
      const rowOne = rowOneRef.current;
      const rowTwo = rowTwoRef.current;
      if (!section || !rowOne || !rowTwo) return;

      const offset = (window.scrollY - section.offsetTop + window.innerHeight) * 0.3;
      const travel = offset - 200;

      rowOne.style.transform = `translate3d(${travel}px, 0, 0)`;
      rowTwo.style.transform = `translate3d(${-travel}px, 0, 0)`;
    };

    const requestUpdate = () => {
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(updateRows);
    };

    updateRows();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  useEffect(() => {
    if (!activeMedia) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveMedia(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeMedia]);

  const renderCard = (item, index) => {
    const src = getMediaSource(item);
    const label = getMediaLabel(item);
    const type = getMediaType(item);
    const poster = getMediaPoster(item);
    const media = { src, label, type, poster };

    return (
      <button
        className="motion-marquee-card"
        key={`${src}-${index}`}
        type="button"
        onClick={() => setActiveMedia(media)}
        aria-label={`Open ${label} preview`}
      >
        {type === "video" ? (
          <video
            src={src}
            poster={poster}
            muted
            loop
            autoPlay
            playsInline
            preload="auto"
            aria-hidden="true"
          />
        ) : (
          <img src={src} alt="" loading="lazy" decoding="async" />
        )}
      </button>
    );
  };

  return (
    <section className="motion-marquee-section" ref={sectionRef} aria-label="AIGC motion preview wall">
      <div className="motion-marquee-row" ref={rowOneRef}>
        {rowOneItems.map(renderCard)}
      </div>

      <div className="motion-marquee-row motion-marquee-row-reverse" ref={rowTwoRef}>
        {rowTwoItems.map(renderCard)}
      </div>

      {activeMedia ? (
        <div className="motion-preview-layer" role="dialog" aria-modal="true" aria-label={activeMedia.label}>
          <button className="motion-preview-backdrop" type="button" onClick={() => setActiveMedia(null)} aria-label="Close preview" />
          <div className="motion-preview-panel">
            <div className="motion-preview-top">
              <p>{activeMedia.label}</p>
              <button type="button" onClick={() => setActiveMedia(null)} aria-label="Close preview">
                <X size={20} strokeWidth={2.4} />
              </button>
            </div>

            {activeMedia.type === "video" ? (
              <video src={activeMedia.src} controls muted loop autoPlay playsInline poster={activeMedia.poster} />
            ) : (
              <img src={activeMedia.src} alt={activeMedia.label} />
            )}

            <a href={activeMedia.src} target="_blank" rel="noreferrer">
              OPEN ORIGINAL
              <ExternalLink size={16} strokeWidth={2.4} />
            </a>
          </div>
        </div>
      ) : null}
    </section>
  );
}
