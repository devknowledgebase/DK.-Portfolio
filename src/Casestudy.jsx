import "./Casestudy.css";
import { Arrowright, Logo, Perplexity, Notion, Canva, Figma_no_background } from "./assets/icons.jsx";

const stats = [
    { label: "Impressions", value: "164K+" },
    { label: "Total Audience", value: "113.4K" },
    { label: "Pins", value: "350+" },
    { label: "Clicks", value: "8.4K" },
    { label: "Eng. Rate", value: "8.24%" },
];

const responsibilities = [
"Pinterest SEO & Keyword Research",
"Content Strategy & Planning",
"Pin Design (Figma & Canva)",
"Copywriting & Call-to-Action Optimization",
"Board Organization & SEO",
"Trend Research",
"Pinterest Analytics & Performance Tracking",
"Organic Growth Strategy",
"Brand Consistency",
];

const process = [
    {
        step: "Research",
        points: [
            "Identified trending self-care topics",
            "Performed Pinterest keyword research",
            "Analyzed competitor accounts",
            "Studied seasonal search trends"
        ]
    },
    {
        step: "Design",
        points: [
            "Designed eye-catching vertical pins",
            "Created consistent brand visuals",
            "Optimized typography for mobile users"
        ]
    },
    {
        step: "Publish & Optimize",
        points: [
            "Scheduled regular content",
            "Optimized titles and descriptions",
            "Organized boards strategically",
            "Implemented Pinterest SEO"
        ]
    },
    {
        step: "Analyze & Improve",
        points: [
            "Reviewed analytics",
            "Identified high-performing content",
            "Tested different pin styles",
            "Refined publishing strategy"
        ]
    }
];

const bestPins = [
    { src: "https://assets.pinterest.com/ext/embed.html?id=1010424866457745451", height: 652 },
    { src: "https://assets.pinterest.com/ext/embed.html?id=1010424866447833638", height: 618 },
    { src: "https://assets.pinterest.com/ext/embed.html?id=1010424866453798785", height: 618 },
    { src: "https://assets.pinterest.com/ext/embed.html?id=1010424866458133226", height: 618 },
];

const tools = [
    <Perplexity style={{ width: "var(--casestudy-tool-width)", height: "var(--casestudy-tool-height)" }} />,
    <Notion style={{ width: "var(--casestudy-tool-width)", height: "var(--casestudy-tool-height)" }} />,
    <Canva style={{ width: "var(--casestudy-tool-width)", height: "var(--casestudy-tool-height)" }} />,
    <Figma_no_background style={{ width: "var(--casestudy-tool-width)", height: "var(--casestudy-tool-height)" }} />
];

function Casestudy({ onBack }) {
    return (
        <div className="casestudy-container">
            <nav className="casestudy-navbar">
                <Logo style={{ width: 50, height: 19, cursor: "pointer" }} onClick={onBack} />
                <button className="casestudy-back-btn" onClick={onBack}>
                    <Arrowright style={{ transform: "rotate(180deg)", width: 20, height: 20 }} />
                    <span>Back to Work</span>
                </button>
            </nav>

            <header className="casestudy-header">
                <div className="casestudy-header-top">
                    <div>
                        <span className="casestudy-tag">Case Study</span>
                        <h1 className="casestudy-title">Pinterest Marketing</h1>
                        <p className="casestudy-subtitle">Self-Care Niche</p>
                    </div>
                    
                        <a href="https://pin.it/2Kn4pJy6m"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="casestudy-back-btn view-profile-btn"
                    >
                        <span>View Profile</span>
                        <Arrowright style={{ width: 18, height: 18 }} />
                    </a>
                </div>
            </header>

            <section className="casestudy-stats">
                {stats.map((stat) => (
                    <div key={stat.label} className="stat-item">
                        <span className="stat-value">{stat.value}</span>
                        <span className="stat-label">{stat.label}</span>
                    </div>
                ))}
            </section>

            <main className="casestudy-content">
                <section className="casestudy-intro">
                    <p>Lunara is a Pinterest brand focused on inspiring healthier habits, mindfulness, productivity, and self-care. I built and managed the account from the ground up, creating an organic content strategy that combined Pinterest SEO, engaging visual design, and data-driven optimization to increase reach and audience engagement without paid advertising.
                    </p>
                </section>
                <section className="casestudy-section">
                    <h2>Project Overview</h2>
                    <table className="info-table">
                        <tbody>
                            <tr>
                                <td>Role</td>
                                <td>Digital Marketer &amp; Content Designer</td>
                            </tr>
                            <tr>
                                <td>Duration</td>
                                <td>Jan 2026 – Present</td>
                            </tr>
                            <tr>
                                <td>Platform</td>
                                <td>Pinterest</td>
                            </tr>
                            <tr>
                                <td>Niche</td>
                                <td>Self-Care</td>
                            </tr>
                            <tr>
                                <td>Goal</td>
                                <td>Build an audience through organic Pinterest marketing</td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                <section className="casestudy-section">
                    <h2>Responsibilities</h2>
                    <ul className="responsibilities-list">
                        {responsibilities.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section className="casestudy-section">
                    <h2>Process</h2>
                    <div className="process-flow">
                        {process.map((p, i) => (
                            <div className="process-step" key={p.step}>
                                <div className="process-step-inner">
                                    <div className="process-step-header">
                                        <h3>{p.step}</h3>
                                        <span className="process-number">{String(i + 1).padStart(2, "0")}</span>
                                    </div>
                                    <ul className="process-points">
                                        {p.points.map((point, index) => (
                                            <li key={index}>{point}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="casestudy-section">
                    <h2>Best Performing Pins</h2>
                    <div className="pins-grid">
                        {bestPins.map((pin, i) => (
                            <div className="pin-card" key={i} style={{ minHeight: `${pin.height}px` }}>
                                <iframe
                                    src={pin.src}
                                    height={pin.height}
                                    width="100%"
                                    frameBorder="0"
                                    scrolling="no"
                                    title={`Best performing pin ${i + 1}`}
                                ></iframe>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="casestudy-section">
                    <h2>Tools Used</h2>
                    <div className="tools-list">
                        {tools.map((tool) => (
                            <span className="tool-chip" key={tool}>{tool}</span>
                        ))}
                    </div>
                </section>

                <div className="casestudy-footer-nav">
                    <button className="casestudy-back-btn large" onClick={onBack}>
                        <Arrowright style={{ transform: "rotate(180deg)", width: 24, height: 24 }} />
                        <span>Back to All Works</span>
                    </button>
                </div>
            </main>
        </div>
    );
}

export default Casestudy;