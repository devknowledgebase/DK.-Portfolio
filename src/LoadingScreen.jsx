import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import gsap from 'gsap';
import './LoadingScreen.css';

// Set troubleshoot to true to pause the sequence on the centered DK. monogram for inspection/styling
const DEFAULT_TROUBLESHOOT = false;

// Safe layout effect for SSR and React 18/19 compatibility
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function LoadingScreen({ onComplete, troubleshoot = DEFAULT_TROUBLESHOOT }) {
  const [isExited, setIsExited] = useState(false);

  const screenRef = useRef(null);
  const containerRef = useRef(null);
  const wordmarkRef = useRef(null);
  const dWrapRef = useRef(null);
  const kWrapRef = useRef(null);
  const spacerRef = useRef(null);
  const dotRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    // Lock scrolling while the loader is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let isMounted = true;
    let ctx = null;

    const initAnimation = () => {
      if (!isMounted || !containerRef.current || !wordmarkRef.current) return;

      ctx = gsap.context(() => {
        // Collect exiting letters in the EXACT specified order: e -> v -> u -> m -> a -> r
        const exitInnerLetters = [
          containerRef.current.querySelector('.letter-e .loader-letter-inner'),
          containerRef.current.querySelector('.letter-v .loader-letter-inner'),
          containerRef.current.querySelector('.letter-u .loader-letter-inner'),
          containerRef.current.querySelector('.letter-m .loader-letter-inner'),
          containerRef.current.querySelector('.letter-a .loader-letter-inner'),
          containerRef.current.querySelector('.letter-r .loader-letter-inner'),
        ].filter(Boolean);

        // Exit letter wrapper elements that will collapse their width in Phase 3
        const exitWrappers = [
          containerRef.current.querySelector('.letter-e'),
          containerRef.current.querySelector('.letter-v'),
          containerRef.current.querySelector('.letter-u'),
          containerRef.current.querySelector('.letter-m'),
          containerRef.current.querySelector('.letter-a'),
          containerRef.current.querySelector('.letter-r'),
        ].filter(Boolean);

        // Compute dynamic monogram gap based on responsive font size
        const computedStyle = window.getComputedStyle(wordmarkRef.current);
        const fontSize = parseFloat(computedStyle.fontSize) || 48;
        const monoGap = Math.max(2, Math.round(fontSize * 0.045));
        const dotWidth = Math.max(6, Math.round(fontSize * 0.16));
        const dotGap = Math.max(2, Math.round(fontSize * 0.035));

        // Master animation timeline coordinating all 4 phases
        const tl = gsap.timeline();

        // Initial setup for the monogram dot
        gsap.set(dotRef.current, {
          scale: 0,
          opacity: 0,
          transformOrigin: 'center bottom',
        });

        /* ====================================================================
           PHASE 1: Display the Full Name
           - Text "Dev Kumar" is displayed in the exact center of the viewport
           - Brief static hold to establish the initial state
           ==================================================================== */
        tl.to({}, { duration: 0.65 });

        /* ====================================================================
           PHASE 2: Pull Down Individual Letters
           - Letters e, v, u, m, a, and r animate downward one by one in that order
           - Smooth vertical exit masked by overflow-hidden containers
           - D and K stay perfectly static in their original positions
           ==================================================================== */
        tl.to(exitInnerLetters, {
          yPercent: 140,
          opacity: 0,
          duration: 0.52,
          ease: 'power3.in',
          stagger: 0.08,
        });

        // Deliberate micro-pause before D and K begin converging
        tl.to({}, { duration: 0.1 });

        /* ====================================================================
           PHASE 3: Bring Remaining Letters Together (Fully Responsive)
           - Animate the width of exited letters to 0 and collapse the spacer
           - Because wordmark is centered with flexbox, D and K glide smoothly
             into the exact center of the screen
           - 100% responsive: adapts in real-time to any viewport size & resize
           - Reveal ClashGrotesk dot '.' right beside K
           ==================================================================== */
        tl.addLabel('converge');

        // Set explicit starting pixel widths on wrappers so GSAP interpolates smoothly to 0
        tl.call(() => {
          exitWrappers.forEach((el) => {
            if (el) {
              const currentWidth = el.getBoundingClientRect().width;
              gsap.set(el, { width: currentWidth });
            }
          });
        }, null, 'converge');

        // Collapse exit letter wrappers to width 0
        tl.to(exitWrappers, {
          width: 0,
          paddingLeft: 0,
          paddingRight: 0,
          marginLeft: 0,
          marginRight: 0,
          duration: 0.82,
          ease: 'power3.inOut',
        }, 'converge');

        // Collapse spacer from word gap down to compact monogram gap
        tl.to(spacerRef.current, {
          width: monoGap,
          duration: 0.82,
          ease: 'power3.inOut',
        }, 'converge');

        // Reveal the ClashGrotesk dot '.' right as D and K snap together
        tl.to(dotRef.current, {
          scale: 1,
          opacity: 1,
          duration: 0.42,
          ease: 'back.out(2)',
        }, 'converge+=0.38');

        // Apply .is-monogram class for pure CSS responsiveness upon completion
        tl.call(() => {
          if (wordmarkRef.current) {
            wordmarkRef.current.classList.add('is-monogram');
          }
        }, null, 'converge+=0.82');

        // Brief hold on the centered DK. monogram for maximum visual impact
        tl.to({}, { duration: 0.48 });

        // If troubleshoot mode is active, halt timeline here to keep monogram visible
        if (troubleshoot) {
          return;
        }

        /* ====================================================================
           PHASE 4: Pull Up the Loading Screen
           - Entire loading screen slides up with premium easing (power3.inOut)
           - Smoothly reveals the website rendered directly underneath
           - Cleans up and removes loader upon completion
           ==================================================================== */
        tl.to(screenRef.current, {
          yPercent: -100,
          duration: 0.95,
          ease: 'power3.inOut',
          onComplete: () => {
            setIsExited(true);
            document.body.style.overflow = originalOverflow;
            if (onComplete) {
              onComplete();
            }
          },
        });
      }, containerRef);
    };

    // Ensure custom ClashGrotesk font is fully parsed before measuring letter bounding rects
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(initAnimation);
    } else {
      initAnimation();
    }

    return () => {
      isMounted = false;
      if (ctx) ctx.revert();
      document.body.style.overflow = originalOverflow;
    };
  }, [onComplete, troubleshoot]);

  if (isExited) return null;

  return (
    <aside 
      ref={screenRef}
      className="loading-screen"
      aria-label="Loading animation: Dev Kumar"
      role="status"
    >
      <div ref={containerRef} className="loader-stage">
        <h1 ref={wordmarkRef} className="loader-wordmark" aria-label="Dev Kumar">
          {/* First Word: Dev */}
          <span className="loader-word word-dev">
            <span ref={dWrapRef} className="loader-letter-wrap letter-d">
              <span className="loader-letter-inner">D</span>
            </span>
            <span className="loader-letter-wrap letter-e is-exit">
              <span className="loader-letter-inner">e</span>
            </span>
            <span className="loader-letter-wrap letter-v is-exit">
              <span className="loader-letter-inner">v</span>
            </span>
          </span>

          {/* Spacer between Dev and Kumar */}
          <span ref={spacerRef} className="loader-word-spacer" aria-hidden="true" />

          {/* Second Word: Kumar */}
          <span className="loader-word word-kumar">
            <span ref={kWrapRef} className="loader-letter-wrap letter-k">
              <span className="loader-letter-inner">K</span>
              {/* Dot in ClashGrotesk font family that reveals during Phase 3 */}
              <span ref={dotRef} className="loader-monogram-dot" aria-hidden="true">.</span>
            </span>
            <span className="loader-letter-wrap letter-u is-exit">
              <span className="loader-letter-inner">u</span>
            </span>
            <span className="loader-letter-wrap letter-m is-exit">
              <span className="loader-letter-inner">m</span>
            </span>
            <span className="loader-letter-wrap letter-a is-exit">
              <span className="loader-letter-inner">a</span>
            </span>
            <span className="loader-letter-wrap letter-r is-exit">
              <span className="loader-letter-inner">r</span>
            </span>
          </span>
        </h1>
      </div>
    </aside>
  );
}
