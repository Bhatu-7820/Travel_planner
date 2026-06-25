import { useEffect, useRef, useState } from 'react';

function StaticGlobe() {
  return (
    <div className="relative grid h-full w-full place-items-center" aria-label="Travel globe">
      <div className="absolute inset-[10%] rounded-full bg-gradient-to-br from-teal-300 via-blue-500 to-indigo-900 shadow-[inset_-18px_-20px_32px_rgba(15,23,42,0.35),0_14px_34px_-18px_rgba(20,184,166,0.65)]" />
      <div className="absolute inset-[18%] rounded-full border border-white/25" />
      <div className="absolute left-[25%] top-[27%] h-[18%] w-[28%] rounded-full bg-emerald-300/75 blur-[1px]" />
      <div className="absolute right-[24%] top-[42%] h-[16%] w-[24%] rounded-full bg-emerald-300/70 blur-[1px]" />
      <div className="absolute bottom-[27%] left-[38%] h-[13%] w-[20%] rounded-full bg-emerald-300/65 blur-[1px]" />
      <div className="absolute inset-[14%] rounded-full border border-cyan-200/30 animate-[spin_18s_linear_infinite]" />
      <div className="absolute h-2 w-2 rounded-full bg-white shadow-[0_0_16px_rgba(255,255,255,0.8)]" />
    </div>
  );
}

function getGlobeMode() {
  if (typeof window === 'undefined') return 'mobile';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  if (reducedMotion || window.innerWidth < 768) return 'mobile';
  if (coarsePointer || window.innerWidth < 1280) return 'tablet';
  return 'desktop';
}

export default function Globe3D() {
  const chartRef = useRef(null);
  const [mode, setMode] = useState(getGlobeMode);

  useEffect(() => {
    const updateMode = () => setMode(getGlobeMode());
    updateMode();
    window.addEventListener('resize', updateMode, { passive: true });
    return () => window.removeEventListener('resize', updateMode);
  }, []);

  useEffect(() => {
    if (!chartRef.current || mode === 'mobile') return undefined;

    let root;
    let disposed = false;

    async function initGlobe() {
      const [am5, am5map, geodataModule, themeModule] = await Promise.all([
        import('@amcharts/amcharts5'),
        import('@amcharts/amcharts5/map'),
        import('@amcharts/amcharts5-geodata/worldLow'),
        import('@amcharts/amcharts5/themes/Animated'),
      ]);

      if (disposed || !chartRef.current) return;

      const worldLow = geodataModule.default || geodataModule;
      const animatedTheme = themeModule.default || themeModule;
      root = am5.Root.new(chartRef.current);

      if (mode === 'desktop') {
        root.setThemes([animatedTheme.new(root)]);
      }

      const chart = root.container.children.push(am5map.MapChart.new(root, {
        panX: mode === 'desktop' ? 'rotateX' : 'none',
        panY: mode === 'desktop' ? 'rotateY' : 'none',
        projection: am5map.geoOrthographic(),
        paddingBottom: 8,
        paddingTop: 8,
        paddingLeft: 8,
        paddingRight: 8,
        wheelY: 'none',
        wheelX: 'none',
        pinchBehavior: 'none',
        maxZoomLevel: 1,
        minZoomLevel: 1,
      }));

      const backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
      backgroundSeries.mapPolygons.template.setAll({
        fill: am5.color(0x1e3a8a),
        fillGradient: am5.RadialGradient.new(root, {
          stops: [
            { color: am5.color(0x2b6cb0) },
            { color: am5.color(0x1e3a8a) },
            { color: am5.color(0x0f172a) },
          ],
        }),
        fillOpacity: 1,
        strokeOpacity: 0,
      });
      backgroundSeries.data.push({
        geometry: am5map.getGeoRectangle(90, 180, -90, -180),
      });

      const polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
        geoJSON: worldLow,
      }));

      polygonSeries.mapPolygons.template.setAll({
        fill: am5.color(0x15803d),
        fillGradient: am5.LinearGradient.new(root, {
          stops: [
            { color: am5.color(0x22c55e) },
            { color: am5.color(0x15803d) },
          ],
          rotation: 90,
        }),
        fillOpacity: 0.95,
        stroke: am5.color(0x14532d),
        strokeWidth: 0.5,
        interactive: mode === 'desktop',
        tooltipText: mode === 'desktop' ? '{name}' : '',
      });

      if (mode === 'desktop') {
        polygonSeries.mapPolygons.template.states.create('hover', {
          fill: am5.color(0x4ade80),
        });

        const graticuleSeries = chart.series.push(am5map.GraticuleSeries.new(root, {}));
        graticuleSeries.mapLines.template.setAll({
          strokeOpacity: 0.08,
          stroke: am5.color(0xffffff),
        });

        const lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
        lineSeries.mapLines.template.setAll({
          stroke: am5.color(0x3b82f6),
          strokeWidth: 1.2,
          strokeOpacity: 0.85,
        });

        lineSeries.bullets.push(() => {
          const circle = am5.Circle.new(root, {
            radius: 2.2,
            fill: am5.color(0x93c5fd),
            stroke: am5.color(0x2563eb),
            strokeWidth: 1,
          });
          const bullet = am5.Bullet.new(root, { sprite: circle });
          bullet.animate({
            key: 'position',
            from: 0,
            to: 1,
            duration: 5500,
            loops: Infinity,
          });
          return bullet;
        });

        const pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));
        pointSeries.bullets.push(() => {
          const container = am5.Container.new(root, {});
          container.children.push(am5.Circle.new(root, {
            radius: 3,
            fill: am5.color(0xffffff),
            stroke: am5.color(0x2563eb),
            strokeWidth: 1,
          }));
          return am5.Bullet.new(root, { sprite: container });
        });

        const cities = {
          paris: { latitude: 48.8566, longitude: 2.3522 },
          newYork: { latitude: 40.7128, longitude: -74.0060 },
          tokyo: { latitude: 35.6762, longitude: 139.6503 },
          sydney: { latitude: -33.8688, longitude: 151.2093 },
          cairo: { latitude: 30.0444, longitude: 31.2357 },
          mumbai: { latitude: 19.0760, longitude: 72.8777 },
          rio: { latitude: -22.9068, longitude: -43.1729 },
        };

        Object.values(cities).forEach((city) => {
          pointSeries.data.push({
            geometry: { type: 'Point', coordinates: [city.longitude, city.latitude] },
          });
        });

        [
          { from: cities.newYork, to: cities.paris },
          { from: cities.paris, to: cities.cairo },
          { from: cities.cairo, to: cities.mumbai },
          { from: cities.mumbai, to: cities.tokyo },
          { from: cities.tokyo, to: cities.sydney },
          { from: cities.sydney, to: cities.rio },
          { from: cities.rio, to: cities.newYork },
        ].forEach((route) => {
          lineSeries.pushDataItem({
            geometry: {
              type: 'LineString',
              coordinates: [
                [route.from.longitude, route.from.latitude],
                [route.to.longitude, route.to.latitude],
              ],
            },
          });
        });

        chart.animate({
          key: 'rotationX',
          from: 0,
          to: 360,
          duration: 45000,
          loops: Infinity,
        });
      }

      chart.appear(mode === 'desktop' ? 700 : 250, 50);
    }

    initGlobe();

    return () => {
      disposed = true;
      root?.dispose();
    };
  }, [mode]);

  return (
    <div className="relative flex h-full w-full select-none items-center justify-center">
      {mode === 'mobile' ? (
        <StaticGlobe />
      ) : (
        <div
          ref={chartRef}
          className="h-full max-h-full w-full max-w-full"
          style={{ width: mode === 'tablet' ? '150px' : '170px', height: mode === 'tablet' ? '150px' : '170px' }}
        />
      )}
    </div>
  );
}
