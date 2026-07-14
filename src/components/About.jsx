import { FadeIn } from "./TemplatePrimitives.jsx";

const profileFacts = [
  { label: "当前身份", value: "AIGC Visual Designer" },
  { label: "服务方向", value: "Brand / 3D / AIGC" },
  { label: "手机", value: "159869963961" },
  { label: "邮箱", value: "1678576136@qq.com" },
];

const profileStats = [
  { value: "8+", label: "设计经验" },
  { value: "30+", label: "项目落地" },
  { value: "500+", label: "视觉页面" },
];

const buildingTags = ["品牌视觉系统", "AIGC 视觉工作流", "短视频封面体系", "电商营销视觉"];

const careerItems = [
  {
    period: "2024.08-2026.04",
    company: "天王电子（深圳）有限公司",
    role: "AIGC 设计师",
    text: "负责抖音店铺视觉设计与装修，完成电商节日活动主视觉、专题页、二级页、推广素材及商品相关设计；协同运营与推广团队制作宣传图及直播间物料，并将 AI 文生图技术应用于电商视觉生产。",
  },
  {
    period: "2022.05-2024.04",
    company: "中国特步（深圳加速度体育用品有限公司）",
    role: "企划设计师",
    text: "承接集团季度推广物料并统筹门店安装布置；依据促销计划制定全年销售节点及促销海报方案，重点跟进大型节日门店促销布展与物料执行。",
  },
  {
    period: "2018.08-2022.02",
    company: "宠控创新科技有限公司",
    role: "视觉设计师",
    text: "负责运营视觉与品牌调性把控，输出线下品牌推广、促销广告、沙龙展会等物料设计，包括海报、H5 邀请函、线上电商主图、详情页及 618 等节日活动主视觉。",
  },
];

export function AboutSection() {
  const updatePortraitSpotlight = (event) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    card.style.setProperty("--spotlight-x", `${x}px`);
    card.style.setProperty("--spotlight-y", `${y}px`);
    card.style.setProperty("--spotlight-opacity", "1");
  };

  const hidePortraitSpotlight = (event) => {
    event.currentTarget.style.setProperty("--spotlight-opacity", "0");
  };

  return (
    <section className="about-section" id="about">
      <div className="about-shell">
        <FadeIn className="about-heading" y={28}>
          <div>
            <h2>Work Experience</h2>
            <p>个人经历</p>
          </div>
          <span aria-hidden="true">↘</span>
        </FadeIn>

        <div className="about-grid">
          <FadeIn className="about-portrait-card" delay={0.08} y={38}>
            <div
              className="portrait-spotlight-card"
              onPointerMove={updatePortraitSpotlight}
              onPointerLeave={hidePortraitSpotlight}
            >
              <img
                className="portrait-base"
                src="/assets/professional-portrait-cleaned.png"
                alt="刘梓恩个人肖像"
                loading="lazy"
              />
              <img
                className="portrait-color"
                src="/assets/professional-portrait-cleaned.png"
                alt=""
                aria-hidden="true"
                loading="lazy"
              />
              <span className="spotlight-cursor" aria-hidden="true" />
            </div>
          </FadeIn>

          <FadeIn className="about-profile-panel" delay={0.12} y={38}>
            <p className="profile-kicker">About Me</p>
            <h3>刘梓恩</h3>
            <p className="profile-summary">
              我把视觉系统、品牌叙事和 AI 工作流集成成一套能落地的设计战斗力。擅长从 0 到 1 搭建风格方向，
              让产品、短视频和电商视觉更有记忆点，也更能打。
            </p>

            <dl className="profile-fact-grid">
              {profileFacts.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>

            <div className="profile-stats">
              {profileStats.map((item) => (
                <div key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <div className="now-building">
              <p>Now Building</p>
              <div>
                {buildingTags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn className="career-path" delay={0.16} y={34}>
          <div className="career-path-top">
            <p>Career Path</p>
            <strong>工作经历</strong>
          </div>
          <div className="career-track" aria-hidden="true" />
          <div className="career-list">
            {careerItems.map((item) => (
              <article key={item.period}>
                <span className="career-dot" aria-hidden="true" />
                <p className="career-period">{item.period}</p>
                <h3>{item.company}</h3>
                <strong>{item.role}</strong>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
