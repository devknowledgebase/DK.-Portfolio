import { useState, useEffect } from 'react'
import LocomotiveScroll from 'locomotive-scroll'
import './App.css'
import Hero from './Hero.jsx'
import Work from './Work.jsx'
import About from './About.jsx'
import Footer from './Footer.jsx'
import GradualBlur from './component/GradualBlur.jsx'
import Casestudy from './Casestudy.jsx'

function App() {
  const [showCaseStudy, setShowCaseStudy] = useState(false);

  useEffect(() => {
    const ls = new LocomotiveScroll({
      smooth: true,
      lerp: 0.08,
      multiplier: 1,
      smartphone: { smooth: false },
      tablet: { smooth: false },
    });

    return () => {
      ls.destroy();
    };
  }, [showCaseStudy]);

  return (
    <>
      {showCaseStudy ? (
        <Casestudy onBack={() => setShowCaseStudy(false)} />
      ) : (
        <>
          <Hero />
          <Work onOpenCaseStudy={() => setShowCaseStudy(true)} />
          <About />
          <Footer />
        </>
      )}

      <GradualBlur
        target="page"
        position="bottom"
        height="140px"
        strength={2}
        divCount={5}
        curve="bezier"
        exponential
        opacity={1}
      />
    </>
  )
}

export default App
