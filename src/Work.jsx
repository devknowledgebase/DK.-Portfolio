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
    }
];

function Work({ onOpenCaseStudy }) {
    return (
        <div className='work' id="Work">
            <div className='featured'>Featured Works</div>
            <div className='work-cards-container'>
                {workData.map((item) => (
                    <div key={item.id} className={item.className}>
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

                        <div className='card-text-btn'>
                            <div className='card-text'>
                                <p>{item.title}</p>
                                {item.description && (
                                    <div className='card-description'>{item.description}</div>
                                )}
                            </div>
                            <Arrow_up_right
                                className="work-arrow"
                                style={{ zIndex: '10', position: 'relative', cursor: 'pointer' }}
                                onClick={() => {
                                    if (item.id === 3 && onOpenCaseStudy) {
                                        onOpenCaseStudy();
                                    } else if (item.link) {
                                        window.open(item.link, '_blank', 'noopener,noreferrer');
                                    }
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Work