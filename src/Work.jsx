import './Work.css'
import card1_493 from "./assets/card-1-493.webp"
import card1_740 from "./assets/card-1-740.webp"
import card1_986 from "./assets/card-1-986.webp"

import card2_493 from "./assets/card-2-493.webp"
import card2_740 from "./assets/card-2-740.webp"
import card2_986 from "./assets/card-2-986.webp"

import card3_493 from "./assets/card-3-493.webp"
import card3_740 from "./assets/card-3-740.webp"
import card3_986 from "./assets/card-3-986.webp"

import card4_493 from "./assets/card-4-493.webp"
import card4_740 from "./assets/card-4-740.webp"
import card4_986 from "./assets/card-4-986.webp"

import { Arrow_up_right } from './assets/icons.jsx'

const workData = [
    {
        id: 1,
        title: 'Ai Searcho',
        description: 'Web design of Ai based SEO Tool',
        image: card1_740,
        srcSet: `${card1_493} 493w, ${card1_740} 740w, ${card1_986} 986w`,
        className: 'work-card',
        alt: 'Ai Searcho web design preview',
        badge: "Website",
        link: "https://ai-searcho.vercel.app/",
        isLcp: true,
        tone: "#000000",
    },
    {
        id: 2,
        title: 'Genova Labs',
        description: 'Website design for a Biotech startup',
        image: card2_740,
        srcSet: `${card2_493} 493w, ${card2_740} 740w, ${card2_986} 986w`,
        className: 'work-card',
        alt: 'Genova Labs website design preview',
        badge: "Website",
        link: "https://devknowledgebase.github.io/Genova-Labs/",
        tone: "#79eb00ff",
    },
    {
        id: 3,
        title: 'Lunara',
        description: 'Organic Pinterest Marketing',
        image: card3_740,
        srcSet: `${card3_493} 493w, ${card3_740} 740w, ${card3_986} 986w`,
        className: 'work-card',
        alt: 'Lunara Pinterest marketing preview',
        badge: "Marketing",
        link: "/casestudy",
        isInternal: true,
        tone: "#E661FF",
    },
    {
        id: 4,
        title: 'Washit',
        description: 'Laundry service App Ui/Ux Design',
        image: card4_740,
        srcSet: `${card4_493} 493w, ${card4_740} 740w, ${card4_986} 986w`,
        className: 'work-card',
        alt: 'Washit UI/UX case study preview',
        badge: "Case Study",
        link: "https://www.behance.net/gallery/253368559/Washit-UiUx-Case-Study",
        tone: "#0066ff",
    }
];

function Work({ onOpenCaseStudy }) {
    return (
        <section className='work' id="Work">
            <h2 className='featured'>Featured Works</h2>
            <div className='work-cards-container'>
                {workData.map((item) => (
                    <div
                        key={item.id}
                        className={item.className}
                        style={item.tone ? { '--btn-color': item.tone } : undefined}
                    >
                        {/* Masked surface: holds everything that gets clipped by the notch */}
                        <div className='card-surface'>
                            <img
                                src={item.image}
                                srcSet={item.srcSet}
                                sizes="(max-width: 640px) 100vw, (max-width: 1100px) 100vw, 740px"
                                alt={item.alt}
                                width="740"
                                height="600"
                                loading={item.isLcp ? undefined : "lazy"}
                                decoding="async"
                                fetchPriority={item.isLcp ? "high" : "low"}
                            />

                            {item.badge && (
                                <span className='card-badge'>{item.badge}</span>
                            )}

                            <div className='card-text'>
                                <p>{item.title}</p>
                                {item.description && (
                                    <div className='card-description'>{item.description}</div>
                                )}
                            </div>
                        </div>

                        {/* Arrow button sits OUTSIDE the surface so the mask doesn't clip it */}
                        <a
                            href={item.link}
                            target={item.isInternal ? undefined : "_blank"}
                            rel={item.isInternal ? undefined : "noopener noreferrer"}
                            className="work-arrow-link"
                            style={item.tone ? { color: item.tone } : undefined}
                            onClick={item.isInternal ? (e) => {
                                e.preventDefault();
                                if (onOpenCaseStudy) onOpenCaseStudy();
                            } : undefined}
                            aria-label={item.isInternal ? `View ${item.title} case study` : `Visit ${item.title}`}
                        >
                            <Arrow_up_right className="work-arrow" />
                        </a>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Work