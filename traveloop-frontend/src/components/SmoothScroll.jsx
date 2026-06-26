/**
 * SmoothScroll.jsx
 * Wraps the app in Lenis smooth-scroll and syncs it with framer-motion's
 * useScroll so all scroll-linked transforms feel perfectly fluid.
 */
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.8,
      infinite: false,
    });

    lenisRef.current = lenis;

    let raf;
    function raf_loop(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(raf_loop);
    }
    raf = requestAnimationFrame(raf_loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return children;
}
