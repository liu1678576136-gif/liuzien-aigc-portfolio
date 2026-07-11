import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { scrollSequence } from "../data/portfolio.js";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

export function PortfolioMotion() {
  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sequenceCleanups = [];

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(".fade-in, .animated-text-char, .service-row, .project-card, .story-scene, .story-split-char", { clearProps: "all", opacity: 1, y: 0 });
        gsap.set(".scroll-sequence-canvas", { display: "none" });
        gsap.set(".scroll-sequence-poster", { display: "block" });
        return;
      }

      const canvas = document.querySelector(".scroll-sequence-canvas");
      const sequenceSection = document.querySelector(".sequence-hero");

      if (canvas && sequenceSection) {
        const context = canvas.getContext("2d");
        const state = { frame: 0 };
        const images = Array.from({ length: scrollSequence.frameCount }, (_, index) => {
          const image = new Image();
          image.decoding = "async";
          image.src = `${scrollSequence.basePath}/frame_${String(index + 1).padStart(4, "0")}.${scrollSequence.extension}`;
          return image;
        });

        function drawCover(image) {
          if (!image?.complete || !image.naturalWidth) return;

          const width = canvas.clientWidth;
          const height = canvas.clientHeight;
          context.imageSmoothingEnabled = true;
          context.imageSmoothingQuality = "high";

          const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight) * 1.015;
          const drawWidth = image.naturalWidth * scale;
          const drawHeight = image.naturalHeight * scale;
          const offsetX = (width - drawWidth) / 2 - width * 0.012;
          const offsetY = (height - drawHeight) / 2 + height * 0.008;

          context.clearRect(0, 0, width, height);
          context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
        }

        function render() {
          drawCover(images[Math.round(state.frame)]);
        }

        function resize() {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          canvas.width = Math.round(canvas.clientWidth * dpr);
          canvas.height = Math.round(canvas.clientHeight * dpr);
          context.setTransform(dpr, 0, 0, dpr, 0, 0);
          render();
        }

        images[0].addEventListener("load", resize, { once: true });
        window.addEventListener("resize", resize);
        resize();

        const splitInstances = gsap.utils.toArray(".story-scene .split-target").map(
          (target) =>
            new GSAPSplitText(target, {
              type: "chars",
              smartWrap: true,
              charsClass: "split-char story-split-char",
              wordsClass: "split-word",
              reduceWhiteSpace: false,
            }),
        );
        sequenceCleanups.push(() => {
          splitInstances.forEach((split) => split.revert());
        });

        gsap.set(".story-scene", { autoAlpha: 0 });
        gsap.set(".story-scene:first-child", { autoAlpha: 1, rotate: 0 });
        gsap.set(".story-split-char", {
          willChange: "opacity, transform",
          opacity: 0,
          y: 42,
        });
        gsap.set(".story-scene:first-child .story-split-char", {
          opacity: 1,
          y: 0,
        });

        const sceneStep = 1.55;
        const revealDuration = 0.42;
        const revealStagger = 0.006;
        const holdAfterReveal = 0.42;
        const sequenceDuration = Math.max(1, scrollSequence.storyScenes.length * sceneStep);

        const sequenceTimeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: sequenceSection,
            start: "top top",
            end: "+=9200",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        sequenceTimeline.to(state, {
          frame: images.length - 1,
          snap: "frame",
          onUpdate: render,
          duration: sequenceDuration,
        }, 0);

        const scenes = gsap.utils.toArray(".story-scene");
        scenes.forEach((scene, index) => {
          const chars = scene.querySelectorAll(".story-split-char");
          const at = index * sceneStep;
          const revealStart = at + 0.04;
          const nextSceneStart = at + revealDuration + holdAfterReveal;

          if (index > 0) {
            sequenceTimeline
              .to(scenes[index - 1], { autoAlpha: 0, y: -18, rotate: -1.4, duration: 0.14, ease: "power2.out" }, at - 0.08)
              .fromTo(
                scene,
                { autoAlpha: 0, y: 26, rotate: 5, transformOrigin: "0% 50%" },
                { autoAlpha: 1, y: 0, rotate: 0, duration: 0.24, ease: "none" },
                at,
              )
              .fromTo(
                chars,
                {
                  opacity: 0,
                  y: 42,
                },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.42,
                  ease: "power3.out",
                  stagger: revealStagger,
                },
                revealStart,
              );
          } else {
            sequenceTimeline.fromTo(
              chars,
              {
                opacity: 0,
                y: 42,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.42,
                ease: "power3.out",
                stagger: revealStagger,
              },
              revealStart,
            );
          }

          if (index < scenes.length - 1) {
            sequenceTimeline.to(scene, { autoAlpha: 1, duration: 0.001 }, nextSceneStart);
          }
        });

        sequenceCleanups.push(() => {
          window.removeEventListener("resize", resize);
        });
      }

      gsap.utils.toArray(".fade-in").forEach((element) => {
        gsap.fromTo(
          element,
          {
            x: Number.parseFloat(element.style.getPropertyValue("--fade-x")) || 0,
            y: Number.parseFloat(element.style.getPropertyValue("--fade-y")) || 30,
            opacity: 0,
          },
          {
            x: 0,
            y: 0,
            opacity: 1,
            duration: Number.parseFloat(element.style.getPropertyValue("--fade-duration")) || 0.7,
            delay: Number.parseFloat(element.style.getPropertyValue("--fade-delay")) || 0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 92%",
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray(".section-title").forEach((heading) => {
        if (heading.closest(".hero-section")) return;

        gsap.fromTo(
          heading,
          { y: 84, opacity: 0, scaleY: 0.82, transformOrigin: "50% 100%" },
          {
            y: 0,
            opacity: 1,
            scaleY: 1,
            duration: 1.05,
            ease: "expo.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 84%",
              once: true,
            },
          },
        );
      });

      const textChars = gsap.utils.toArray(".animated-text-char");
      if (textChars.length) {
        gsap.fromTo(
          textChars,
          { opacity: 0.2 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.012,
            scrollTrigger: {
              trigger: ".animated-text",
              start: "top 80%",
              end: "bottom 20%",
              scrub: true,
            },
          },
        );
      }

      gsap.utils.toArray(".service-row").forEach((row, index) => {
        gsap.fromTo(
          row,
          { y: 76, opacity: 0, scale: 0.97 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            delay: index * 0.08,
            ease: "power4.out",
            scrollTrigger: {
              trigger: row,
              start: "top 86%",
              once: true,
            },
          },
        );
      });

      const projectSection = document.querySelector(".projects-section");

      if (projectSection) {
        gsap.to(".project-motion-shell span", {
          yPercent: (index) => [-12, 9, -7][index] || 0,
          xPercent: (index) => [7, -8, 12][index] || 0,
          rotate: (index) => [17, 13, 76][index] || 0,
          ease: "none",
          scrollTrigger: {
            trigger: projectSection,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.4,
          },
        });
      }

      const contactSection = document.querySelector(".contact-section");
      const contactInner = document.querySelector(".contact-inner");

      if (contactSection && contactInner) {
        gsap.fromTo(
          contactInner,
          { y: 110, opacity: 0.12, scale: 0.97 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: contactSection,
              start: "top 98%",
              end: "top 44%",
              scrub: 1.2,
              invalidateOnRefresh: true,
            },
          },
        );
      }

      ScrollTrigger.refresh();
    });

    return () => {
      sequenceCleanups.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, []);

  return null;
}
