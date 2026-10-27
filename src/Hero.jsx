import { useState, useEffect } from 'react'
import './Hero.css'
import { Arrowright, Logo } from './assets/icons.jsx'
import CurvedLoop from './CurvedLoop.jsx'



function Hero() {
  // Mobile menu (the links collapse behind a hamburger at ≤ 640px)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    const close = () => setMenuOpen(false)
    const onKey = (e) => { if (e.key === 'Escape') close() }
    const onPointer = (e) => { if (!e.target.closest('.navbar')) close() }
    const wide = window.matchMedia('(min-width: 641px)')
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    wide.addEventListener('change', close)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
      wide.removeEventListener('change', close)
    }
  }, [menuOpen])

  function scrollToSection(id) {
    setMenuOpen(false)
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
  return (
    <>
      <div className='hero-container' id="Home">
        <nav className='navbar' aria-label="Main navigation">
          <a href="/" className="logo-link" onClick={(e) => { e.preventDefault(); scrollToSection('Home'); }} aria-label="Home">
            <Logo style={{ width: 50, height: 19, color: '#ffffffff' }} />
          </a>
          <div className={`navlist${menuOpen ? ' is-open' : ''}`} id="primary-nav">
            <a href="/#Home" onClick={(e) => { e.preventDefault(); scrollToSection('Home'); }}>Home</a>
            <a href="/#Work" onClick={(e) => { e.preventDefault(); scrollToSection('Work'); }}>Work</a>
            <a href="/#About" onClick={(e) => { e.preventDefault(); scrollToSection('About'); }}>About</a>
          </div>
          <a href="/#Footer" className='btn' onClick={(e) => { e.preventDefault(); scrollToSection('Footer'); }}>
            <div>Let's Talk</div>
            <Arrowright style={{ color: "var(--neutral-100)", width: 20, height: 20 }} />
          </a>
          <button
            type="button"
            className="nav-toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="primary-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="nav-toggle-bar" />
            <span className="nav-toggle-bar" />
            <span className="nav-toggle-bar" />
          </button>
        </nav>
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-loop">
        <CurvedLoop
          marqueeText="Developer ✦ Marketer"
          shape="wave"
          curveAmount={220}
          speed={2}
          direction="left"
          interactive
          pauseOnHover
          color="#ffffff"
          separator="✦"
          separatorColor="#ff5a1f"
          fontSize={120}
          fontWeight={800}
          letterSpacing={2}
          edgeFade={0}
          outline={false}
        />
      </div>
      {/* LCP element: exported at displayed 378x473 size, preloaded in index.html with 2x retina srcset */}
      <img
        className="hero-figure"
        src="/figure.webp"
        srcSet="/figure-378.webp 378w, /figure-756.webp 756w"
        sizes="(max-width: 640px) 378px, 447px"
        alt="Figure in a chrome helmet and dark cloak"
        width="378"
        height="473"
        fetchpriority="high"
        decoding="async"
      />
        <div className='hero-content'>
          <div className='hero-text'>
            <p>Hello! I'm Dev.</p>
            <h1>
              Turning Ideas into Interactive <span style={{ color: "var(--ember)" }}>Digital Products</span>
            </h1>
          </div>
          <a href="/#About" className='btn-hero' onClick={(e) => { e.preventDefault(); scrollToSection('About'); }}>About Me <Arrowright style={{ color: "var(--neutral-0)", width: 28, height: 28 }} /></a>
        </div>

      </div>
    </>
  )
}

export default Hero