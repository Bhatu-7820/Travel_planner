import { useEffect, useRef, useState } from 'react';

export default function TravelNetworkCanvas() {
  const canvasRef = useRef(null);
  const [isDark, setIsDark] = useState(true);

  // Sync theme
  useEffect(() => {
    const checkTheme = () => {
      const darkClass = document.documentElement.classList.contains('dark');
      setIsDark(darkClass);
    };

    checkTheme();
    // Observe class changes on html tag to react to theme toggles
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let points = [];
    let mouse = { x: null, y: null, active: false };

    // Get true sizes of document
    const getDocMetrics = () => {
      const width = window.innerWidth;
      const height = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        3000
      );
      return { width, height };
    };

    const resize = () => {
      const { width, height } = getDocMetrics();
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      
      // Re-populate if count differs significantly
      const targetCount = Math.min(120, Math.floor((width * height) / 25000));
      if (points.length < targetCount * 0.8 || points.length > targetCount * 1.5) {
        initPoints(width, height, targetCount);
      }
    };

    const initPoints = (width, height, count) => {
      points = [];
      const numPoints = count || 80;
      for (let i = 0; i < numPoints; i++) {
        points.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          size: Math.random() * 2 + 1.2,
          colorType: Math.random() > 0.5 ? 'teal' : 'indigo',
          parallaxFactor: Math.random() * 0.15 + 0.05, // unique parallax rate per point
        });
      }
    };

    // Initialize layout
    const initialMetrics = getDocMetrics();
    initPoints(initialMetrics.width, initialMetrics.height, Math.min(120, Math.floor((initialMetrics.width * initialMetrics.height) / 25000)));
    resize();

    window.addEventListener('resize', resize);

    // Track mouse in document space
    const handleMouseMove = (e) => {
      mouse.x = e.pageX;
      mouse.y = e.pageY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Animation Loop
    const render = () => {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      ctx.clearRect(0, 0, width, height);

      // Viewport boundaries for render-culling optimization
      const scrollY = window.scrollY;
      const viewHeight = window.innerHeight;
      const viewTop = scrollY - 150;
      const viewBottom = scrollY + viewHeight + 150;

      // Color scheme based on dark/light mode
      const tealDotColor = isDark ? 'rgba(20, 184, 166, 0.55)' : 'rgba(13, 148, 136, 0.45)';
      const indigoDotColor = isDark ? 'rgba(99, 102, 241, 0.55)' : 'rgba(79, 70, 229, 0.45)';
      const lineStrokeColor = isDark ? 'rgba(99, 102, 241, 0.25)' : 'rgba(79, 70, 229, 0.18)';
      const activeLineColor = isDark ? 'rgba(20, 184, 166, 0.5)' : 'rgba(13, 148, 136, 0.38)';

      // Update positions
      points.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce/Wrap boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Gentle drag toward mouse
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const force = (180 - dist) / 1500;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }
      });

      // Filter points currently within the scroll view for drawing
      const visiblePoints = points.filter(p => p.y > viewTop && p.y < viewBottom);

      // Draw Connections (Lines)
      ctx.lineWidth = 0.8;
      for (let i = 0; i < visiblePoints.length; i++) {
        const pi = visiblePoints[i];
        
        // Draw lines between points close to each other
        for (let j = i + 1; j < visiblePoints.length; j++) {
          const pj = visiblePoints[j];
          const dx = pi.x - pj.x;
          const dy = pi.y - pj.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const opacity = (110 - dist) / 110;
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y + scrollY * pi.parallaxFactor);
            ctx.lineTo(pj.x, pj.y + scrollY * pj.parallaxFactor);
            ctx.strokeStyle = lineStrokeColor.replace(/[\d.]+\)$/, `${opacity * (isDark ? 0.22 : 0.16)})`);
            ctx.stroke();
          }
        }

        // Draw connections to Mouse
        if (mouse.active) {
          const dx = mouse.x - pi.x;
          // Apply scroll-parallax correction to mouse comparison so pointer tracks correctly in absolute space
          const pyWithParallax = pi.y + scrollY * pi.parallaxFactor;
          const dy = mouse.y - pyWithParallax;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const opacity = (150 - dist) / 150;
            ctx.beginPath();
            ctx.moveTo(pi.x, pyWithParallax);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = activeLineColor.replace(/[\d.]+\)$/, `${opacity * (isDark ? 0.45 : 0.35)})`);
            ctx.stroke();
          }
        }
      }

      // Draw Nodes (Dots)
      visiblePoints.forEach((p) => {
        // Render offset by scroll position & custom parallax factor
        const py = p.y + scrollY * p.parallaxFactor;
        ctx.beginPath();
        ctx.arc(p.x, py, p.size, 0, 2 * Math.PI);
        ctx.fillStyle = p.colorType === 'teal' ? tealDotColor : indigoDotColor;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-80"
    />
  );
}
