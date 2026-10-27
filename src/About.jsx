import "./About.css";
import {Clerk, Css, Vercel, Figma, Gads, Ganalytics, Html, Js, Meta, Pinterest, React, Seen, CircularText} from './assets/icons.jsx'
import figure from "./assets/figure_white_coat.webp"
const iconStyle = { width: "var(--icon-scroll-size)", height: "var(--icon-scroll-size)" };
const tools = [
    <Clerk key="clerk" style={iconStyle} />,
    <Html key="html" style={iconStyle} />,
    <Css key="css" style={iconStyle} />,
    <Js key="js" style={iconStyle} />,
    <Vercel key="vercel" style={iconStyle} />,
    <React key="react" style={iconStyle} />,
    <Figma key="figma" style={iconStyle} />,
    <Gads key="gads" style={iconStyle} />,
    <Ganalytics key="ganalytics" style={iconStyle} />,
    <Meta key="meta" style={iconStyle} />,
    <Pinterest key="pinterest" style={iconStyle} />
];

function About(){

    return(
        <>
            <section className="about" id="About">
                <div className="text-img">
                    <div className="text-content">
                <h2 className="about-text-1">Combining Development, Design, and <span className="about-accent">Digital Marketing</span></h2>
                <p className="about-text-2">Building modern websites with code, creativity, and digital strategy.
                    I'm a Frontend Developer and Digital Marketing enthusiast with experience in React.js, HTML, CSS, JavaScript, Figma, SEO, and content marketing. I enjoy creating responsive, user-friendly websites while applying SEO and analytics to improve visibility and engagement. From designing interfaces in Figma to developing them with React and optimizing them for search engines, I'm passionate about building digital experiences that are both beautiful and effective.
                </p>
                <a href="/Resume_.pdf" className="about-btn" target="_blank" rel="noopener noreferrer">
                    View CV
                    <Seen style={{ width: 20, height: 20 }} />
                </a>
                </div>
                <div className="figure-wrap">
                    <div className="figure-ring" aria-hidden="true">
                        <CircularText className="figure-ring-svg" />
                    </div>
                    {/* WebP, explicit dimensions, lazy-loaded (below the fold) */}
                    <img
                        className="figure_white_coat"
                        src={figure}
                        alt="Dev Kumar in a white coat"
                        width="314"
                        height="428"
                        loading="lazy"
                        decoding="async"
                    />
                </div>
                </div>
                <div className="tool-scroll-container">
                    <div className="tool-scroll">
                        {tools}
                    </div>
                    <div className="tool-scroll" aria-hidden="true">
                        {tools}
                    </div>
                </div>
            </section>
        </>
    )
}

export default About;