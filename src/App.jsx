import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import './App.css'
import Hero from './Hero.jsx'
import Work from './Work.jsx'
import About from './About.jsx'
import Footer from './Footer.jsx'
import GradualBlur from './component/GradualBlur.jsx'
import LoadingScreen from './LoadingScreen.jsx'
import SEOHead from './components/SEOHead.jsx'
import NotFound from './components/NotFound.jsx'

const Casestudy = lazy(() => import('./Casestudy.jsx'));

// ──────────────────────────────────────────────
// JSON-LD structured data
// ──────────────────────────────────────────────
const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "name": "Dev Kumar | Portfolio",
      "url": "https://devkumar.is-a.dev/",
    },
    {
      "@type": "Person",
      "name": "Dev Kumar",
      "url": "https://devkumar.is-a.dev/",
      "jobTitle": "Frontend Developer & Digital Marketing Enthusiast",
      "sameAs": [
        "https://www.linkedin.com/in/kumaardev/",
        "https://github.com/devknowledgebase",
        "https://x.com/Dev3807",
      ],
    },
  ],
};

const casestudyJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Lunara — Pinterest Marketing Case Study",
  "description":
    "How I grew a Pinterest brand to 164K+ impressions and 113K audience through organic content strategy, Pinterest SEO, and data-driven optimization.",
  "author": {
    "@type": "Person",
    "name": "Dev Kumar",
    "url": "https://devkumar.is-a.dev/",
  },
  "publisher": {
    "@type": "Person",
    "name": "Dev Kumar",
  },
  "mainEntityOfPage": "https://devkumar.is-a.dev/casestudy",
};

// ──────────────────────────────────────────────
// Route resolver
// ──────────────────────────────────────────────
function getRouteFromPath(pathname) {
  const cleanPath = pathname.replace(/\/+$/, '') || '/';

  // Redirect legacy aliases to the canonical URL
  if (cleanPath === '/case-study' || cleanPath === '/lunara') {
    window.history.replaceState(null, '', '/casestudy');
    return 'casestudy';
  }
  if (cleanPath === '/casestudy') {
    return 'casestudy';
  }
  if (cleanPath === '/') {
    return 'home';
  }

  // Any unrecognised path → 404
  return '404';
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

  const navigateToHome = (e) => {
    if (e) e.preventDefault();
    window.history.pushState(null, '', '/');
    setRoute('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSection = (sectionId, e) => {
    if (e) e.preventDefault();
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

  const navigateToCaseStudy = (e) => {
    if (e) e.preventDefault();
    savedScrollY.current = window.scrollY;
    window.history.pushState(null, '', '/casestudy');
    window.scrollTo(0, 0);
    setRoute('casestudy');
  };

  const handleBackFromCaseStudy = (e) => {
    if (e) e.preventDefault();
    window.history.pushState(null, '', '/');
    setRoute('home');
    setTimeout(() => {
      window.scrollTo(0, savedScrollY.current);
    }, 50);
  };

  // 404 route
  if (route === '404') {
    return <NotFound />;
  }

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      {route === 'casestudy' ? (
        <main>
          <SEOHead
            title="Lunara — Pinterest Marketing Case Study | Dev Kumar"
            description="How I grew a Pinterest brand to 164K+ impressions and 113K audience through organic content strategy, Pinterest SEO, and data-driven optimization."
            path="/casestudy"
            ogType="article"
            jsonLd={casestudyJsonLd}
          />
          <Suspense fallback={null}>
            <Casestudy onBack={handleBackFromCaseStudy} />
          </Suspense>
        </main>
      ) : (
        <main id="main-content">
          <SEOHead
            title="Dev Kumar | Frontend Developer & Digital Marketing Enthusiast"
            description="Frontend Developer crafting modern UI/UX and driving growth with digital marketing, social media marketing, and responsive web design."
            path="/"
            jsonLd={homeJsonLd}
          />
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
