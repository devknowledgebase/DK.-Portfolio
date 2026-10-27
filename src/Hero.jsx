import { useState, useEffect, lazy, Suspense } from 'react'
import './Hero.css'
import { Arrowright, Logo } from './assets/icons.jsx'
import figure from './assets/figure.png'
import CurvedLoop from './CurvedLoop.jsx'



function Hero() {




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
            <Logo style={{ width: 50, height: 19, color: '#ffffffff' }} />
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
      <img
        className="hero-figure"
        src={figure}
        alt="Figure in a chrome helmet and dark cloak"
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