import { useEffect, useState } from "react";
import { ExternalLink, X } from "lucide-react";
import { projects } from "../data/portfolio.js";
import { LiveProjectButton } from "./TemplatePrimitives.jsx";
import ScrollStack, { ScrollStackItem } from "./ScrollStack.jsx";

export function Projects() {
  const [activePreview, setActivePreview] = useState(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  useEffect(() => {
    if (!activePreview) return undefined;

    setIsPreviewLoading(true);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setActivePreview(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("project-preview-open");

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("project-preview-open");
    };
  }, [activePreview]);

  const openPreview = (project, image, imageIndex) => {
    const previewImage = project.previewImages?.[imageIndex] ?? image;

    setIsPreviewLoading(true);
    setActivePreview({
      src: previewImage,
      title: project.title,
      category: project.category,
      label: `${project.title} preview ${imageIndex + 1}`,
      isLongForm: previewImage !== image,
    });
  };

  return (
    <section className="projects-section" id="projects">
      <div className="project-motion-shell" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="project-pin-stage">
        <div className="project-heading-wrap">
          <p className="section-kicker">Selected work / 项目案例</p>
          <h2 className="hero-heading section-title project-motion-heading">Project</h2>
        </div>

        <div className="project-stack">
          <ScrollStack
            className="projects-scroll-stack"
            itemDistance={118}
            itemScale={0.03}
            itemStackDistance={30}
            stackPosition="18%"
            scaleEndPosition="8%"
            baseScale={0.94}
            useWindowScroll
          >
            {projects.map((project) => (
              <ScrollStackItem key={project.number} itemClassName="project-stack-item">
                <article className="project-card">
              <div className="project-card-top">
                <div className="project-title-lockup">
                  <strong className="project-number">{project.number}</strong>
                  <div>
                    <p className="project-category">{project.category}</p>
                    <h3>{project.title}</h3>
                  </div>
                </div>
                <LiveProjectButton href={project.href} />
              </div>

              <p className="project-summary">{project.displaySummary ?? project.summary}</p>

              <div className="project-mosaic">
                <div className="project-mosaic-left">
                  {project.images.slice(0, 2).map((image, imageIndex) => (
                    <button
                      className="project-preview-trigger"
                      key={image}
                      type="button"
                      onClick={() => openPreview(project, image, imageIndex)}
                      aria-label={`Preview ${project.title} image ${imageIndex + 1} full screen`}
                    >
                      <img src={image} alt={`${project.title} preview detail ${imageIndex + 1}`} loading="lazy" />
                    </button>
                  ))}
                </div>
                <button
                  className="project-preview-trigger project-mosaic-hero-trigger"
                  type="button"
                  onClick={() => openPreview(project, project.images[2], 2)}
                  aria-label={`Preview ${project.title} main image full screen`}
                >
                  <img className="project-mosaic-hero" src={project.images[2]} alt={`${project.title} main preview`} loading="lazy" />
                </button>
              </div>
                </article>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </div>
      </div>

      {activePreview ? (
        <div className="project-preview-layer" role="dialog" aria-modal="true" aria-label={activePreview.label}>
          <button className="project-preview-backdrop" type="button" onClick={() => setActivePreview(null)} aria-label="Close project preview" />
          <div className={`project-preview-panel${activePreview.isLongForm ? " project-preview-panel-scroll" : ""}${isPreviewLoading ? " is-loading" : " is-ready"}`}>
            <div className="project-preview-top">
              <div>
                <p>{activePreview.category}</p>
                <strong>{activePreview.title}</strong>
              </div>
              <button type="button" onClick={() => setActivePreview(null)} aria-label="Close project preview">
                <X size={22} strokeWidth={2.4} />
              </button>
            </div>

            {isPreviewLoading ? (
              <div className="preview-loading-state" role="status" aria-live="polite">
                <span />
                <p>Loading preview</p>
              </div>
            ) : null}

            <img
              className="preview-media"
              src={activePreview.src}
              alt={activePreview.label}
              onLoad={() => setIsPreviewLoading(false)}
              onError={() => setIsPreviewLoading(false)}
            />

            <a href={activePreview.src} target="_blank" rel="noreferrer">
              OPEN ORIGINAL
              <ExternalLink size={16} strokeWidth={2.4} />
            </a>
          </div>
        </div>
      ) : null}
    </section>
  );
}
