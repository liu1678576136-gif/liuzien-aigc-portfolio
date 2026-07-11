import { services } from "../data/portfolio.js";

export function Strengths() {
  return (
    <section className="services-section" id="process">
      <div className="section-inner">
        <h2 className="dark-section-title">Process</h2>

        <div className="service-list">
          {services.map((service, index) => (
            <article className="service-row" key={service.number} style={{ "--service-index": index }}>
              <strong>{service.number}</strong>
              <div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
