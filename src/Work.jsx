import './Work.css'
import Card from "./assets/card-1.png"
import Card1 from "./assets/card-2.png"
import Card2 from "./assets/card-3.png"
import Card3 from "./assets/card-4.png"
import { Arrow_up_right } from './assets/icons.jsx'

const workData = [
    {
        id: 1,
        title: 'Ai Searcho',
        description: 'Web design of Ai based SEO Tool',
        image: Card,
        className: 'work-card',
        alt: 'card-1',
        badge: "Website",
        link: "https://ai-searcho.vercel.app/",
    },
    {
        id: 2,
        title: 'Genova Labs',
        description: 'Website design for a Biotech startup',
        image: Card1,
        className: 'work-card',
        alt: 'card-2',
        badge: "Website",
        link: "https://devknowledgebase.github.io/Genova-Labs/",
    },
    {
        id: 3,
        title: 'Lunara',
        description: 'Organic Pinterest Marketing',
        image: Card2,
        className: 'work-card',
        alt: 'card-3',
        badge: "Marketing",
    },
    {
        id: 4,
        title: 'Washit',
        description: 'Laundry service App Ui/Ux Design',
        image: Card3,
        className: 'work-card',
        alt: 'card-4',
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
                        <img src={item.image} alt={item.alt} />

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