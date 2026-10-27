import { useEffect, useRef } from 'react'
import './Work.css'
import card1_493 from "./assets/card-1-493.webp"
import card1_740 from "./assets/card-1-740.webp"

import card2_493 from "./assets/card-2-493.webp"
import card2_740 from "./assets/card-2-740.webp"

import card3_493 from "./assets/card-3-493.webp"
import card3_740 from "./assets/card-3-740.webp"

import card4_493 from "./assets/card-4-493.webp"
import card4_740 from "./assets/card-4-740.webp"

import { Arrow_up_right } from './assets/icons.jsx'

const workData = [
    {
        id: 1,
        title: 'Ai Searcho',
        description: 'Web design of Ai based SEO Tool',
        image: card1_740,
        srcSet: `${card1_493} 493w, ${card1_740} 740w`,
        className: 'work-card',
        alt: 'Ai Searcho web design preview',
        badge: "Website",
        link: "https://ai-searcho.vercel.app/",
        isLcp: true,
        tone: "#6B2EAE",
    },
    {
        id: 2,
        title: 'Genova Labs',
        description: 'Website design for a Biotech startup',
        image: card2_740,
        srcSet: `${card2_493} 493w, ${card2_740} 740w`,
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
        srcSet: `${card3_493} 493w, ${card3_740} 740w`,
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
        srcSet: `${card4_493} 493w, ${card4_740} 740w`,
        className: 'work-card',
        alt: 'Washit UI/UX case study preview',
        badge: "Case Study",
        link: "https://www.behance.net/gallery/253368559/Washit-UiUx-Case-Study",
        tone: "#0066ff",
    }
];

function Work({ onOpenCaseStudy }) {
    const sectionRef = useRef(null)
    const trackRef = useRef(null)
    const barRef = useRef(null)

    useEffect(() => {
        const section = sectionRef.current
        const track = trackRef.current
        const bar = barRef.current
        if (!section || !track) return

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
        const cards = Array.from(track.querySelectorAll('.work-card'))

        let distance = 0      // how far the track must travel horizontally
        let target = 0        // scroll progress 0..1 (raw)
        let current = 0       // smoothed progress
        let raf = 0

        const measure = () => {
            if (reduced.matches) {
                section.style.height = ''
                track.style.transform = ''
                cards.forEach((c) => { c.style.removeProperty('--shift'); c.style.removeProperty('--lift') })
                return
            }
            distance = Math.max(0, track.scrollWidth - window.innerWidth)
            // vertical scroll length = one viewport (the pinned frame) + horizontal distance
            section.style.height = `${window.innerHeight + distance}px`
            readScroll()
            current = target
            render()
        }

        const readScroll = () => {
            const top = section.getBoundingClientRect().top
            target = distance > 0 ? Math.min(1, Math.max(0, -top / distance)) : 0
        }

        const render = () => {
            const x = -current * distance
            track.style.transform = `translate3d(${x}px,0,0)`
            if (bar) bar.style.transform = `scaleX(${current})`
            // light parallax on each image, based on the card's distance from viewport centre
            const vw = window.innerWidth
            // Batch ALL reads first to avoid forced reflow (layout thrashing)
            const rects = cards.map((card) => card.getBoundingClientRect())
            const offsets = cards.map((card) => card.offsetLeft)
            // Then batch all writes
            cards.forEach((card, i) => {
                const r = rects[i]
                const d = (r.left + r.width / 2 - vw / 2) / vw // -1..1 roughly
                // cards rise from the bottom as they travel in from the right (first card starts at rest)
                let lift = 0
                if (i > 0) {
                    const rest = Math.max(offsets[i] - distance, vw * 0.15)
                    const t = Math.min(1, Math.max(0, (r.left - rest) / (vw - rest)))
                    lift = t * window.innerHeight * 0.9
                }
                card.style.setProperty('--shift', `${(-d * 40).toFixed(1)}px`)
                card.style.setProperty('--lift', `${lift.toFixed(1)}px`)
            })
        }

        const tick = () => {
            current += (target - current) * 0.12
            if (Math.abs(target - current) < 0.0002) current = target
            render()
            raf = current === target ? 0 : requestAnimationFrame(tick)
        }

        const onScroll = () => {
            if (reduced.matches) return
            readScroll()
            if (!raf) raf = requestAnimationFrame(tick)
        }

        // On phones the URL bar sliding in/out fires `resize` with a small height-only change;
        // re-measuring then would make the pinned section jump mid-scroll, so skip those.
        let lastW = window.innerWidth
        let lastH = window.innerHeight
        const onResize = () => {
            const w = window.innerWidth
            const h = window.innerHeight
            if (w === lastW && Math.abs(h - lastH) < 150) return
            lastW = w
            lastH = h
            measure()
        }

        measure()
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onResize)
        reduced.addEventListener('change', measure)
        const ro = new ResizeObserver(measure)
        ro.observe(track)

        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', onResize)
            reduced.removeEventListener('change', measure)
            ro.disconnect()
        }
    }, [])

    return (
        <section className='work' id="Work" ref={sectionRef}>
            <div className='work-sticky'>
                <div className='work-track' ref={trackRef}>
                    <h2 className='featured'>Featured Works</h2>
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
                                    sizes="(max-width: 640px) 86vw, (max-width: 1100px) 82vw, 740px"
                                    alt={item.alt}
                                    width="740"
                                    height="600"
                                    decoding="async"
                                    loading="lazy"
                                    draggable="false"
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
                    <a className='work-all' href="/projects">
                        View all projects
                        <Arrow_up_right className="work-all-arrow" />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default Work