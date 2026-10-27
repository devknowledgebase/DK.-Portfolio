import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import './App.css'
import Hero from './Hero.jsx'
import LoadingScreen from './LoadingScreen.jsx'
import SEOHead from './components/SEOHead.jsx'
import NotFound from './components/NotFound.jsx'

// Code-split below-the-fold sections & heavy components: none of these are needed for first paint / LCP
const Work = lazy(() => import('./Work.jsx'));
const About = lazy(() => import('./About.jsx'));
const Footer = lazy(() => import('./Footer.jsx'));
const Casestudy = lazy(() => import('./Casestudy.jsx'));
const GradualBlur = lazy(() => import('./component/GradualBlur.jsx'));

// ──────────────────────────────────────────────
// JSON-LD structured data
// ──────────────────────────────────────────────
const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": "https://devkumar.is-a.dev/#profile",
      "url": "https://devkumar.is-a.dev/",
      "name": "Dev Kumar | Portfolio",
      "dateCreated": "2025-01-01T00:00:00+00:00",
      "dateModified": "2026-10-22T00:00:00+00:00",
      "mainEntity": {
        "@type": "Person",
        "@id": "https://devkumar.is-a.dev/#person",
        "name": "Dev Kumar",
        "url": "https://devkumar.is-a.dev/",
        "jobTitle": "Frontend Developer & Digital Marketing Enthusiast",
        "description":
          "Building modern websites with code, creativity, and digital strategy. Frontend Developer and Digital Marketing enthusiast with experience in React.js, HTML, CSS, JavaScript, Figma, SEO, and content marketing.",
        "image": "https://devkumar.is-a.dev/og-preview.png",
        "sameAs": [
          "https://www.linkedin.com/in/kumaardev/",
          "https://github.com/devknowledgebase",
          "https://x.com/Dev3807",
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://devkumar.is-a.dev/#website",
      "name": "Dev Kumar | Portfolio",
      "url": "https://devkumar.is-a.dev/",
    },
  ],
};

const casestudyJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Lunara — Pinterest Marketing Case Study",
  "description":
    "How I grew a Pinterest brand to 164K+ impressions and 113K audience through organic content strategy, Pinterest SEO, and data-driven optimization.",
  "image": "https://devkumar.is-a.dev/og-preview.png",
  "datePublished": "2026-01-15T00:00:00+00:00",
  "dateModified": "2026-10-22T00:00:00+00:00",
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

  // Prerender or bot environment needs all content immediately
  const isPrerenderEnv = typeof window === 'undefined' || /bot|crawler|spider|crawling|headless|prerender/i.test(navigator.userAgent || '');
  const [loadBelowTheFold, setLoadBelowTheFold] = useState(() => isPrerenderEnv || window.location.hash.length > 1);

  // Defer below-the-fold component loading until first scroll, user gesture, or idle
  useEffect(() => {
    if (loadBelowTheFold) return;

    const enable = () => setLoadBelowTheFold(true);
    window.addEventListener('scroll', enable, { passive: true, once: true });
    window.addEventListener('touchstart', enable, { passive: true, once: true });
    window.addEventListener('pointerdown', enable, { passive: true, once: true });

    let idleId = null;
    let timerId = null;
    if ('requestIdleCallback' in window) {
      idleId = requestIdleCallback(enable, { timeout: 2000 });
    } else {
      timerId = setTimeout(enable, 1500);
    }

    return () => {
      window.removeEventListener('scroll', enable);
      window.removeEventListener('touchstart', enable);
      window.removeEventListener('pointerdown', enable);
      if (idleId && 'cancelIdleCallback' in window) cancelIdleCallback(idleId);
      if (timerId) clearTimeout(timerId);
    };
  }, [loadBelowTheFold]);

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
    if (route !== 'home' || !loadBelowTheFold) return;
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
  }, [route, loadBelowTheFold]);

  const navigateToHome = (e) => {
    if (e) e.preventDefault();
    window.history.pushState(null, '', '/');
    setRoute('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSection = (sectionId, e) => {
    if (e) e.preventDefault();
    setLoadBelowTheFold(true);
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
          {/* Hero & nav stay in the initial bundle — critical for LCP */}
          <Hero />
          {/* Below-the-fold sections are code-split and loaded when visible/idle/interaction */}
          {loadBelowTheFold && (
            <>
              <Suspense fallback={null}>
                <Work onOpenCaseStudy={navigateToCaseStudy} />
              </Suspense>
              <Suspense fallback={null}>
                <About />
              </Suspense>
              <Suspense fallback={null}>
                <Footer />
              </Suspense>
            </>
          )}
        </main>
      )}

      {loadBelowTheFold && (
        <Suspense fallback={null}>
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
        </Suspense>
      )}
    </>
  )
}

export default App

