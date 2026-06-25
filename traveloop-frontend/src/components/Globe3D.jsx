import { useEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

export default function Globe3D() {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Create root element
    let root = am5.Root.new(chartRef.current);

    // Set themes
    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    // Create the map chart
    let chart = root.container.children.push(am5map.MapChart.new(root, {
      panX: "rotateX",
      panY: "rotateY",
      projection: am5map.geoOrthographic(),
      paddingBottom: 12,
      paddingTop: 12,
      paddingLeft: 12,
      paddingRight: 12,
      wheelY: "none",
      wheelX: "none",
      pinchBehavior: "none",
      maxZoomLevel: 1,
      minZoomLevel: 1
    }));

    // Create series for background fill (Ocean)
    let backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
    backgroundSeries.mapPolygons.template.setAll({
      fill: am5.color(0x1e3a8a), // fallback color
      fillGradient: am5.RadialGradient.new(root, {
        stops: [
          { color: am5.color(0x2b6cb0) }, // bright royal blue center
          { color: am5.color(0x1e3a8a) }, // medium royal blue
          { color: am5.color(0x0f172a) }  // deep midnight blue edge
        ]
      }),
      fillOpacity: 1,
      strokeOpacity: 0
    });
    backgroundSeries.data.push({
      geometry: am5map.getGeoRectangle(90, 180, -90, -180)
    });

    // Create main polygon series for countries (Landmass)
    let polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
      geoJSON: am5geodata_worldLow
    }));

    polygonSeries.mapPolygons.template.setAll({
      fill: am5.color(0x15803d), // fallback green
      fillGradient: am5.LinearGradient.new(root, {
        stops: [
          { color: am5.color(0x22c55e) }, // Earth Green
          { color: am5.color(0x15803d) }  // Forest Green
        ],
        rotation: 90
      }),
      fillOpacity: 0.95,
      stroke: am5.color(0x14532d), // Dark green borders
      strokeWidth: 0.5,
      interactive: true,
      tooltipText: "{name}"
    });

    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color(0x4ade80) // bright light green hover state
    });

    // Create graticule series (grid lines)
    let graticuleSeries = chart.series.push(am5map.GraticuleSeries.new(root, {}));
    graticuleSeries.mapLines.template.setAll({
      strokeOpacity: 0.08,
      stroke: am5.color(0xffffff)
    });

    // Create Map Line Series for travel routes
    let lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
    lineSeries.mapLines.template.setAll({
      stroke: am5.color(0x3b82f6), // Blue line
      strokeWidth: 1.2,
      strokeOpacity: 0.85
    });

    // Add animated flight dots on the lines
    lineSeries.bullets.push(function() {
      var circle = am5.Circle.new(root, {
        radius: 2.2,
        fill: am5.color(0x93c5fd), // Light blue dot
        stroke: am5.color(0x2563eb), // Royal blue border
        strokeWidth: 1
      });
      var bullet = am5.Bullet.new(root, {
        sprite: circle
      });
      bullet.animate({
        key: "position",
        from: 0,
        to: 1,
        duration: 4000 + Math.random() * 3000,
        loops: Infinity
      });
      return bullet;
    });

    // Create point series for destination cities
    let pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));
    pointSeries.bullets.push(function() {
      var container = am5.Container.new(root, {});
      
      container.children.push(am5.Circle.new(root, {
        radius: 3,
        fill: am5.color(0xffffff),
        stroke: am5.color(0x2563eb),
        strokeWidth: 1
      }));
      
      var pulsingCircle = container.children.push(am5.Circle.new(root, {
        radius: 3,
        fill: am5.color(0x60a5fa),
        opacity: 0.6
      }));
      
      pulsingCircle.animate({
        key: "scale",
        from: 1,
        to: 2.5,
        duration: 1850,
        loops: Infinity
      });
      
      pulsingCircle.animate({
        key: "opacity",
        from: 0.6,
        to: 0,
        duration: 1850,
        loops: Infinity
      });
      
      return am5.Bullet.new(root, {
        sprite: container
      });
    });

    // Define destination cities
    const cities = {
      paris: { latitude: 48.8566, longitude: 2.3522 },
      newYork: { latitude: 40.7128, longitude: -74.0060 },
      tokyo: { latitude: 35.6762, longitude: 139.6503 },
      sydney: { latitude: -33.8688, longitude: 151.2093 },
      cairo: { latitude: 30.0444, longitude: 31.2357 },
      mumbai: { latitude: 19.0760, longitude: 72.8777 },
      rio: { latitude: -22.9068, longitude: -43.1729 }
    };

    // Add cities to points
    Object.values(cities).forEach(city => {
      pointSeries.data.push({
        geometry: { type: "Point", coordinates: [city.longitude, city.latitude] }
      });
    });

    // Add connecting blue line routes
    const routesData = [
      { from: cities.newYork, to: cities.paris },
      { from: cities.paris, to: cities.cairo },
      { from: cities.cairo, to: cities.mumbai },
      { from: cities.mumbai, to: cities.tokyo },
      { from: cities.tokyo, to: cities.sydney },
      { from: cities.sydney, to: cities.rio },
      { from: cities.rio, to: cities.newYork }
    ];

    routesData.forEach(route => {
      lineSeries.pushDataItem({
        geometry: {
          type: "LineString",
          coordinates: [
            [route.from.longitude, route.from.latitude],
            [route.to.longitude, route.to.latitude]
          ]
        }
      });
    });

    // Rotate animation
    let rotationAnim = chart.animate({
      key: "rotationX",
      from: 0,
      to: 360,
      duration: 35000,
      loops: Infinity
    });

    // Appear charts
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center relative select-none">
      <div 
        ref={chartRef} 
        className="w-full h-full max-w-full max-h-full"
        style={{ width: "170px", height: "170px" }}
      />
    </div>
  );
}
