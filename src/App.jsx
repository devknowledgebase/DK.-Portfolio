import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import './App.css'
import Hero from './Hero.jsx'
import Work from './Work.jsx'
import About from './About.jsx'
import Footer from './Footer.jsx'
import GradualBlur from './component/GradualBlur.jsx'
import LoadingScreen from './LoadingScreen.jsx'

const Casestudy = lazy(() => import('./Casestudy.jsx'));

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

  // LocomotiveScroll for home page - deferred to idle and skipped on mobile
  useEffect(() => {
    if (route !== 'home') return;
    let ls = null;
    let cancelled = false;

    const initScroll = async () => {
      // Mobile & tablet already disable smooth scroll, so avoid loading locomotive-scroll on mobile
      const isMobile = window.matchMedia('(max-width: 1024px)').matches;
      if (isMobile) return;

      const { default: LocomotiveScroll } = await import('locomotive-scroll');
      if (cancelled) return;
      ls = new LocomotiveScroll({
        smooth: true,
        lerp: 0.08,
        multiplier: 1,
        smartphone: { smooth: false },
        tablet: { smooth: false },
      });
    };

    if ('requestIdleCallback' in window) {
      const handle = requestIdleCallback(() => initScroll(), { timeout: 2000 });
      return () => {
        cancelled = true;
        cancelIdleCallback(handle);
        if (ls) ls.destroy();
      };
    } else {
      const timer = setTimeout(() => initScroll(), 800);
      return () => {
        cancelled = true;
        clearTimeout(timer);
        if (ls) ls.destroy();
      };
    }
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
        <main>
          <Suspense fallback={null}>
            <Casestudy onBack={handleBackFromCaseStudy} />
          </Suspense>
        </main>
      ) : (
        <main id="main-content">
          <Hero />
          <Work onOpenCaseStudy={navigateToCaseStudy} />
          <About />
          <Footer />
        </main>
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
