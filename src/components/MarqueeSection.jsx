import { useEffect, useRef, useState } from "react";
import { ExternalLink, X } from "lucide-react";

const marqueePoster = (filename) => `/assets/marquee/posters/${filename.replace(/\.mp4$/i, ".jpg")}`;
const marqueePreview = (filename) => `/assets/marquee/previews/${filename}`;

const mediaItems = [
  {
    src: "/assets/marquee/cancer-cake-poster.jpg",
    label: "CANCER CAKE POSTER",
    type: "image",
  },
  {
    src: "/assets/marquee/july-06-motion.mp4",
    previewSrc: marqueePreview("july-06-motion.mp4"),
    poster: "/assets/marquee/july-06-poster.png",
    label: "JULY 06 MOTION",
    type: "video",
  },
  {
    src: "/assets/marquee/starry-sky-motion.mp4",
    previewSrc: marqueePreview("starry-sky-motion.mp4"),
    poster: marqueePoster("starry-sky-motion.mp4"),
    label: "STARRY SKY MOTION",
    type: "video",
  },
  {
    src: "/assets/marquee/spring-commercial-motion.mp4",
    previewSrc: marqueePreview("spring-commercial-motion.mp4"),
    poster: marqueePoster("spring-commercial-motion.mp4"),
    label: "SPRING COMMERCIAL MOTION",
    type: "video",
  },
  {
    src: "/assets/marquee/ding4-marquee-motion.mp4",
    previewSrc: marqueePreview("ding4-marquee-motion.mp4"),
    poster: marqueePoster("ding4-marquee-motion.mp4"),
    label: "DING 4 MOTION",
    type: "video",
  },
  {
    src: "/assets/marquee/june-07-motion.mp4",
    previewSrc: marqueePreview("june-07-motion.mp4"),
    poster: marqueePoster("june-07-motion.mp4"),
    label: "JUNE 07 MOTION",
    type: "video",
  },
  {
    src: "/assets/marquee/skincare-ad-motion.mp4",
    previewSrc: marqueePreview("skincare-ad-motion.mp4"),
    poster: marqueePoster("skincare-ad-motion.mp4"),
    label: "SKINCARE AD MOTION",
    type: "video",
  },
  {
    src: "/assets/marquee/tech-ecommerce-ad-motion.mp4",
    previewSrc: marqueePreview("tech-ecommerce-ad-motion.mp4"),
    poster: marqueePoster("tech-ecommerce-ad-motion.mp4"),
    label: "TECH ECOMMERCE AD MOTION",
    type: "video",
  },
  {
    src: "/assets/marquee/running-wall-poster.jpg",
    label: "RUNNING WALL POSTER",
    type: "image",
  },
  {
    src: "/assets/marquee/sports-opening-poster.jpg",
    label: "SPORTS OPENING POSTER",
    type: "image",
  },
  {
    src: "/assets/marquee/shoes-cny-men-display.jpg",
    label: "SHOES CNY MEN DISPLAY",
    type: "image",
  },
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
    previewSrc: marqueePreview("x3-poster-motion.mp4"),
    poster: marqueePoster("x3-poster-motion.mp4"),
    label: "X3 POSTER MOTION",
    type: "video",
  },
  {
    src: "/assets/marquee/kangming-womens-day-poster.jpg",
    label: "KANGMING WOMENS DAY POSTER",
    type: "image",
  },
];

const rowOneOrigin = mediaItems.slice(0, 11);
const rowTwoOrigin = mediaItems.slice(11);
const rowOneItems = [...rowOneOrigin, ...rowOneOrigin, ...rowOneOrigin];
const rowTwoItems = [...rowTwoOrigin, ...rowTwoOrigin, ...rowTwoOrigin];

function getMediaSource(item) {
  return typeof item === "string" ? item : item.src;
}

function getMediaPreviewSource(item) {
  return typeof item === "string" ? item : item.previewSrc ?? item.src;
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

function getCardImage(item) {
  if (typeof item === "string") return item;
  return item.poster ?? item.src;
}

export function MarqueeSection() {
  const sectionRef = useRef(null);
  const rowOneRef = useRef(null);
  const rowTwoRef = useRef(null);
  const isVisibleRef = useRef(false);
  const [activeMedia, setActiveMedia] = useState(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    let updateRaf = 0;
    let scrollTravel = 0;

    const renderRows = () => {
      const section = sectionRef.current;
      const rowOne = rowOneRef.current;
      const rowTwo = rowTwoRef.current;
      if (!section || !rowOne || !rowTwo || !isVisibleRef.current) return;

      rowOne.style.transform = `translate3d(${scrollTravel}px, 0, 0)`;
      rowTwo.style.transform = `translate3d(${-scrollTravel}px, 0, 0)`;
    };

    const updateRows = () => {
      const section = sectionRef.current;
      if (!section) return;

      const offset = (window.scrollY - section.offsetTop + window.innerHeight) * 0.3;
      scrollTravel = offset - 220;
      renderRows();
    };

    const requestUpdate = () => {
      window.cancelAnimationFrame(updateRaf);
      updateRaf = window.requestAnimationFrame(updateRows);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) requestUpdate();
      },
      { rootMargin: "240px 0px" },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.cancelAnimationFrame(updateRaf);
      observer.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  useEffect(() => {
    if (!activeMedia) return undefined;

    setIsPreviewLoading(true);

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
        onClick={() => {
          setIsPreviewLoading(true);
          setActiveMedia(media);
        }}
        aria-label={`Open ${label} preview`}
      >
        {type === "video" ? (
          <video
            src={getMediaPreviewSource(item)}
            poster={poster}
            muted
            loop
            autoPlay
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
        ) : (
          <img src={getCardImage(item)} alt="" loading="lazy" decoding="async" />
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
          <div className={`motion-preview-panel${isPreviewLoading ? " is-loading" : " is-ready"}`}>
            <div className="motion-preview-top">
              <p>{activeMedia.label}</p>
              <button type="button" onClick={() => setActiveMedia(null)} aria-label="Close preview">
                <X size={20} strokeWidth={2.4} />
              </button>
            </div>

            {isPreviewLoading ? (
              <div className="preview-loading-state" role="status" aria-live="polite">
                <span />
                <p>Loading preview</p>
              </div>
            ) : null}

            {activeMedia.type === "video" ? (
              <video
                className="preview-media"
                src={activeMedia.src}
                controls
                muted
                loop
                autoPlay
                playsInline
                preload="auto"
                poster={activeMedia.poster}
                onLoadedData={() => setIsPreviewLoading(false)}
                onCanPlay={() => setIsPreviewLoading(false)}
                onError={() => setIsPreviewLoading(false)}
              />
            ) : (
              <img
                className="preview-media"
                src={activeMedia.src}
                alt={activeMedia.label}
                onLoad={() => setIsPreviewLoading(false)}
                onError={() => setIsPreviewLoading(false)}
              />
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
