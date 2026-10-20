import { useState, useEffect, useRef } from 'react'
import LocomotiveScroll from 'locomotive-scroll'
import './App.css'
import Hero from './Hero.jsx'
import Work from './Work.jsx'
import About from './About.jsx'
import Footer from './Footer.jsx'
import GradualBlur from './component/GradualBlur.jsx'
import Casestudy from './Casestudy.jsx'
import LoadingScreen from './LoadingScreen.jsx'

function getRouteFromPath(pathname) {
  const cleanPath = pathname.replace(/\/+$/, '') || '/';
  if (cleanPath === '/casestudy' || cleanPath === '/case-study' || cleanPath === '/lunara') {
    return 'casestudy';
  }
  return 'home';
}

function App() {
  const [route, setRoute] = useState(() => getRouteFromPath(window.location.pathname));
  const [isLoading, setIsLoading] = useState(true);
  const savedScrollY = useRef(0);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const nextRoute = getRouteFromPath(window.location.pathname);
      setRoute(nextRoute);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // LocomotiveScroll for home page
  useEffect(() => {
    if (route !== 'home') return;

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
  }, [route]);

  const navigateToHome = () => {
    window.history.pushState(null, '', '/');
    setRoute('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSection = (sectionId) => {
    if (sectionId === 'casestudy') {
      navigateToCaseStudy();
      return;
    }
    window.history.pushState(null, '', `/#${sectionId}`);
    setRoute('home');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 80);
  };

  const navigateToCaseStudy = () => {
    savedScrollY.current = window.scrollY;
    window.history.pushState(null, '', '/casestudy');
    window.scrollTo(0, 0);
    setRoute('casestudy');
  };

  const handleBackFromCaseStudy = () => {
    window.history.pushState(null, '', '/');
    setRoute('home');
    setTimeout(() => {
      window.scrollTo(0, savedScrollY.current);
    }, 50);
  };

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      {route === 'casestudy' ? (
        <Casestudy onBack={handleBackFromCaseStudy} />
      ) : (
        <>
          <Hero />
          <Work onOpenCaseStudy={navigateToCaseStudy} />
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
