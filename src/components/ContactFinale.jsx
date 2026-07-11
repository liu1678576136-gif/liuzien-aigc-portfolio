import { ArrowUpRight, Mail } from "lucide-react";
import { profile } from "../data/portfolio.js";
import { ContactButton } from "./TemplatePrimitives.jsx";

export function ContactFinale() {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-inner">
        <p className="section-kicker">Contact / 合作咨询</p>
        <h2 className="hero-heading section-title">Let's Build</h2>
        <p>Bring an AI visual direction from prompt experiments to campaign-ready imagery, motion frames, and a portfolio case that can be shown with confidence.</p>

        <div className="contact-actions">
          <a className="contact-email" href={`mailto:${profile.email}`}>
            <Mail size={20} />
            {profile.email}
          </a>
          <ContactButton />
        </div>
        <a className="contact-small-link" href="#hero" aria-label="Back to hero">
          Back to top
          <ArrowUpRight size={16} />
        </a>
      </div>
    </section>
  );
}
