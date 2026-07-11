import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { profile } from "../data/portfolio.js";

export function ContactButton({ className = "" }) {
  return (
    <a className={`contact-button ${className}`.trim()} href={`mailto:${profile.email}`}>
      Contact / 合作
    </a>
  );
}

export function LiveProjectButton({ href = "#contact" }) {
  return (
    <a className="live-project-button" href={href}>
      View Case
      <ArrowUpRight size={18} strokeWidth={1.9} />
    </a>
  );
}

export function FadeIn({
  as: Component = "div",
  children,
  className = "",
  delay = 0,
  x = 0,
  y = 30,
  duration = 0.7,
  ...props
}) {
  return (
    <Component
      className={`fade-in ${className}`.trim()}
      {...props}
      style={{
        "--fade-delay": `${delay}s`,
        "--fade-x": `${x}px`,
        "--fade-y": `${y}px`,
        "--fade-duration": `${duration}s`,
        ...props.style,
      }}
    >
      {children}
    </Component>
  );
}

export function Magnet({
  children,
  className = "",
  padding = 150,
  strength = 3,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
}) {
  const ref = useRef(null);

  function handleMove(event) {
    const node = ref.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = event.clientX - centerX;
    const distanceY = event.clientY - centerY;
    const withinX = event.clientX >= rect.left - padding && event.clientX <= rect.right + padding;
    const withinY = event.clientY >= rect.top - padding && event.clientY <= rect.bottom + padding;

    if (!withinX || !withinY) {
      handleLeave();
      return;
    }

    node.style.transition = activeTransition;
    node.style.transform = `translate3d(${distanceX / strength}px, ${distanceY / strength}px, 0)`;
  }

  function handleLeave() {
    const node = ref.current;
    if (!node) return;

    node.style.transition = inactiveTransition;
    node.style.transform = "translate3d(0, 0, 0)";
  }

  return (
    <span ref={ref} className={`magnet ${className}`.trim()} onMouseMove={handleMove} onMouseLeave={handleLeave}>
      {children}
    </span>
  );
}

export function AnimatedText({ text, className = "" }) {
  return (
    <p className={`animated-text ${className}`.trim()} aria-label={text}>
      {Array.from(text).map((char, index) => (
        <span className="animated-text-char" aria-hidden="true" key={`${char}-${index}`}>
          {char === " " ? "\u00a0" : char}
        </span>
      ))}
    </p>
  );
}
