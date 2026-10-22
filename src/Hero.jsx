import { useState, useEffect, lazy, Suspense } from 'react'
import './Hero.css'
import { Arrowright, Logo } from './assets/icons.jsx'

const PixelTrail = lazy(() => import('./component/PixelTrail.jsx'));

function Hero() {
  const [showTrail, setShowTrail] = useState(false);

  useEffect(() => {
    // Only load PixelTrail Three.js canvas on devices with a mouse/fine pointer
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer) return;

    // Defer initialization to idle callback so it never competes with initial paint or LCP
    if ('requestIdleCallback' in window) {
      const handle = requestIdleCallback(() => setShowTrail(true), { timeout: 2000 });
      return () => cancelIdleCallback(handle);
    } else {
      const timer = setTimeout(() => setShowTrail(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  function scrollToSection(id) {
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
            <Logo style={{ width: 50, height: 19, color: '#000000' }} />
          </a>
          <div className="navlist">
            <a href="/#Home" onClick={(e) => { e.preventDefault(); scrollToSection('Home'); }}>Home</a>
            <a href="/#Work" onClick={(e) => { e.preventDefault(); scrollToSection('Work'); }}>Work</a>
            <a href="/#About" onClick={(e) => { e.preventDefault(); scrollToSection('About'); }}>About</a>
          </div>
          <a href="/#Footer" className='btn' onClick={(e) => { e.preventDefault(); scrollToSection('Footer'); }}>
            <div>Let's Talk</div>
            <Arrowright style={{ color: "var(--neutral-100)", width: 20, height: 20 }} />
          </a>
        </nav>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}>
          {showTrail && (
            <Suspense fallback={null}>
              <PixelTrail
                gridSize={50}
                trailSize={0.1}
                maxAge={250}
                interpolate={5}
                color="#5227FF"
                gooeyFilter={{ id: "custom-goo-filter", strength: 2 }}
                gooeyEnabled
                gooStrength={2}
              />
            </Suspense>
          )}
        </div>
        <div className='hero-content'>
          <div className='hero-text'>
            <p>Hello! I'm Dev.</p>
            <h1>
              Turning Ideas into Interactive <span style={{ color: "var(--neutral-40)" }}>Digital Products</span>
            </h1>
          </div>
          <a href="/#About" className='btn-hero' onClick={(e) => { e.preventDefault(); scrollToSection('About'); }}>About Me <Arrowright style={{ color: "var(--neutral-0)", width: 28, height: 28 }} /></a>
        </div>
      </div>
    </>
  )
}

export default Hero