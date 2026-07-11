import { useCallback, useLayoutEffect, useRef } from "react";
import Lenis from "lenis";
import "./ScrollStack.css";

export function ScrollStackItem({ children, itemClassName = "" }) {
  return <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>;
}

export default function ScrollStack({
  children,
  className = "",
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = "20%",
  scaleEndPosition = "10%",
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete,
}) {
  const scrollerRef = useRef(null);
  const cardsRef = useRef([]);
  const lenisRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastTransformsRef = useRef(new Map());
  const stackCompletedRef = useRef(false);

  const parsePosition = useCallback((value, height) => {
    if (typeof value === "string" && value.includes("%")) {
      return (Number.parseFloat(value) / 100) * height;
    }

    return Number.parseFloat(value);
  }, []);

  const getScrollState = useCallback(() => {
    const scroller = scrollerRef.current;

    return useWindowScroll
      ? { scrollTop: window.scrollY, height: window.innerHeight }
      : { scrollTop: scroller?.scrollTop ?? 0, height: scroller?.clientHeight ?? 0 };
  }, [useWindowScroll]);

  const getOffset = useCallback(
    (element) => {
      if (!element) return 0;
      if (!useWindowScroll) return element.offsetTop;

      // Read the element's layout position rather than its transformed visual
      // position. Measuring getBoundingClientRect() here feeds the previous
      // frame's translateY back into the next calculation and causes a jump.
      const scroller = scrollerRef.current;
      if (!scroller) return element.offsetTop;

      const scrollerTop = scroller.getBoundingClientRect().top + window.scrollY;
      return scrollerTop + element.offsetTop;
    },
    [useWindowScroll],
  );

  const updateCards = useCallback(() => {
    const cards = cardsRef.current;
    const scroller = scrollerRef.current;
    if (!cards.length || !scroller) return;

    const { scrollTop, height } = getScrollState();
    const stackStart = parsePosition(stackPosition, height);
    const scaleEnd = parsePosition(scaleEndPosition, height);
    const end = scroller.querySelector(".scroll-stack-end");
    const endTop = getOffset(end);
    let activeCard = -1;

    cards.forEach((card, index) => {
      const cardTop = getOffset(card);
      const pinStart = cardTop - stackStart - itemStackDistance * index;
      if (scrollTop >= pinStart) activeCard = index;
    });

    cards.forEach((card, index) => {
      const cardTop = getOffset(card);
      const pinStart = cardTop - stackStart - itemStackDistance * index;
      const pinEnd = endTop - height / 2;
      const scaleStart = pinStart;
      const scaleEndAt = Math.max(scaleStart + 1, cardTop - scaleEnd);
      const progress = Math.min(1, Math.max(0, (scrollTop - scaleStart) / (scaleEndAt - scaleStart)));
      const targetScale = baseScale + index * itemScale;
      const scale = 1 - progress * (1 - targetScale);
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;
      const translateY = isPinned
        ? scrollTop - cardTop + stackStart + itemStackDistance * index
        : scrollTop > pinEnd
          ? pinEnd - cardTop + stackStart + itemStackDistance * index
          : 0;
      const rotation = rotationAmount ? index * rotationAmount * progress : 0;
      const blur = blurAmount && index < activeCard ? (activeCard - index) * blurAmount : 0;
      const next = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
      };
      const previous = lastTransformsRef.current.get(index);

      if (
        !previous ||
        Math.abs(previous.translateY - next.translateY) > 0.1 ||
        Math.abs(previous.scale - next.scale) > 0.001 ||
        Math.abs(previous.rotation - next.rotation) > 0.1 ||
        Math.abs(previous.blur - next.blur) > 0.1
      ) {
        card.style.transform = `translate3d(0, ${next.translateY}px, 0) scale(${next.scale}) rotate(${next.rotation}deg)`;
        card.style.filter = next.blur ? `blur(${next.blur}px)` : "";
        lastTransformsRef.current.set(index, next);
      }
    });

    const completed = activeCard === cards.length - 1;
    if (completed !== stackCompletedRef.current) {
      stackCompletedRef.current = completed;
      if (completed) onStackComplete?.();
    }
  }, [baseScale, blurAmount, getOffset, getScrollState, itemScale, itemStackDistance, onStackComplete, parsePosition, rotationAmount, scaleEndPosition, stackPosition]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    const cards = Array.from(scroller.querySelectorAll(".scroll-stack-card"));
    cardsRef.current = cards;

    cards.forEach((card, index) => {
      card.style.marginBottom = index < cards.length - 1 ? `${itemDistance}px` : "0px";
      card.style.willChange = "transform, filter";
      card.style.transformOrigin = "top center";
      card.style.backfaceVisibility = "hidden";
    });

    const handleScroll = () => updateCards();
    const handleResize = () => {
      lastTransformsRef.current.clear();
      updateCards();
    };

    let cleanupScroll = () => {};
    if (useWindowScroll) {
      const lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        smoothWheel: true,
        syncTouch: true,
        lerp: 0.1,
        // Let full-screen, long-form project previews keep their native wheel scroll.
        prevent: (node) => Boolean(node?.closest?.(".project-preview-panel-scroll")),
      });

      lenis.on("scroll", () => {
        handleScroll();
      });

      const raf = (time) => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };

      animationFrameRef.current = requestAnimationFrame(raf);
      lenisRef.current = lenis;
      cleanupScroll = () => lenis.destroy();
    } else {
      scroller.addEventListener("scroll", handleScroll, { passive: true });
      cleanupScroll = () => scroller.removeEventListener("scroll", handleScroll);
    }

    window.addEventListener("resize", handleResize);
    updateCards();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      cleanupScroll();
      window.removeEventListener("resize", handleResize);
      cardsRef.current = [];
      lastTransformsRef.current.clear();
      stackCompletedRef.current = false;
    };
  }, [itemDistance, updateCards, useWindowScroll]);

  return (
    <div className={`scroll-stack-scroller ${className}`.trim()} ref={scrollerRef}>
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
}
