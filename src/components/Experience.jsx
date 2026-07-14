import { contactLinks, processTags } from "../data/portfolio.js";
import { BorderGlow } from "./BorderGlow.jsx";

const profileMetrics = [
  { value: "7+", label: "年商业视觉经验" },
  { value: "AI", label: "生成式视觉流程" },
  { value: "Brand", label: "品牌视觉交付" },
  { value: "SZ", label: "深圳" },
];

export function Experience() {
  return (
    <section className="content-section experience" id="experience">
      <div className="section-heading experience-heading">
        <p className="eyebrow">Profile</p>
        <h2>Design Profile</h2>
        <p>从商业视觉到 AI 设计工作流</p>
      </div>

      <div className="experience-grid">
        <BorderGlow className="experience-glow portrait-glow" animated fillOpacity={0.18}>
          <div className="portrait-panel">
            <img src="/assets/professional-portrait-cleaned.png" alt="刘梓恩职业照" />
            <div className="portrait-caption">
              <span>Visual Designer</span>
              <strong>Shenzhen</strong>
            </div>
          </div>
        </BorderGlow>

        <BorderGlow
          className="experience-glow profile-glow profile-info-glow"
          edgeSensitivity={18}
          glowColor="4 96 68"
          backgroundColor="#120f17"
          borderRadius={28}
          glowRadius={52}
          glowIntensity={1.55}
          coneSpread={30}
          colors={["#ff3d33", "#ffd7d2", "#7b0d09"]}
          fillOpacity={0.42}
        >
          <div className="profile-copy">
            <p className="role-line">VISUAL / AI / BRAND DESIGN</p>
            <h3>把品牌判断、商业视觉和 AI 工作流连在一起。</h3>
            <p>
              7 年商业视觉经验，覆盖品牌、电商、终端物料与 AIGC 视觉探索。擅长把运营目标转化为清晰、稳定、可落地的视觉系统。
            </p>

            <div className="tag-row">
              {processTags.map(({ icon: Icon, label }) => (
                <span key={label}>
                  <Icon size={16} />
                  {label}
                </span>
              ))}
            </div>

            <div className="contact-list" aria-label="联系方式">
              {contactLinks.slice(0, 2).map(({ icon: Icon, label, value, href }) => (
                <a key={label} href={href}>
                  <Icon size={18} />
                  <span>{label}</span>
                  <strong>{value}</strong>
                </a>
              ))}
            </div>
          </div>
        </BorderGlow>
      </div>

      <div className="metric-grid">
        {profileMetrics.map((metric) => (
          <BorderGlow className="experience-glow metric-glow" key={metric.label} glowRadius={24} fillOpacity={0.18}>
            <div className="metric-card">
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          </BorderGlow>
        ))}
      </div>
    </section>
  );
}
