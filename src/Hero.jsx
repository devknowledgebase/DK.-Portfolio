import './Hero.css'
import { Arrowright, Logo } from './assets/icons.jsx'
import PixelTrail from './component/PixelTrail.jsx';


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
        <div className='navbar'>
          <Logo style={{ width: 50, height: 19 }} onClick={() => scrollToSection('Home')}/>
          <div className="navlist">
            <div onClick={() => scrollToSection('Home')}>Home</div>
            <div onClick={() => scrollToSection('Work')}>Work</div>
            <div onClick={() => scrollToSection('About')}>About</div>
          </div>
          <button className='btn' onClick={() => scrollToSection('Footer')}>
            <div>Let’s Talk</div>
            <Arrowright style={{ color: "var(--neutral-100)", width: 20, height: 20 }} />
          </button>
        </div>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}>
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
        </div>
        <div className='hero-content'>
          <div className='hero-text'>
            <p>Hello! I’m Dev.</p>
            <h1>
              Turning Ideas into Interactive <span style={{ color: "var(--neutral-40)" }}>Digital Products</span>
            </h1>
          </div>
          <button className='btn-hero' onClick={() => scrollToSection('About')}>About Me <Arrowright style={{ color: "var(--neutral-0)", width: 28, height: 28 }} /></button>
        </div>
      </div>
    </>
  )
}

export default Hero