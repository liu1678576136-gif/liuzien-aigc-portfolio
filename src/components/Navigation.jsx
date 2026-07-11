import { ArrowUpRight } from "lucide-react";
import { profile } from "../data/portfolio.js";

const navItems = [
  { label: "首页", href: "#hero" },
  { label: "经历", href: "#experience" },
  { label: "项目", href: "#projects" },
  { label: "优势", href: "#strengths" },
];

export function Navigation() {
  return (
    <header className="site-nav" aria-label="Primary navigation">
      <a className="brand-lockup" href="#hero" aria-label="返回首页">
        <span className="brand-mark">L</span>
        <span>LIU ZIEN</span>
      </a>
      <nav>
        {navItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <a className="nav-contact" href="#contact">
        联系
        <ArrowUpRight size={16} strokeWidth={1.8} />
      </a>
    </header>
  );
}
