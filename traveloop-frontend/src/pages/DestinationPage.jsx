// DestinationPage.jsx
// Immersive digital travel magazine experience inspired by VisitTheUSA.
// Spans 8-11 full-screen scrolls (min-h-screen viewports) with split-screen layouts, parallax elements, and responsive grids.
// Redesigned with dynamic, country-specific premium color themes and authentic video/image resources.

import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FiArrowLeft, FiMapPin, FiCalendar, FiDollarSign, FiGlobe, FiInfo, FiCompass,
  FiChevronRight, FiChevronLeft, FiSun, FiCloudRain, FiClock, FiMaximize2, FiX,
  FiSliders, FiGrid, FiCoffee, FiSend, FiUser, FiPercent, FiCheck,
  FiCheckCircle, FiShield, FiBriefcase, FiInstagram, FiVideo, FiPlay, FiPause,
  FiVolume2, FiVolumeX, FiMap
} from 'react-icons/fi';
import { WORLD_DESTINATIONS } from '@/data/worldDestinations';
import { getCountryDetails } from '@/data/countryDetails';
import { getCountryTheme, getCountryVideoData } from '@/data/countryThemeConfig';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Helper for image URLs
const U = (id, w = 1600, h = 900) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

// Small component to handle silent hover video playback in Reels section
function ReelVideoCard({ reel }) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered]);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="absolute inset-0 w-full h-full"
    >
      <video
        ref={videoRef}
        src={reel.videoUrl}
        loop
        muted
        playsInline
        poster={reel.thumbnail}
        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
      />
    </div>
  );
}

// Interactive Hover Button to support customized theme styling seamlessly on hover
function ThemeHoverButton({ onClick, children, theme }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: isHovered ? theme.accent : '#ffffff',
        color: isHovered ? theme.bg : theme.text,
        borderColor: isHovered ? 'transparent' : theme.border
      }}
      className="rounded-full font-extrabold px-5 py-3 text-[10px] uppercase tracking-widest transition-all shadow-md active:scale-95 border"
    >
      {children}
    </button>
  );
}

export default function DestinationPage() {
  const { countryId } = useParams();
  const navigate = useNavigate();

  // DOM Refs for GSAP
  const heroRef = useRef(null);
  const heroVideoRef = useRef(null);
  const heroContentRef = useRef(null);
  const storiesSectionRef = useRef(null);
  const reelsSectionRef = useRef(null);
  const placesSectionRef = useRef(null);
  const gallerySectionRef = useRef(null);
  const cuisineSectionRef = useRef(null);
  const hotelsSectionRef = useRef(null);
  const conciergeSectionRef = useRef(null);
  const flightsSectionRef = useRef(null);
  
  // Reels scrolling ref
  const reelsCarouselRef = useRef(null);

  // Retrieve details
  const countryData = useMemo(() => getCountryDetails(countryId), [countryId]);
  
  // Retrieve dynamic country colors and media links
  const activeTheme = useMemo(() => getCountryTheme(countryId, countryData.name), [countryId, countryData]);
  const videoData = useMemo(() => getCountryVideoData(countryId, countryData.name), [countryId, countryData]);

  // Continue exploring links
  const otherCountries = useMemo(() => {
    const all = WORLD_DESTINATIONS.filter(
      d => d.country.toLowerCase().replace(/\s+/g, '-') !== countryData.id
    );
    return [...all].sort(() => 0.5 - Math.random()).slice(0, 6);
  }, [countryData]);

  // Section 4: Must Visit Places - Active Attraction Modal State
  const [activeAttraction, setActiveAttraction] = useState(null);

  // Section 5: Gallery Lightbox State
  const [lightboxImage, setLightboxImage] = useState(null);

  // Section 6: Map Active Marker State
  const [activeMarker, setActiveMarker] = useState(countryData.mapMarkers[0] || null);

  // Section 14: Suggested Itinerary Day State
  const [activeItineraryIndex, setActiveItineraryIndex] = useState(1); // Default to 5 Days
  const selectedItinerary = countryData.itineraries[activeItineraryIndex] || countryData.itineraries[0];
  const [selectedItineraryDay, setSelectedItineraryDay] = useState(0);

  // Section 15: Budget Calculator State
  const [calcDays, setCalcDays] = useState(5);
  const [calcTravelers, setCalcTravelers] = useState(2);
  const [calcStyle, setCalcStyle] = useState('mid');

  // Section 17: Local AI Bot Chat State
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: `Welcome to the ${countryData.name} Travel Assistant! Ask me about packing lists, hidden gems, or local visa info.` }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Flight Booking State
  const [flightStep, setFlightStep] = useState('search');
  const [searchFrom, setSearchFrom] = useState('Mumbai (BOM)');
  const [searchDate, setSearchDate] = useState('2026-07-15');
  const [searchClass, setSearchClass] = useState('Economy');
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [insuranceSelected, setInsuranceSelected] = useState(false);
  const [baggageSelected, setBaggageSelected] = useState(false);
  const [mealSelected, setMealSelected] = useState('Standard');
  const [paymentName, setPaymentName] = useState('');
  const [paymentCard, setPaymentCard] = useState('');
  const [bookingCode, setBookingCode] = useState('');

  // active reading section state for the Sub-Nav bar
  const [activeSection, setActiveSection] = useState('overview');

  // Reels active index for scroll tracker
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [activeReel, setActiveReel] = useState(null);
  const [isMuted, setIsMuted] = useState(true);

  // Hero Background Video
  const heroVideoUrl = videoData.heroVideoUrl;
  const reelsData = videoData.reels;

  // VisitTheUSA 50/50 Editorial Splits Dataset
  const stories = useMemo(() => {
    if (countryData.id === 'japan') {
      return [
        {
          category: 'CULTURAL HERITAGE',
          title: 'TEMPLE PATHS & SAMURAI SPIRIT',
          desc: "Discover Kyoto's quiet Zen rock gardens and ancient wooden pagodas standing tall since the feudal shogunate dynasties.",
          buttonText: 'Discover Heritage',
          image: U('1493976040374-85c8e12f0c0e'),
          index: '01/04'
        },
        {
          category: 'WORLD METROPOLIS',
          title: 'TOKYO\'S HYPER-NEON ENERGY',
          desc: 'Dive into a neon-drenched cityscape of high-tech robotics, sprawling train lines, and hidden alley taverns.',
          buttonText: 'See City Life',
          image: U('1540959733332-eab4deabeeaf'),
          index: '02/04'
        },
        {
          category: 'BOUNDLESS ADVENTURES',
          title: 'SACRED PEAKS & MT FUJI',
          desc: 'Witness the majestic Mount Fuji rising above cherry blossom mists and reflecting off glassy lake waters.',
          buttonText: 'Plan Fuji Adventure',
          image: U('1578271887552-5ac3a72752bc'),
          index: '03/04'
        },
        {
          category: 'CULINARY PASSION',
          title: 'THE CRAFT OF PERFECTION',
          desc: 'Indulge in sushi counters, steaming bowls of ramen, and tea ceremonies that elevate dining to a spiritual art.',
          buttonText: 'Explore Gastronomy',
          image: U('1579871494447-9811cf80d66c'),
          index: '04/04'
        }
      ];
    } else if (countryData.id === 'india') {
      return [
        {
          category: 'SPIRITUAL PATHS',
          title: 'GANGA AARTI & SPIRITUAL LIGHTS',
          desc: "Witness Varanasi's steps shift colors from lavender to gold as priests perform fire rituals at sunset.",
          buttonText: 'Explore Varanasi',
          image: U('1561361513-2d89af450548'),
          index: '01/04'
        },
        {
          category: 'WORLD WONDERS',
          title: 'TAJ MAHAL SUNRISE GLOW',
          desc: "Trace the white marble geometry of the world's most iconic monument of love as the morning fog clears.",
          buttonText: 'Agra Tour Guide',
          image: U('1524413840003-0c315883a8f4'),
          index: '02/04'
        },
        {
          category: 'BOUNDLESS ADVENTURES',
          title: 'ALLEPPEY HOUSEBOAT CANALS',
          desc: 'Drift past green coconut groves on hand-crafted wooden kettuvallam houseboats in Kerala backwaters.',
          buttonText: 'Book Canal Cruise',
          image: U('1593693397690-362cb9666fc2'),
          index: '03/04'
        },
        {
          category: 'VIBRANT CELEBRATIONS',
          title: 'HOLI & DIWALI SPECTACLES',
          desc: 'Immerse yourself in sensory explosions of colored dust, illuminated oil lamps, and warm local hospitality.',
          buttonText: 'Explore Festivals',
          image: U('1508009603885-50cf7c579365'),
          index: '04/04'
        }
      ];
    } else if (countryData.id === 'france') {
      return [
        {
          category: 'HISTORIC MONUMENTS',
          title: 'EIFFEL SPARKLE & PARISIAN LIGHTS',
          desc: 'Stand beneath the iconic iron lattice as it bursts into millions of glittering white lights at twilight.',
          buttonText: 'Tour Paris Icons',
          image: U('1502602898657-3e91760cbb34'),
          index: '01/04'
        },
        {
          category: 'BOUNDLESS ADVENTURES',
          title: 'SUMMER ROMANCE IN PROVENCE',
          desc: 'Wander through row after row of fragrant lavender blossoms glowing brilliant purple in the summer sun.',
          buttonText: 'Lavender Trails',
          image: U('1500382017468-9049fed747ef'),
          index: '02/04'
        },
        {
          category: 'GLACIAL HEIGHTS',
          title: 'CHAMONIX VALLEY & SNOW PEAKS',
          desc: 'Take the cable car up to Aiguille du Midi for majestic views of Mont Blanc towering in pristine snow.',
          buttonText: 'Explore Alps',
          image: U('1454496522488-7a8e488e8606'),
          index: '03/04'
        },
        {
          category: 'COASTAL SANCTUARY',
          title: 'GLITZY AZURE RIVIERA LIFE',
          desc: 'Soak up the Mediterranean sun along the pebble beaches and yacht-filled harbours of Nice and Cannes.',
          buttonText: 'Explore Riviera',
          image: U('1512100356956-c1d4734aa6e2'),
          index: '04/04'
        }
      ];
    } else {
      // Fallback generator based on countryData.about
      return [
        {
          category: 'AMERICAN ORIGINALS',
          title: `${countryData.name.toUpperCase()}'S MAJESTIC HISTORY`,
          desc: countryData.about.history,
          buttonText: 'Explore Heritage',
          image: countryData.heroImage,
          index: '01/04'
        },
        {
          category: 'WORLD INSPIRATIONS',
          title: 'THE LOCAL CUSTOMS & SPIRIT',
          desc: countryData.about.culture,
          buttonText: 'Experience Culture',
          image: countryData.gallery[1] || countryData.heroImage,
          index: '02/04'
        },
        {
          category: 'BOUNDLESS ADVENTURES',
          title: 'UNTOUCHED MOUNTAINS & COASTS',
          desc: countryData.about.nature,
          buttonText: 'See Nature Reserves',
          image: countryData.natureShowcase.images[0] || countryData.heroImage,
          index: '03/04'
        },
        {
          category: 'TRAVELLER\'S OBSESSION',
          title: 'WHY WANDERLUST CALLS',
          desc: countryData.about.whyLove,
          buttonText: 'Start Your Journey',
          image: countryData.gallery[2] || countryData.heroImage,
          index: '04/04'
        }
      ];
    }
  }, [countryData]);

  // GSAP Scroll Animations Setup
  useEffect(() => {
    // Make sure we kill any existing ScrollTriggers to avoid duplicates on route changes
    ScrollTrigger.getAll().forEach(t => t.kill());

    // 1. Hero Parallax zoom and fade out
    if (heroVideoRef.current && heroContentRef.current) {
      gsap.to(heroVideoRef.current, {
        scale: 1.05,
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      gsap.to(heroContentRef.current, {
        opacity: 0,
        yPercent: -15,
        scale: 0.95,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom 40%',
          scrub: true
        }
      });
    }

    // 2. Sub-nav stickiness progress tracking
    const sections = ['overview', 'stories', 'reels-section', 'places-visit', 'gallery', 'cuisine', 'hotels', 'concierge', 'flights'];
    sections.forEach(secId => {
      const el = document.getElementById(secId);
      if (el) {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 40%',
          end: 'bottom 40%',
          onEnter: () => setActiveSection(secId),
          onEnterBack: () => setActiveSection(secId)
        });
      }
    });

    // 3. Reveal elements in split-screen stories
    if (storiesSectionRef.current) {
      const storyCards = storiesSectionRef.current.querySelectorAll('.stories > div');
      storyCards.forEach(card => {
        gsap.fromTo(card.querySelector('.lg\\:w-1\\/2:first-child'),
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 75%'
            }
          }
        );
        gsap.fromTo(card.querySelector('.lg\\:w-1\\/2:last-child'),
          { opacity: 0, x: 30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 75%'
            }
          }
        );
      });
    }

    // 4. Reveal places
    if (placesSectionRef.current) {
      const cards = placesSectionRef.current.querySelectorAll('.place-card');
      gsap.fromTo(cards,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: placesSectionRef.current,
            start: 'top 70%'
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [countryData]);

  // Reset states on country change and force premium background theme matching active country
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setActiveAttraction(null);
    setLightboxImage(null);
    setActiveMarker(countryData.mapMarkers[0] || null);
    setSelectedItineraryDay(0);
    setFlightStep('search');
    setSelectedFlight(null);
    setSelectedSeats([]);
    setActiveReelIndex(0);
    setActiveReel(null);
    setIsMuted(true);
    setChatMessages([
      { sender: 'bot', text: `Welcome to the ${countryData.name} Travel Assistant! Ask me about packing lists, hidden gems, or local visa info.` }
    ]);

    // Force global dynamic theme background
    const wasDark = document.documentElement.classList.contains('dark');
    document.documentElement.classList.remove('dark'); // Turn off dark class to activate light-mode colors
    const oldBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = activeTheme.bg;

    return () => {
      if (wasDark) {
        document.documentElement.classList.add('dark');
      }
      document.body.style.backgroundColor = oldBg;
    };
  }, [countryId, countryData, activeTheme]);

  // Daily costs for Calculator
  const calculatedCosts = useMemo(() => {
    const baseDaily = countryData.budgetEstimator[calcStyle] || 5000;
    const hotel = Math.round(baseDaily * 0.45 * calcTravelers);
    const food = Math.round(baseDaily * 0.25 * calcTravelers);
    const transport = Math.round(baseDaily * 0.15 * calcTravelers);
    const shopping = Math.round(baseDaily * 0.15 * calcTravelers);
    const total = (hotel + food + transport + shopping) * calcDays;

    return { hotel, food, transport, shopping, total };
  }, [calcDays, calcTravelers, calcStyle, countryData]);

  // AI bot answer generator
  const handleSendChat = (text) => {
    if (!text.trim()) return;
    const userMsg = { sender: 'user', text };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = `That is a wonderful question about ${countryData.name}! For specific details, our real-time AI planners can compile customizable guides. `;
      const query = text.toLowerCase();
      
      if (query.includes('weather') || query.includes('season') || query.includes('time')) {
        reply = `The best season to visit ${countryData.name} is generally during the ${countryData.facts.bestSeason}. The current average temperature range is ${countryData.facts.weather}.`;
      } else if (query.includes('food') || query.includes('eat') || query.includes('dish')) {
        reply = `You must try local specialties like ${countryData.food.map(f => f.name).join(', ')}. A great spot is ${countryData.food[0]?.bestRestaurant || 'local street markets'}.`;
      } else if (query.includes('tips') || query.includes('custom') || query.includes('etiquette')) {
        reply = `Local Tip: ${countryData.tips.customs} In case of emergencies, dial ${countryData.tips.emergency}.`;
      } else if (query.includes('hotel') || query.includes('stay') || query.includes('luxury')) {
        reply = `Highly recommended luxury stays in ${countryData.name} include ${countryData.hotels.map(h => h.name).join(', ')}. Starting prices are around ${countryData.hotels[0]?.price || '₹15,000'}/night.`;
      } else if (query.includes('itinerary') || query.includes('days') || query.includes('plan')) {
        reply = `Here is a suggested plan: For a quick visit, try our '${countryData.itineraries[0]?.title || 'Discovery Tour'}'. Or plan a deeper ${countryData.itineraries[1]?.days || '5-day'} journey.`;
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      setIsTyping(false);
    }, 1200);
  };

  const mockFlights = useMemo(() => {
    return [
      { id: 'FL01', airline: 'Singapore Airlines', departure: '08:30 AM', arrival: '05:00 PM', duration: '6h 30m', stops: '1 Stop', price: 42500, logo: '✈️' },
      { id: 'FL02', airline: 'Emirates', departure: '11:15 AM', arrival: '08:45 PM', duration: '7h 30m', stops: 'Direct', price: 58900, logo: '🇦🇪' },
      { id: 'FL03', airline: 'Air India', departure: '02:00 PM', arrival: '11:30 PM', duration: '8h 00m', stops: '1 Stop', price: 34000, logo: '🇮🇳' },
      { id: 'FL04', airline: 'Qatar Airways', departure: '09:45 PM', arrival: '06:15 AM', duration: '9h 30m', stops: 'Direct', price: 62000, logo: '🇶🇦' }
    ];
  }, []);

  const handleBookFlight = () => {
    const code = 'TRV-' + Math.floor(100000 + Math.random() * 900000);
    setBookingCode(code);
    setFlightStep('confirmed');
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  // Track scroll position of Reels to update active dot
  const handleReelsScroll = () => {
    if (reelsCarouselRef.current) {
      const { scrollLeft } = reelsCarouselRef.current;
      const index = Math.round(scrollLeft / 304);
      setActiveReelIndex(Math.min(Math.max(index, 0), reelsData.length - 1));
    }
  };

  return (
    <div 
      style={{ backgroundColor: activeTheme.bg, color: activeTheme.text }}
      className="relative min-h-screen travel-premium-magazine overflow-x-hidden font-sans transition-colors duration-500"
    >
      
      {/* Floating vertical sidebar (like the screenshot "Plan Your Trip with AI") */}
      <button 
        onClick={() => scrollToSection('concierge')}
        style={{ 
          backgroundColor: activeTheme.darkBlock, 
          borderColor: `${activeTheme.bg}1a`,
          color: activeTheme.bg
        }}
        className="fixed right-0 top-1/3 -translate-y-1/2 z-40 border-l border-y rounded-l-2xl py-6 px-3.5 flex flex-col items-center gap-4 hover:opacity-90 transition-all shadow-2xl group border-r-0 cursor-pointer backdrop-blur-md"
      >
        <span 
          style={{ backgroundColor: activeTheme.accent }}
          className="h-2 w-2 rounded-full animate-ping absolute top-3" 
        />
        <span 
          style={{ color: activeTheme.bg }}
          className="text-[9px] font-black uppercase tracking-[0.25em] [writing-mode:vertical-rl] select-none group-hover:opacity-80 transition-opacity py-2"
        >
          Plan Your Trip with AI
        </span>
        <div 
          style={{ color: activeTheme.accent }}
          className="flex flex-col gap-2.5 text-xs transition-colors pt-2"
        >
          <FiCompass />
          <FiCalendar />
          <FiCoffee />
        </div>
      </button>

      {/* ==========================================
          SCROLL 1: CINEMATIC HERO (Full screen h-screen with video loop)
          ========================================== */}
      <section 
        ref={heroRef} 
        id="overview"
        className="relative h-screen w-full flex items-center justify-center overflow-hidden border-b"
        style={{ borderColor: activeTheme.border }}
      >
        {/* Fullscreen Looping Video Background */}
        <video 
          ref={heroVideoRef}
          src={heroVideoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-[1.08] brightness-[0.55] pointer-events-none"
        />
        {/* Gradient mask blending to country theme color at bottom */}
        <div 
          style={{ 
            background: `linear-gradient(to top, ${activeTheme.bg} 0%, rgba(15, 23, 42, 0.25) 50%, rgba(15, 23, 42, 0.8) 100%)` 
          }}
          className="absolute inset-0" 
        />

        <div className="relative z-10 w-full h-full flex flex-col justify-between py-8 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
          
          {/* Custom VisitTheUSA Style Navigation Header */}
          <div className="flex justify-between items-center w-full relative z-20 py-4 border-b border-white/10">
            <Link to="/" className="flex flex-col items-start leading-none group text-left">
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-300 group-hover:text-teal-400 transition-colors">VISIT THE</span>
              <span className="text-xl font-black uppercase tracking-tighter text-white group-hover:opacity-90 transition-opacity">{countryData.name}</span>
            </Link>

            <div className="hidden lg:flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-200">
              <button onClick={() => scrollToSection('stories')} className="hover:opacity-80 transition-opacity">Stories</button>
              <button onClick={() => scrollToSection('reels-section')} className="hover:opacity-80 transition-opacity">Videos</button>
              <button onClick={() => scrollToSection('places-visit')} className="hover:opacity-80 transition-opacity">Destinations</button>
              <button onClick={() => scrollToSection('places-visit')} className="hover:opacity-80 transition-opacity">Experiences</button>
              <button onClick={() => scrollToSection('hotels')} className="hover:opacity-80 transition-opacity">Lodgings</button>
              <button onClick={() => scrollToSection('concierge')} className="hover:opacity-80 transition-opacity">AI Planner</button>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => scrollToSection('flights')} 
                style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#ffffff' }}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 border px-4 py-2 text-[9px] font-black uppercase tracking-widest backdrop-blur-md transition-all active:scale-95"
              >
                ✈️ Plan a Trip
              </button>
              <Link 
                to="/" 
                style={{ 
                  backgroundColor: activeTheme.accent, 
                  color: activeTheme.bg 
                }}
                className="rounded-full px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-1 shadow-lg font-bold"
              >
                <FiArrowLeft /> Return Home
              </Link>
            </div>
          </div>

          <div 
            ref={heroContentRef}
            className="grid gap-8 lg:grid-cols-12 items-end w-full pb-8"
          >
            <div className="lg:col-span-8 space-y-6 text-left">
              <div className="space-y-2">
                <span style={{ color: activeTheme.accent }} className="text-[10px] font-bold block tracking-widest uppercase mb-1 flex items-center gap-1.5">
                  ✦ Get travel ideas with AI
                </span>
                <h1 className="text-[3.5rem] sm:text-[6rem] md:text-[7.5rem] lg:text-[8rem] font-black leading-none uppercase tracking-tighter text-white drop-shadow-2xl">
                  {countryData.name} THE BEAUTIFUL
                </h1>
              </div>
              <p 
                style={{ borderColor: activeTheme.accent }}
                className="text-xs sm:text-sm md:text-base italic text-slate-200 max-w-xl font-medium leading-relaxed border-l-2 pl-4"
              >
                "{countryData.quote}"
              </p>
              
              {/* Pill Triggers mimicking the America the Beautiful homepage triggers */}
              <div className="flex flex-wrap gap-2.5 pt-4">
                <ThemeHoverButton onClick={() => scrollToSection('places-visit')} theme={activeTheme}>
                  ✦ See iconic landmarks
                </ThemeHoverButton>
                <ThemeHoverButton onClick={() => scrollToSection('stories')} theme={activeTheme}>
                  ✦ Go beyond the big city
                </ThemeHoverButton>
                <ThemeHoverButton onClick={() => scrollToSection('reels-section')} theme={activeTheme}>
                  ✦ Get road trip ideas
                </ThemeHoverButton>
                <ThemeHoverButton onClick={() => scrollToSection('concierge')} theme={activeTheme}>
                  ✦ Plan with AI assistant
                </ThemeHoverButton>
              </div>
            </div>

            {/* Facts floating box */}
            <div className="lg:col-span-4 bg-slate-950/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 shadow-2xl space-y-4 text-left">
              <h4 style={{ color: activeTheme.accent }} className="text-[9px] font-black uppercase tracking-[0.25em] flex items-center gap-2">
                <FiInfo className="text-xs" /> DIRECTORY DETAILS
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-[10px] leading-relaxed text-slate-200">
                <div>
                  <span className="text-slate-400 block font-bold uppercase tracking-wider">Climate Info</span>
                  <span className="font-semibold block text-slate-100">{countryData.facts.weather}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold uppercase tracking-wider">Currency</span>
                  <span className="font-semibold block text-slate-100">{countryData.facts.currency}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold uppercase tracking-wider">Language</span>
                  <span className="font-semibold block text-slate-100">{countryData.facts.language}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold uppercase tracking-wider">Time Zone</span>
                  <span className="font-semibold block text-slate-100">{countryData.facts.timezone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold uppercase tracking-wider">Visa Rules</span>
                  <span className="font-semibold block text-slate-100">{countryData.facts.visa}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold uppercase tracking-wider">Best Season</span>
                  <span style={{ color: activeTheme.accent }} className="font-semibold block">{countryData.facts.bestSeason}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          STICKY SUB-MENU NAVIGATION
          ========================================== */}
      <div 
        style={{ backgroundColor: `${activeTheme.bg}e6`, borderColor: activeTheme.border }}
        className="sticky top-0 z-40 w-full backdrop-blur-xl border-b hidden md:block transition-colors duration-500"
      >
        <div 
          style={{ color: activeTheme.text }}
          className="safe-container py-3 flex justify-between items-center text-xs max-w-7xl mx-auto px-6"
        >
          <span className="font-black tracking-[0.2em] uppercase flex items-center gap-1.5">
            <span style={{ color: activeTheme.accent }}>{countryData.flag}</span> {countryData.name} EDITIONS
          </span>

          <div className="flex gap-6 font-bold" style={{ color: activeTheme.textSecondary }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'stories', label: 'Stories' },
              { id: 'reels-section', label: 'Videos' },
              { id: 'places-visit', label: 'Landmarks' },
              { id: 'gallery', label: 'Gallery' },
              { id: 'cuisine', label: 'Cuisine' },
              { id: 'hotels', label: 'Lodgings' },
              { id: 'concierge', label: 'AI Planner' },
              { id: 'flights', label: 'Flights' }
            ].map(tab => {
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => scrollToSection(tab.id)}
                  style={{ 
                    color: isActive ? activeTheme.accent : undefined,
                    fontWeight: isActive ? 900 : undefined
                  }}
                  className="transition-all duration-300 relative py-1 hover:opacity-85 uppercase tracking-widest text-[9px]"
                >
                  {tab.label}
                  {isActive && (
                    <motion.span 
                      layoutId="activeSubTab"
                      style={{ backgroundColor: activeTheme.accent }}
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full">
        
        {/* ==========================================
            SCROLLS 2-5: EDITORIAL STORY SLIDES (50/50 splits)
            ========================================== */}
        <section id="stories" ref={storiesSectionRef} className="scroll-mt-24 w-full">
          <div className="max-w-xl text-left pt-16 pb-8 space-y-2 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
            <span style={{ color: activeTheme.accent }} className="text-xs font-black uppercase tracking-[0.25em] font-bold">Featured Chronicles</span>
            <h2 style={{ color: activeTheme.text }} className="text-3xl sm:text-5xl font-black uppercase tracking-tight">Editorial Stories</h2>
            <div style={{ backgroundColor: activeTheme.accent }} className="h-0.5 w-16" />
          </div>

          <div className="stories space-y-0 w-full">
            {stories.map((story, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div 
                  key={idx} 
                  style={{ borderColor: activeTheme.border }}
                  className={`min-h-screen flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} border-b w-full`}
                >
                  {/* Text Panel */}
                  <div 
                    style={{ backgroundColor: activeTheme.darkBlock, color: activeTheme.darkBlockText }}
                    className="lg:w-1/2 px-8 py-16 sm:p-16 lg:p-24 flex flex-col justify-between items-start text-left relative overflow-hidden group w-full transition-colors duration-500"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
                    
                    {/* Category Title */}
                    <div style={{ color: `${activeTheme.darkBlockText}80` }} className="text-[9px] font-black uppercase tracking-[0.3em] opacity-80">
                      {story.category}
                    </div>

                    <div className="space-y-6 my-auto max-w-lg pt-8 pb-12">
                      <h3 
                        style={{ color: activeTheme.darkBlockText }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none group-hover:opacity-90 transition-opacity"
                      >
                        {story.title}
                      </h3>
                      <p style={{ color: `${activeTheme.darkBlockText}cc` }} className="text-xs sm:text-sm leading-relaxed font-medium">
                        {story.desc}
                      </p>
                      <button 
                        onClick={() => scrollToSection('places-visit')}
                        style={{ 
                          borderColor: `${activeTheme.accent}4d`, 
                          backgroundColor: `${activeTheme.accent}0d`, 
                          color: activeTheme.accent 
                        }}
                        className="inline-flex items-center gap-2 rounded-full border font-bold px-6 py-3 text-[9px] uppercase tracking-widest transition-all active:scale-95 hover:opacity-85"
                      >
                        {story.buttonText} <FiChevronRight />
                      </button>
                    </div>

                    {/* Page indicator (like 01/04) */}
                    <div style={{ color: `${activeTheme.darkBlockText}40` }} className="text-lg font-black tracking-widest font-mono">
                      {story.index}
                    </div>
                  </div>

                  {/* Media Panel */}
                  <div className="lg:w-1/2 h-[40vh] lg:h-auto min-h-[350px] relative overflow-hidden group w-full">
                    <img 
                      src={story.image} 
                      alt={story.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-all duration-700" />
                    {/* Tiny watermark */}
                    <div className="absolute bottom-6 right-6 bg-slate-950/70 border border-white/10 rounded-full p-2 text-white/50 backdrop-blur-xl text-[8px] font-mono tracking-widest pointer-events-none uppercase">
                      📍 IMMERSION {idx + 1}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ==========================================
            SCROLL 6: SOCIAL REELS VIDEO CAROUSEL
            ========================================== */}
        <section id="reels-section" ref={reelsSectionRef} className="scroll-mt-24 py-16 text-left max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <div className="max-w-xl space-y-2 mb-12">
            <span style={{ color: activeTheme.accent }} className="text-xs font-black uppercase tracking-[0.25em] font-bold">Social Chronicles</span>
            <h2 style={{ color: activeTheme.text }} className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-sans">Visual Video Reels</h2>
            <p style={{ color: activeTheme.textSecondary }} className="text-xs font-medium">Hover to preview vertical stories from the heart of the country.</p>
            <div style={{ backgroundColor: activeTheme.accent }} className="h-0.5 w-16" />
          </div>

          {/* Carousel container */}
          <div className="relative">
            <div 
              ref={reelsCarouselRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4 touch-scroll-x"
              onScroll={handleReelsScroll}
            >
              {reelsData.map((reel) => {
                return (
                  <div 
                    key={reel.id}
                    onClick={() => setActiveReel(reel)}
                    style={{ borderColor: activeTheme.border, backgroundColor: activeTheme.bgSecondary }}
                    className="snap-start shrink-0 w-72 h-[450px] aspect-[9/16] rounded-[2rem] overflow-hidden border shadow-xl relative cursor-pointer group select-none"
                  >
                    {/* Hover Silent Video Loop Component */}
                    <ReelVideoCard reel={reel} />
                    
                    {/* White Instagram-like Icon overlay top-left */}
                    <div className="absolute top-5 left-5 h-8 w-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white text-sm z-10">
                      <FiInstagram />
                    </div>

                    {/* Views top-right */}
                    <div className="absolute top-5 right-5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-1 text-[8px] font-black text-slate-200 z-10 uppercase tracking-widest">
                      👁️ {reel.views}
                    </div>

                    {/* Gradient & Content Bottom overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none z-10" />
                    
                    <div className="absolute bottom-6 left-6 right-6 space-y-3 z-20 text-left pointer-events-none">
                      <span 
                        style={{ backgroundColor: activeTheme.accent, color: activeTheme.bg }}
                        className="font-black text-[9px] uppercase tracking-wider rounded-full px-2.5 py-0.5"
                      >
                        🎥 Short Reel
                      </span>
                      <h4 className="text-sm font-extrabold text-white leading-snug drop-shadow">
                        {reel.title}
                      </h4>
                      <div className="flex justify-between items-center text-[10px] text-slate-300 font-semibold pt-1">
                        <span className="flex items-center gap-1"><FiClock /> {reel.duration}</span>
                        <span style={{ color: activeTheme.accent }} className="font-extrabold uppercase tracking-widest text-[8px] group-hover:translate-x-1 transition-transform">Watch →</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Scroll Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
              {/* Dot Indicators */}
              <div className="flex gap-2">
                {reelsData.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (reelsCarouselRef.current) {
                        reelsCarouselRef.current.scrollTo({ left: idx * 304, behavior: 'smooth' });
                      }
                    }}
                    style={{
                      backgroundColor: activeReelIndex === idx ? activeTheme.accent : activeTheme.border
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeReelIndex === idx ? 'w-6' : 'w-2 hover:opacity-85'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation Arrows */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (reelsCarouselRef.current) {
                      reelsCarouselRef.current.scrollBy({ left: -304, behavior: 'smooth' });
                    }
                  }}
                  style={{ borderColor: activeTheme.border, backgroundColor: activeTheme.bg, color: activeTheme.text }}
                  className="h-10 w-10 rounded-full border flex items-center justify-center hover:opacity-80 transition-opacity shadow-sm"
                >
                  <FiChevronLeft />
                </button>
                <button
                  onClick={() => {
                    if (reelsCarouselRef.current) {
                      reelsCarouselRef.current.scrollBy({ left: 304, behavior: 'smooth' });
                    }
                  }}
                  style={{ borderColor: activeTheme.border, backgroundColor: activeTheme.bg, color: activeTheme.text }}
                  className="h-10 w-10 rounded-full border flex items-center justify-center hover:opacity-80 transition-opacity shadow-sm"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          </div>

          {/* Reels Lightbox Modal */}
          <AnimatePresence>
            {activeReel && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl"
              >
                <motion.div 
                  initial={{ scale: 0.95, y: 30 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 30 }}
                  className="relative bg-slate-950 border border-white/10 rounded-[2.5rem] w-full max-w-lg p-6 text-center space-y-4 shadow-2xl"
                >
                  <button 
                    onClick={() => {
                      setActiveReel(null);
                      setIsMuted(true);
                    }}
                    className="absolute top-6 right-6 rounded-full bg-white/10 p-2 hover:bg-white/20 transition-all text-white border border-white/10 z-30"
                  >
                    <FiX />
                  </button>

                  <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-slate-900 aspect-[9/16] max-h-[70vh] flex items-center justify-center">
                    <video
                      key={activeReel.id}
                      src={activeReel.videoUrl}
                      autoPlay
                      loop
                      muted={isMuted}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Floating controls in modal */}
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="absolute bottom-5 right-5 h-10 w-10 rounded-full bg-black/60 border border-white/10 text-white flex items-center justify-center z-20 hover:scale-105 transition-all text-base"
                    >
                      {isMuted ? <FiVolumeX /> : <FiVolume2 />}
                    </button>
                  </div>

                  <div className="space-y-1.5 text-left px-2">
                    <span style={{ color: activeTheme.accent }} className="text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                      <FiInstagram /> social reels feed
                    </span>
                    <h3 className="text-base font-black text-white">{activeReel.title}</h3>
                    <p className="text-xs text-slate-400 font-medium">Views: {activeReel.views} · Short Loop</p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ==========================================
            SCROLL 7: CURATED EXPERIENCES & PLACES (Large Visual scale)
            ========================================== */}
        <section id="places-visit" ref={placesSectionRef} className="scroll-mt-24 py-16 text-left max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 space-y-16">
          <div className="space-y-12">
            <div 
              style={{ borderColor: activeTheme.border }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b pb-6"
            >
              <div>
                <span style={{ color: activeTheme.accent }} className="text-xs font-black uppercase tracking-[0.25em] font-bold">Unique Journeys</span>
                <h2 style={{ color: activeTheme.text }} className="text-3xl sm:text-5xl font-black uppercase tracking-tight">Experiences</h2>
              </div>
              <p style={{ color: activeTheme.textSecondary }} className="text-xs max-w-sm font-medium">Breathtaking local activities that define the geographical heart of the country.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {countryData.experiences.map((exp, idx) => (
                <div 
                  key={idx} 
                  style={{ backgroundColor: activeTheme.bg, borderColor: activeTheme.border }}
                  className="exp-card group relative rounded-[2rem] overflow-hidden shadow-xl border flex flex-col justify-between transition-colors duration-500"
                >
                  <div className="h-64 overflow-hidden relative">
                    <img 
                      src={exp.image} 
                      alt={exp.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
                    <span 
                      style={{ backgroundColor: activeTheme.accent, color: activeTheme.bg }}
                      className="absolute bottom-4 left-4 font-black text-[9px] uppercase tracking-wider rounded-full px-3 py-1"
                    >
                      {exp.location}
                    </span>
                  </div>
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2 text-left animate-none">
                      <h3 style={{ color: activeTheme.text }} className="text-base font-extrabold leading-snug group-hover:opacity-85 transition-opacity">{exp.title}</h3>
                      <p style={{ color: activeTheme.textSecondary }} className="text-[11px] leading-relaxed font-medium line-clamp-3">{exp.desc}</p>
                    </div>
                    <div 
                      style={{ borderColor: `${activeTheme.border}80` }}
                      className="border-t pt-4 grid grid-cols-3 gap-2 text-[10px] text-center font-bold"
                    >
                      <div>
                        <span style={{ color: activeTheme.textSecondary }} className="block mb-0.5 uppercase tracking-wider text-[8px] opacity-70">Duration</span>
                        <span style={{ color: activeTheme.text }} className="block font-bold">{exp.duration}</span>
                      </div>
                      <div>
                        <span style={{ color: activeTheme.textSecondary }} className="block mb-0.5 uppercase tracking-wider text-[8px] opacity-70">Est. Cost</span>
                        <span style={{ color: activeTheme.accent }} className="block font-black">{exp.budget}</span>
                      </div>
                      <div>
                        <span style={{ color: activeTheme.textSecondary }} className="block mb-0.5 uppercase tracking-wider text-[8px] opacity-70">Season</span>
                        <span style={{ color: activeTheme.text }} className="block font-bold">{exp.season}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-12 pt-8">
            <div className="max-w-xl space-y-2">
              <span style={{ color: activeTheme.accent }} className="text-xs font-black uppercase tracking-[0.25em] font-bold">Historic Landmarks</span>
              <h2 style={{ color: activeTheme.text }} className="text-3xl sm:text-5xl font-black uppercase tracking-tight">Must Visit Places</h2>
              <div style={{ backgroundColor: activeTheme.accent }} className="h-0.5 w-16" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {countryData.places.map((place, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveAttraction(place)}
                  style={{ borderColor: activeTheme.border, backgroundColor: activeTheme.bg }}
                  className="place-card cursor-pointer group relative rounded-[2rem] overflow-hidden border shadow-xl transition-colors duration-500"
                >
                  <div className="h-72 overflow-hidden relative">
                    <img 
                      src={place.image} 
                      alt={place.name} 
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
                    <div 
                      style={{ backgroundColor: `${activeTheme.darkBlock}b3`, color: activeTheme.accent, borderColor: `${activeTheme.border}33` }}
                      className="absolute top-4 right-4 rounded-full border px-3 py-1 text-[10px] font-black backdrop-blur-xl"
                    >
                      ★ {place.rating}
                    </div>
                    <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end text-left">
                      <div>
                        <span style={{ color: activeTheme.accent }} className="text-[9px] uppercase tracking-[0.15em] font-extrabold block">{place.category}</span>
                        <h3 className="text-lg font-bold text-white mt-0.5">{place.name}</h3>
                      </div>
                      <span className="text-[9px] text-slate-300 font-bold bg-white/5 border border-white/10 rounded-full px-3 py-1 backdrop-blur-xl hover:bg-white/10 transition-all">Details →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Attraction Modal */}
            <AnimatePresence>
              {activeAttraction && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
                >
                  <motion.div 
                    initial={{ scale: 0.95, y: 30 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 30 }}
                    style={{ backgroundColor: activeTheme.bg, borderColor: activeTheme.border, color: activeTheme.text }}
                    className="relative border rounded-[2.5rem] w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 scrollbar-hide text-left transition-colors duration-500"
                  >
                    <button 
                      onClick={() => setActiveAttraction(null)}
                      style={{ backgroundColor: activeTheme.bgSecondary, color: activeTheme.text, borderColor: activeTheme.border }}
                      className="absolute top-6 right-6 rounded-full p-2.5 transition-all border"
                    >
                      <FiX />
                    </button>

                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="md:w-1/2 space-y-4">
                        <img 
                          src={activeAttraction.image} 
                          alt={activeAttraction.name} 
                          className="w-full h-80 object-cover rounded-2xl border shadow-lg"
                          style={{ borderColor: activeTheme.border }}
                        />
                        <div className="grid grid-cols-3 gap-3">
                          {activeAttraction.gallery?.map((img, index) => (
                            <img 
                              key={index} 
                              src={img} 
                              alt="" 
                              className="h-16 w-full object-cover rounded-xl border opacity-80 hover:opacity-100 cursor-pointer transition-opacity"
                              style={{ borderColor: activeTheme.border }}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="md:w-1/2 space-y-5 text-left">
                        <div>
                          <span style={{ color: activeTheme.accent }} className="text-[10px] uppercase font-black tracking-[0.2em] font-bold">{activeAttraction.category}</span>
                          <h2 style={{ color: activeTheme.text }} className="text-3xl font-black uppercase mt-0.5">{activeAttraction.name}</h2>
                          <p className="text-xs mt-1.5 flex items-center gap-2 font-bold" style={{ color: activeTheme.textSecondary }}>
                            <span style={{ color: activeTheme.accent }} className="font-black">★ {activeAttraction.rating}</span> · 
                            <span>{activeAttraction.location}</span> · 
                            <span>{activeAttraction.duration}</span>
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 style={{ color: activeTheme.textSecondary, borderColor: activeTheme.accent }} className="text-xs font-black uppercase tracking-widest border-l pl-2">History & Background</h4>
                          <p style={{ color: activeTheme.textSecondary }} className="text-xs leading-relaxed font-medium">{activeAttraction.history}</p>
                        </div>

                        <div className="space-y-2">
                          <h4 style={{ color: activeTheme.textSecondary, borderColor: activeTheme.accent }} className="text-xs font-black uppercase tracking-widest border-l pl-2">Fast Facts</h4>
                          <ul style={{ color: activeTheme.textSecondary }} className="list-disc list-inside text-xs space-y-1.5 font-medium">
                            {activeAttraction.facts?.map((f, i) => <li key={i}>{f}</li>)}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div style={{ borderColor: activeTheme.border }} className="grid gap-6 md:grid-cols-3 border-t pt-6 text-xs text-left">
                      <div>
                        <h4 style={{ color: activeTheme.accent }} className="font-black mb-3 uppercase tracking-[0.2em] text-[10px]">Stays Nearby</h4>
                        <div className="space-y-2.5 font-medium">
                          {activeAttraction.hotels?.map((h, i) => (
                            <div key={i} style={{ backgroundColor: activeTheme.bgSecondary, borderColor: activeTheme.border }} className="border rounded-xl p-3">
                              <span className="block font-bold" style={{ color: activeTheme.text }}>{h.name}</span>
                              <span className="block text-[10px] mt-0.5" style={{ color: activeTheme.textSecondary }}>{h.type} · {h.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 style={{ color: activeTheme.accent }} className="font-black mb-3 uppercase tracking-[0.2em] text-[10px]">Gourmet dining</h4>
                        <div className="space-y-2.5 font-medium">
                          {activeAttraction.restaurants?.map((r, i) => (
                            <div key={i} style={{ backgroundColor: activeTheme.bgSecondary, borderColor: activeTheme.border }} className="border rounded-xl p-3">
                              <span className="block font-bold" style={{ color: activeTheme.text }}>{r.name}</span>
                              <span className="block text-[10px] mt-0.5" style={{ color: activeTheme.textSecondary }}>{r.style} · ★{r.rating}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 style={{ color: activeTheme.accent }} className="font-black mb-3 uppercase tracking-[0.2em] text-[10px]">Tips</h4>
                        <div style={{ color: activeTheme.textSecondary }} className="space-y-2 font-medium leading-relaxed">
                          {activeAttraction.tips?.map((t, i) => (
                            <p key={i}>• {t}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ==========================================
            SCROLL 8: MASONRY GALLERY & MAP
            ========================================== */}
        <section id="gallery" ref={gallerySectionRef} className="scroll-mt-24 py-16 text-left max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 space-y-12">
          <div className="max-w-xl space-y-2">
            <span style={{ color: activeTheme.accent }} className="text-xs font-black uppercase tracking-[0.25em] font-bold">Captured Moments</span>
            <h2 style={{ color: activeTheme.text }} className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight">Visual Journal</h2>
            <div style={{ backgroundColor: activeTheme.accent }} className="h-0.5 w-16" />
          </div>

          <div className="grid gap-6 lg:grid-cols-12 items-start">
            {/* Gallery Column */}
            <div className="lg:col-span-7 columns-1 sm:columns-2 gap-4 space-y-4">
              {countryData.gallery.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setLightboxImage(img)}
                  style={{ borderColor: activeTheme.border, backgroundColor: activeTheme.bg }}
                  className="cursor-pointer group relative overflow-hidden rounded-3xl border break-inside-avoid shadow-lg transition-colors duration-500"
                >
                  <img 
                    src={img} 
                    alt="" 
                    loading="lazy"
                    className="w-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <FiMaximize2 className="text-white text-2xl" />
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Map Column */}
            <div 
              style={{ backgroundColor: activeTheme.bg, borderColor: activeTheme.border }}
              className="lg:col-span-5 border rounded-[2.5rem] p-6 shadow-xl space-y-6 transition-colors duration-500"
            >
              <div 
                style={{ backgroundColor: activeTheme.darkBlock, borderColor: `${activeTheme.border}22` }}
                className="relative rounded-2xl h-[340px] border overflow-hidden flex items-center justify-center transition-colors duration-500"
              >
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]" />
                
                {countryData.mapMarkers.map((marker, idx) => {
                  const top = 25 + (idx * 16) % 60;
                  const left = 20 + (idx * 22) % 65;
                  const isActive = activeMarker?.name === marker.name;

                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveMarker(marker)}
                      style={{ 
                        top: `${top}%`, 
                        left: `${left}%`,
                        backgroundColor: isActive ? activeTheme.accent : activeTheme.darkBlock,
                        color: isActive ? activeTheme.bg : activeTheme.accent,
                        borderColor: `${activeTheme.accent}4d`
                      }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-full transition-all duration-300 ${
                        isActive 
                          ? 'scale-125 z-20 shadow-xl' 
                          : 'border hover:scale-[1.15] z-10'
                      }`}
                    >
                      <FiMapPin className="text-xs" />
                    </button>
                  );
                })}
              </div>

              {activeMarker && (
                <div className="space-y-3 text-left">
                  <span 
                    style={{ backgroundColor: `${activeTheme.accent}1a`, borderColor: `${activeTheme.accent}33`, color: activeTheme.accent }}
                    className="border font-extrabold text-[9px] uppercase tracking-wider rounded-full px-2.5 py-0.5 inline-block"
                  >
                    {activeMarker.type}
                  </span>
                  <h3 style={{ color: activeTheme.text }} className="text-xl font-black">{activeMarker.name}</h3>
                  <p style={{ color: activeTheme.textSecondary }} className="text-xs leading-relaxed font-medium">{activeMarker.desc}</p>
                </div>
              )}
            </div>
          </div>

          {/* Lightbox Modal */}
          <AnimatePresence>
            {lightboxImage && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setLightboxImage(null)}
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-4 backdrop-blur-md"
              >
                <button className="absolute top-6 right-6 text-white text-2xl hover:text-teal-400 transition-colors border border-white/10 bg-white/5 p-2 rounded-full">
                  <FiX />
                </button>
                <img 
                  src={lightboxImage} 
                  alt="" 
                  className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-white/10 shadow-2xl"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ==========================================
            SCROLL 9: CUISINE & FESTIVALS
            ========================================== */}
        <section id="cuisine" ref={cuisineSectionRef} className="scroll-mt-24 py-16 text-left max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 space-y-24">
          <div className="space-y-12">
            <div 
              style={{ borderColor: activeTheme.border }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b pb-6"
            >
              <div>
                <span style={{ color: activeTheme.accent }} className="text-xs font-black uppercase tracking-[0.25em] font-bold">Culinary Scene</span>
                <h2 style={{ color: activeTheme.text }} className="text-3xl sm:text-5xl font-black uppercase tracking-tight">Traditional Dining</h2>
              </div>
              <p style={{ color: activeTheme.textSecondary }} className="text-xs max-w-sm font-medium">From fine dining rooms to smoky street alleys, these local dishes are the culinary heart of the country.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {countryData.food.map((dish, idx) => (
                <div 
                  key={idx} 
                  style={{ backgroundColor: activeTheme.bg, borderColor: activeTheme.border }}
                  className="border rounded-[2rem] overflow-hidden flex flex-col justify-between transition-colors duration-500 shadow-lg"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img src={dish.image} alt={dish.name} loading="lazy" className="w-full h-full object-cover" />
                    <span 
                      style={{ backgroundColor: `${activeTheme.darkBlock}cc`, color: activeTheme.accent, borderColor: `${activeTheme.border}33` }}
                      className="absolute top-4 left-4 border text-[9px] font-bold rounded px-2.5 py-0.5 uppercase tracking-wider"
                    >
                      {dish.type}
                    </span>
                  </div>
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between text-left">
                    <div className="space-y-1.5">
                      <h3 style={{ color: activeTheme.text }} className="text-base font-extrabold">{dish.name}</h3>
                      <p style={{ color: activeTheme.textSecondary }} className="text-[11px] leading-relaxed font-medium line-clamp-3">{dish.desc}</p>
                    </div>
                    <div style={{ borderColor: `${activeTheme.border}80` }} className="border-t pt-3 text-[10px]">
                      <span style={{ color: activeTheme.textSecondary }} className="block uppercase tracking-widest font-black text-[8px] mb-0.5 opacity-70">Top Spot</span>
                      <span style={{ color: activeTheme.accent }} className="font-semibold">{dish.bestRestaurant}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-12">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span style={{ color: activeTheme.accent }} className="text-xs font-black uppercase tracking-[0.25em] font-bold">Cultural Timeline</span>
              <h2 style={{ color: activeTheme.text }} className="text-3xl sm:text-5xl font-black uppercase tracking-tight">Major Festivals</h2>
              <div style={{ backgroundColor: activeTheme.accent }} className="h-0.5 w-16 mx-auto" />
            </div>

            <div className="max-w-3xl mx-auto relative border-l pl-6 sm:pl-8 space-y-10 py-4" style={{ borderColor: activeTheme.border }}>
              {countryData.festivals.map((fest, idx) => (
                <div key={idx} className="relative space-y-4">
                  <div 
                    style={{ backgroundColor: activeTheme.accent, borderColor: activeTheme.bg }}
                    className="absolute -left-[31px] sm:-left-[39px] top-1.5 h-4 w-4 rounded-full border-4" 
                  />
                  
                  <div 
                    style={{ backgroundColor: activeTheme.bg, borderColor: activeTheme.border }}
                    className="flex flex-col sm:flex-row gap-6 border rounded-[2rem] p-6 shadow-xl text-left transition-colors duration-500"
                  >
                    <img 
                      src={fest.image} 
                      alt={fest.name} 
                      loading="lazy"
                      className="h-32 w-full sm:w-48 object-cover rounded-2xl border shrink-0 shadow-lg"
                      style={{ borderColor: activeTheme.border }}
                    />
                    <div className="space-y-3 text-left">
                      <span style={{ color: activeTheme.accent }} className="text-[8px] font-black uppercase tracking-[0.2em] block font-bold">{fest.date}</span>
                      <h3 style={{ color: activeTheme.text }} className="text-xl font-bold">{fest.name}</h3>
                      <p style={{ color: activeTheme.textSecondary }} className="text-xs leading-relaxed font-medium">{fest.desc}</p>
                      <p 
                        style={{ backgroundColor: activeTheme.bgSecondary, borderColor: activeTheme.border, color: activeTheme.text }}
                        className="text-[10px] font-semibold border rounded-xl px-3 py-2 inline-block"
                      >
                        📢 <b>Travel Tip:</b> {fest.travelAdvice}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================
            SCROLL 10: HOTELS & TRANSIT
            ========================================== */}
        <section id="hotels" ref={hotelsSectionRef} className="scroll-mt-24 py-16 text-left max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 space-y-24">
          <div className="space-y-12">
            <div className="max-w-xl space-y-2">
              <span style={{ color: activeTheme.accent }} className="text-xs font-black uppercase tracking-[0.25em] font-bold">Accommodations</span>
              <h2 style={{ color: activeTheme.text }} className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight">Luxury Stays</h2>
              <div style={{ backgroundColor: activeTheme.accent }} className="h-0.5 w-16" />
            </div>

            <div className="grid gap-8 md:grid-cols-2 text-left">
              {countryData.hotels.map((hotel, idx) => (
                <div 
                  key={idx} 
                  style={{ backgroundColor: activeTheme.bg, borderColor: activeTheme.border }}
                  className="border rounded-[2rem] overflow-hidden flex flex-col sm:flex-row shadow-xl transition-colors duration-500"
                >
                  <img 
                    src={hotel.image} 
                    alt={hotel.name} 
                    loading="lazy"
                    className="w-full sm:w-52 h-52 sm:h-auto object-cover shrink-0"
                  />
                  <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-start gap-2">
                        <h3 style={{ color: activeTheme.text }} className="text-lg font-bold">{hotel.name}</h3>
                        <span style={{ color: activeTheme.accent }} className="text-xs font-bold shrink-0">★ {hotel.rating}</span>
                      </div>
                      <p style={{ color: activeTheme.textSecondary }} className="text-xs flex items-center gap-1.5"><FiMapPin size={11} /> {hotel.location}</p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {hotel.amenities.map((am, i) => (
                        <span 
                          key={i} 
                          style={{ backgroundColor: activeTheme.bgSecondary, borderColor: activeTheme.border, color: activeTheme.textSecondary }}
                          className="border text-[9px] font-bold px-2.5 py-1 rounded-full"
                        >
                          {am}
                        </span>
                      ))}
                    </div>

                    <div style={{ borderColor: `${activeTheme.border}80` }} className="flex justify-between items-center border-t pt-4">
                      <div>
                        <span style={{ color: activeTheme.textSecondary }} className="text-[8px] uppercase tracking-widest block font-bold">Rates From</span>
                        <span style={{ color: activeTheme.accent }} className="text-base font-black">{hotel.price}<span style={{ color: activeTheme.textSecondary }} className="text-[10px] font-medium">/night</span></span>
                      </div>
                      <button 
                        onClick={() => {
                          scrollToSection('flights');
                          setFlightStep('search');
                        }}
                        style={{ backgroundColor: activeTheme.bgSecondary, color: activeTheme.text, borderColor: activeTheme.border }}
                        className="hover:opacity-85 border rounded-full px-5 py-2.5 text-xs font-bold transition-all"
                      >
                        Book Trip
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-12">
            <div className="max-w-xl space-y-2">
              <span style={{ color: activeTheme.accent }} className="text-xs font-black uppercase tracking-[0.25em] font-bold">Transit Guide</span>
              <h2 style={{ color: activeTheme.text }} className="text-3xl sm:text-5xl font-black uppercase tracking-tight">Local Transportation</h2>
              <div style={{ backgroundColor: activeTheme.accent }} className="h-0.5 w-16" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-left">
              {[
                { title: 'Airports & Flight Routes', desc: countryData.transport.flights, icon: '✈️' },
                { title: 'Subways & Urban Transit', desc: countryData.transport.metro, icon: '🚇' },
                { title: 'Taxis & Ride Sharing', desc: countryData.transport.taxi, icon: '🚖' },
                { title: 'Inter-City High Speed Rail', desc: countryData.transport.train, icon: '🚄' },
                { title: 'Self Drive Car Rentals', desc: countryData.transport.rental, icon: '🚗' },
                { title: 'Airport Shuttle Links', desc: countryData.transport.airportInfo, icon: '🏢' }
              ].map((trans, idx) => (
                <div 
                  key={idx} 
                  style={{ backgroundColor: activeTheme.bg, borderColor: activeTheme.border }}
                  className="border rounded-[2rem] p-6 hover:border-opacity-50 transition-all duration-300 space-y-3 shadow-md"
                >
                  <div 
                    style={{ backgroundColor: activeTheme.bgSecondary, borderColor: activeTheme.border }}
                    className="h-10 w-10 rounded-2xl border flex items-center justify-center text-xl shadow-sm"
                  >
                    {trans.icon}
                  </div>
                  <h4 style={{ color: activeTheme.text }} className="text-sm font-bold">{trans.title}</h4>
                  <p style={{ color: activeTheme.textSecondary }} className="text-xs leading-relaxed font-medium">{trans.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================
            SCROLL 11: INTERACTIVE CONCIERGE (Budget, Itinerary, AI chatbot)
            ========================================== */}
        <section id="concierge" ref={conciergeSectionRef} className="scroll-mt-24 py-16 text-left max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 space-y-24">
          {/* Itinerary planner */}
          <div className="space-y-12">
            <div 
              style={{ borderColor: activeTheme.border }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b pb-6"
            >
              <div>
                <span style={{ color: activeTheme.accent }} className="text-xs font-black uppercase tracking-[0.25em] font-bold">Visual Schedules</span>
                <h2 style={{ color: activeTheme.text }} className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-sans">Suggested Itinerary</h2>
              </div>
              
              <div 
                style={{ backgroundColor: activeTheme.bgSecondary, borderColor: activeTheme.border }}
                className="flex border rounded-full p-1 text-xs shrink-0 shadow-sm"
              >
                {countryData.itineraries.map((it, i) => {
                  const isSelected = activeItineraryIndex === i;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveItineraryIndex(i);
                        setSelectedItineraryDay(0);
                      }}
                      style={{ 
                        backgroundColor: isSelected ? activeTheme.accent : 'transparent',
                        color: isSelected ? activeTheme.bg : activeTheme.textSecondary
                      }}
                      className="rounded-full px-4 py-1.5 font-bold uppercase text-[9px] tracking-wider hover:opacity-90 transition-opacity font-extrabold"
                    >
                      {it.days}
                    </button>
                  );
                })}
              </div>
            </div>

            <div 
              style={{ backgroundColor: activeTheme.bg, borderColor: activeTheme.border }}
              className="grid gap-6 md:grid-cols-12 border rounded-[2.5rem] p-6 sm:p-8 shadow-xl transition-colors duration-500"
            >
              <div className="md:col-span-4 space-y-2 max-h-80 overflow-y-auto pr-2 scrollbar-hide text-left">
                {selectedItinerary.stops.map((stop, i) => {
                  const isSelected = selectedItineraryDay === i;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedItineraryDay(i)}
                      style={{
                        backgroundColor: isSelected ? `${activeTheme.accent}1a` : activeTheme.bgSecondary,
                        borderColor: isSelected ? `${activeTheme.accent}4d` : 'transparent',
                        color: activeTheme.text
                      }}
                      className="w-full text-left p-4 rounded-2xl border transition-all flex justify-between items-center"
                    >
                      <div className="min-w-0 text-left">
                        <span style={{ color: activeTheme.accent }} className="text-[10px] uppercase tracking-widest font-extrabold block">{stop.day}</span>
                        <span className="text-xs truncate block mt-0.5">{stop.title}</span>
                      </div>
                      <FiChevronRight className="shrink-0 text-slate-400" />
                    </button>
                  );
                })}
              </div>

              <div 
                style={{ backgroundColor: `${activeTheme.bgSecondary}80`, borderColor: activeTheme.border }}
                className="md:col-span-8 border rounded-2xl p-6 flex flex-col justify-between space-y-6 text-left transition-colors duration-500"
              >
                {selectedItinerary.stops[selectedItineraryDay] ? (
                  <div className="space-y-4">
                    <span style={{ color: activeTheme.accent }} className="text-xs font-black uppercase tracking-[0.2em] block text-left">
                      {selectedItinerary.stops[selectedItineraryDay].day} Detail Plan
                    </span>
                    <h3 style={{ color: activeTheme.text }} className="text-2xl font-black font-sans">{selectedItinerary.stops[selectedItineraryDay].title}</h3>
                    <p style={{ color: activeTheme.textSecondary }} className="text-xs leading-relaxed font-medium">
                      {selectedItinerary.stops[selectedItineraryDay].desc}
                    </p>
                  </div>
                ) : (
                  <p style={{ color: activeTheme.textSecondary }} className="text-xs italic">Select a day stop on the left tab panel.</p>
                )}

                <div 
                  style={{ borderColor: activeTheme.border }}
                  className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-end border-t pt-4 text-xs"
                >
                  <div className="text-left">
                    <span style={{ color: activeTheme.textSecondary }} className="text-[8px] uppercase tracking-widest block font-bold">Trip Style Focus</span>
                    <span style={{ color: activeTheme.text }} className="font-bold">{selectedItinerary.title}</span>
                  </div>
                  <button 
                    onClick={() => navigate('/create-trip')}
                    style={{ backgroundColor: activeTheme.accent, color: activeTheme.bg }}
                    className="px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-colors shadow-md active:scale-95 text-[10px] uppercase tracking-wider font-extrabold"
                  >
                    Clone to Planner
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Budget planner */}
          <div 
            style={{ backgroundColor: activeTheme.bg, borderColor: activeTheme.border }}
            className="grid gap-8 md:grid-cols-12 border rounded-[2.5rem] p-6 sm:p-8 shadow-xl transition-colors duration-500"
          >
            <div className="md:col-span-6 space-y-6 text-left">
              <h3 style={{ color: activeTheme.textSecondary }} className="text-xs font-bold uppercase tracking-widest">Set Travel Details</h3>
              
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span style={{ color: activeTheme.textSecondary }}>Total Days</span>
                  <span style={{ color: activeTheme.accent }} className="font-extrabold">{calcDays} Days</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="30" 
                  value={calcDays} 
                  onChange={e => setCalcDays(Number(e.target.value))}
                  style={{ accentColor: activeTheme.accent }}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span style={{ color: activeTheme.textSecondary }}>Travelers</span>
                  <span style={{ color: activeTheme.accent }} className="font-extrabold">{calcTravelers} Persons</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={calcTravelers} 
                  onChange={e => setCalcTravelers(Number(e.target.value))}
                  style={{ accentColor: activeTheme.accent }}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-2.5">
                <span style={{ color: activeTheme.textSecondary }} className="text-xs font-bold block">Travel Style Tier</span>
                <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                  {['budget', 'mid', 'luxury'].map(style => {
                    const isSelected = calcStyle === style;
                    return (
                      <button
                        key={style}
                        onClick={() => setCalcStyle(style)}
                        style={{
                          backgroundColor: isSelected ? activeTheme.accent : activeTheme.bgSecondary,
                          color: isSelected ? activeTheme.bg : activeTheme.textSecondary,
                          borderColor: isSelected ? 'transparent' : activeTheme.border
                        }}
                        className="rounded-xl py-3 border capitalize transition-all font-black shadow-md hover:opacity-90"
                      >
                        {style}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div 
              style={{ backgroundColor: `${activeTheme.bgSecondary}80`, borderColor: activeTheme.border }}
              className="md:col-span-6 border rounded-2xl p-6 flex flex-col justify-between space-y-6 text-left transition-colors duration-500"
            >
              <h3 style={{ color: activeTheme.textSecondary }} className="text-xs font-bold uppercase tracking-widest">Estimated Expense Breakdown</h3>
              <div className="space-y-2 text-xs font-semibold">
                <div className="flex justify-between" style={{ color: activeTheme.textSecondary }}>
                  <span>🏨 Luxury Lodgings / night</span>
                  <span style={{ color: activeTheme.text }}>₹{calculatedCosts.hotel.toLocaleString()}</span>
                </div>
                <div className="flex justify-between" style={{ color: activeTheme.textSecondary }}>
                  <span>🍲 Gastronomy & Dining / night</span>
                  <span style={{ color: activeTheme.text }}>₹{calculatedCosts.food.toLocaleString()}</span>
                </div>
                <div className="flex justify-between" style={{ color: activeTheme.textSecondary }}>
                  <span>🚇 Local Transportation / night</span>
                  <span style={{ color: activeTheme.text }}>₹{calculatedCosts.transport.toLocaleString()}</span>
                </div>
                <div className="flex justify-between" style={{ color: activeTheme.textSecondary }}>
                  <span>🛍️ Activities & Souvenirs / night</span>
                  <span style={{ color: activeTheme.text }}>₹{calculatedCosts.shopping.toLocaleString()}</span>
                </div>
                <div style={{ borderColor: activeTheme.border }} className="border-t pt-3 flex justify-between text-sm">
                  <span className="font-bold" style={{ color: activeTheme.textSecondary }}>Daily Average Est.</span>
                  <span className="font-extrabold" style={{ color: activeTheme.text }}>₹{(calculatedCosts.hotel + calculatedCosts.food + calculatedCosts.transport + calculatedCosts.shopping).toLocaleString()}</span>
                </div>
              </div>

              <div style={{ borderColor: activeTheme.border }} className="border-t pt-4 flex justify-between items-center">
                <div className="text-left">
                  <span style={{ color: activeTheme.textSecondary }} className="text-[8px] uppercase tracking-widest block font-bold">Total Estimated Budget</span>
                  <span style={{ color: activeTheme.accent }} className="text-xl font-black">₹{calculatedCosts.total.toLocaleString()}</span>
                </div>
                <button 
                  onClick={() => navigate('/create-trip')}
                  style={{ backgroundColor: activeTheme.accent, color: activeTheme.bg }}
                  className="px-6 py-3 rounded-xl text-[10px] font-bold transition-all shadow-lg active:scale-95 uppercase tracking-wider font-extrabold hover:opacity-90"
                >
                  Create Plan
                </button>
              </div>
            </div>
          </div>

          {/* AI Travel Assistant Chat Box */}
          <div 
            style={{ backgroundColor: activeTheme.bg, borderColor: activeTheme.border }}
            className="grid gap-8 md:grid-cols-12 border rounded-[2.5rem] p-6 sm:p-8 shadow-xl transition-colors duration-500"
          >
            <div className="md:col-span-4 space-y-4 text-left">
              <h3 style={{ color: activeTheme.textSecondary }} className="text-xs font-black uppercase tracking-widest">Quick Prompts</h3>
              <p style={{ color: activeTheme.textSecondary }} className="text-xs font-medium">Click any preset query to test the assistant’s local knowledge:</p>
              
              <div className="flex flex-col gap-2 pt-2">
                {countryData.aiQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendChat(q)}
                    style={{ backgroundColor: activeTheme.bgSecondary, borderColor: activeTheme.border, color: activeTheme.text }}
                    className="w-full text-left p-3.5 rounded-2xl border text-[10px] font-bold transition-all hover:opacity-85"
                  >
                    💬 {q}
                  </button>
                ))}
              </div>
            </div>

            <div 
              style={{ backgroundColor: `${activeTheme.bgSecondary}80`, borderColor: activeTheme.border }}
              className="md:col-span-8 border rounded-[2rem] p-5 h-[360px] flex flex-col justify-between shadow-inner transition-colors duration-500"
            >
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-hide pb-3">
                {chatMessages.map((msg, i) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div 
                        style={{
                          background: isUser 
                            ? `linear-gradient(to right, ${activeTheme.accent}, ${activeTheme.accent}dd)` 
                            : activeTheme.bg,
                          color: isUser ? activeTheme.bg : activeTheme.text,
                          borderColor: isUser ? 'transparent' : activeTheme.border
                        }}
                        className={`max-w-[80%] rounded-[1.25rem] px-4 py-2.5 text-xs shadow-md border ${
                          isUser 
                            ? 'font-extrabold rounded-tr-none text-left' 
                            : 'rounded-tl-none leading-relaxed text-left'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                {isTyping && (
                  <div className="flex justify-start">
                    <div 
                      style={{ backgroundColor: activeTheme.bg, borderColor: activeTheme.border }}
                      className="border rounded-[1.25rem] rounded-tl-none px-4 py-2.5 text-xs text-slate-400 flex gap-1.5"
                    >
                      <span style={{ backgroundColor: activeTheme.accent }} className="w-1.5 h-1.5 rounded-full animate-bounce"></span>
                      <span style={{ backgroundColor: activeTheme.accent }} className="w-1.5 h-1.5 rounded-full animate-bounce delay-75"></span>
                      <span style={{ backgroundColor: activeTheme.accent }} className="w-1.5 h-1.5 rounded-full animate-bounce delay-150"></span>
                    </div>
                  </div>
                )}
              </div>

              <form 
                onSubmit={e => {
                  e.preventDefault();
                  handleSendChat(chatInput);
                }}
                style={{ borderColor: activeTheme.border }}
                className="border-t pt-4 flex gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Ask about visas, local etiquette, transit safety..."
                  style={{ backgroundColor: activeTheme.bg, borderColor: activeTheme.border, color: activeTheme.text }}
                  className="min-w-0 flex-1 rounded-xl border px-4 py-3 text-xs outline-none focus:opacity-95 placeholder-slate-400 transition shadow-inner"
                />
                <button 
                  type="submit" 
                  style={{ backgroundColor: activeTheme.accent, color: activeTheme.bg }}
                  className="grid h-11 w-11 place-items-center rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all text-sm shrink-0"
                >
                  <FiSend />
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ==========================================
            SCROLL 12: FLIGHT CONCIERGE & EXPLORE MORE
            ========================================== */}
        <section id="flights" ref={flightsSectionRef} className="scroll-mt-24 py-16 text-left max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 space-y-24">
          <div 
            style={{ backgroundColor: activeTheme.bg, borderColor: activeTheme.border }}
            className="border rounded-[2.5rem] p-6 sm:p-10 shadow-xl relative overflow-hidden transition-colors duration-500"
          >
            <div 
              style={{ backgroundColor: `${activeTheme.accent}0a` }}
              className="absolute -top-40 -left-40 h-[300px] w-[300px] rounded-full blur-[120px]" 
            />
            
            <AnimatePresence mode="wait">
              {/* Step 1: Search Form */}
              {flightStep === 'search' && (
                <motion.div 
                  key="search"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div style={{ color: activeTheme.accent }} className="flex items-center gap-2 text-left font-bold">
                    <FiCompass />
                    <span className="text-xs font-black uppercase tracking-[0.20em]">Compare & Search Luxury Airfares</span>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-4 text-left">
                    <div className="space-y-2">
                      <span style={{ color: activeTheme.textSecondary }} className="text-[8px] uppercase tracking-widest font-black block">Origin</span>
                      <input 
                        type="text" 
                        value={searchFrom} 
                        onChange={e => setSearchFrom(e.target.value)}
                        style={{ backgroundColor: activeTheme.bgSecondary, borderColor: activeTheme.border, color: activeTheme.text }}
                        className="w-full rounded-xl border p-3 text-xs outline-none focus:opacity-90" 
                      />
                    </div>
                    <div className="space-y-2">
                      <span style={{ color: activeTheme.textSecondary }} className="text-[8px] uppercase tracking-widest font-black block">Destination</span>
                      <input 
                        type="text" 
                        value={`${countryData.name} Int Airport (INT)`} 
                        disabled
                        style={{ backgroundColor: activeTheme.bgSecondary, borderColor: activeTheme.border }}
                        className="w-full rounded-xl border p-3 text-xs text-slate-400 outline-none cursor-not-allowed" 
                      />
                    </div>
                    <div className="space-y-2">
                      <span style={{ color: activeTheme.textSecondary }} className="text-[8px] uppercase tracking-widest font-black block">Departure Date</span>
                      <input 
                        type="date" 
                        value={searchDate} 
                        onChange={e => setSearchDate(e.target.value)}
                        style={{ backgroundColor: activeTheme.bgSecondary, borderColor: activeTheme.border, color: activeTheme.text }}
                        className="w-full rounded-xl border p-3 text-xs outline-none focus:opacity-90" 
                      />
                    </div>
                    <div className="space-y-2">
                      <span style={{ color: activeTheme.textSecondary }} className="text-[8px] uppercase tracking-widest font-black block">Class Preference</span>
                      <select
                        value={searchClass}
                        onChange={e => setSearchClass(e.target.value)}
                        style={{ backgroundColor: activeTheme.bgSecondary, borderColor: activeTheme.border, color: activeTheme.text }}
                        className="w-full rounded-xl border p-3 text-xs outline-none cursor-pointer"
                      >
                        <option>Economy</option>
                        <option>Premium Economy</option>
                        <option>Business Class</option>
                        <option>First Class</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ borderColor: activeTheme.border }} className="border-t pt-4 flex justify-between items-center text-[10px] text-left">
                    <span style={{ color: activeTheme.textSecondary }} className="font-semibold">✈️ Integrated with Duffel Travel API Services</span>
                    <button
                      onClick={() => setFlightStep('results')}
                      style={{ backgroundColor: activeTheme.accent, color: activeTheme.bg }}
                      className="font-black px-6 py-3 rounded-xl transition-all shadow-lg active:scale-95 text-xs uppercase tracking-wider hover:opacity-90"
                    >
                      Search Flights
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Results */}
              {flightStep === 'results' && (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div style={{ borderColor: activeTheme.border }} className="flex justify-between items-center border-b pb-4 text-left">
                    <h3 style={{ color: activeTheme.text }} className="text-sm font-extrabold uppercase tracking-wider">Airfares: {searchFrom} to {countryData.name}</h3>
                    <button onClick={() => setFlightStep('search')} style={{ color: activeTheme.accent }} className="text-xs hover:underline font-bold">Change Search</button>
                  </div>

                  <div className="space-y-4">
                    {mockFlights.map((flight) => (
                      <div 
                        key={flight.id} 
                        style={{ 
                          backgroundColor: selectedFlight?.id === flight.id ? `${activeTheme.accent}0d` : activeTheme.bgSecondary,
                          borderColor: selectedFlight?.id === flight.id ? `${activeTheme.accent}4d` : activeTheme.border
                        }}
                        className="border rounded-[2rem] p-5 flex flex-col sm:flex-row justify-between items-center gap-4 transition-all shadow-sm"
                      >
                        <div className="flex items-center gap-3 w-full sm:w-auto text-left">
                          <span className="text-3xl">{flight.logo}</span>
                          <div>
                            <span style={{ color: activeTheme.text }} className="block font-bold text-sm sm:text-base">{flight.airline}</span>
                            <span style={{ color: activeTheme.textSecondary }} className="block text-[10px] font-semibold">ID: {flight.id} · {searchClass}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-8 text-center text-xs font-semibold w-full sm:w-auto">
                          <div>
                            <span style={{ color: activeTheme.textSecondary }} className="block mb-0.5 opacity-70">Depart</span>
                            <span style={{ color: activeTheme.text }} className="font-bold">{flight.departure}</span>
                          </div>
                          <div>
                            <span style={{ color: activeTheme.textSecondary }} className="block mb-0.5 opacity-70">Duration</span>
                            <span style={{ color: activeTheme.accent }} className="font-extrabold">{flight.duration}</span>
                          </div>
                          <div>
                            <span style={{ color: activeTheme.textSecondary }} className="block mb-0.5 opacity-70">Arrive</span>
                            <span style={{ color: activeTheme.text }} className="font-bold">{flight.arrival}</span>
                          </div>
                        </div>

                        <div style={{ borderColor: activeTheme.border }} className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 gap-3">
                          <div>
                            <span style={{ color: activeTheme.textSecondary }} className="text-[8px] uppercase tracking-widest block font-bold text-right">Fare</span>
                            <span style={{ color: activeTheme.text }} className="text-lg font-black">₹{flight.price.toLocaleString()}</span>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedFlight(flight);
                              setFlightStep('seats');
                            }}
                            style={{ backgroundColor: activeTheme.accent, color: activeTheme.bg }}
                            className="font-black px-4 py-2.5 rounded-xl text-[10px] uppercase tracking-wider transition-all active:scale-95 hover:opacity-90"
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Seats */}
              {flightStep === 'seats' && (
                <motion.div 
                  key="seats"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div style={{ borderColor: activeTheme.border }} className="flex justify-between items-center border-b pb-4 text-left">
                    <div>
                      <h3 style={{ color: activeTheme.text }} className="text-sm font-extrabold uppercase tracking-wider">Seat Map Selection</h3>
                      <p style={{ color: activeTheme.textSecondary }} className="text-[10px] font-semibold">Selected Flight: {selectedFlight?.airline} ({selectedFlight?.id})</p>
                    </div>
                    <button onClick={() => setFlightStep('results')} style={{ color: activeTheme.accent }} className="text-xs hover:underline font-bold">Change flight</button>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-8 justify-center items-center lg:items-start">
                    {/* Grid */}
                    <div style={{ backgroundColor: activeTheme.bgSecondary, borderColor: activeTheme.border }} className="border rounded-3xl p-6 w-full max-w-sm space-y-4">
                      <div style={{ color: activeTheme.textSecondary, borderColor: activeTheme.border }} className="text-center font-bold text-xs border-b pb-2">✈️ CABIN GRID</div>
                      
                      <div className="space-y-2">
                        {[1, 2, 3, 4, 5, 6].map(row => (
                          <div key={row} className="flex justify-between items-center gap-2">
                            <span style={{ color: activeTheme.textSecondary }} className="text-[10px] font-bold w-4">{row}</span>
                            <div className="flex gap-1.5 flex-1 justify-center">
                              {['A', 'B', 'C', 'D', 'E', 'F'].map(col => {
                                const seatId = `${row}${col}`;
                                const isBooked = ['2B', '3E', '5A'].includes(seatId);
                                const isSelected = selectedSeats.includes(seatId);

                                return (
                                  <button
                                    key={seatId}
                                    disabled={isBooked}
                                    onClick={() => {
                                      if (isSelected) {
                                        setSelectedSeats(prev => prev.filter(s => s !== seatId));
                                      } else {
                                        setSelectedSeats(prev => [...prev, seatId]);
                                      }
                                    }}
                                    style={{
                                      backgroundColor: isBooked 
                                        ? 'rgba(239, 68, 68, 0.1)'
                                        : isSelected
                                        ? activeTheme.accent
                                        : activeTheme.bg,
                                      color: isBooked
                                        ? '#ef4444'
                                        : isSelected
                                        ? activeTheme.bg
                                        : activeTheme.text,
                                      borderColor: isBooked
                                        ? 'rgba(239, 68, 68, 0.2)'
                                        : isSelected
                                        ? 'transparent'
                                        : activeTheme.border
                                    }}
                                    className="h-7 w-7 rounded text-[9px] font-bold transition-all flex items-center justify-center border"
                                  >
                                    {seatId}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div style={{ borderColor: activeTheme.border }} className="flex gap-4 justify-center text-[10px] border-t pt-3 font-semibold">
                        <div className="flex items-center gap-1.5" style={{ color: activeTheme.textSecondary }}><span style={{ backgroundColor: activeTheme.bg, borderColor: activeTheme.border }} className="h-3 w-3 rounded border inline-block"></span> Free</div>
                        <div className="flex items-center gap-1.5" style={{ color: activeTheme.textSecondary }}><span style={{ backgroundColor: activeTheme.accent }} className="h-3 w-3 rounded inline-block"></span> Selected</div>
                        <div className="flex items-center gap-1.5" style={{ color: activeTheme.textSecondary }}><span className="h-3 w-3 rounded bg-red-500/10 border border-red-500/20 inline-block"></span> Booked</div>
                      </div>
                    </div>

                    <div className="flex-1 w-full space-y-4 text-left">
                      <h4 style={{ color: activeTheme.text }} className="text-sm font-bold uppercase tracking-widest">Seats summary</h4>
                      <p style={{ color: activeTheme.textSecondary }} className="text-xs leading-relaxed font-medium">Please select your preferred window, aisle, or extra legroom seat choices. Each selected seat adds to flight ticket confirmation.</p>

                      <div style={{ backgroundColor: activeTheme.bgSecondary, borderColor: activeTheme.border }} className="border rounded-2xl p-4 space-y-2">
                        <div className="flex justify-between text-xs font-bold" style={{ color: activeTheme.textSecondary }}>
                          <span>Selected Seats Count</span>
                          <span style={{ color: activeTheme.text }}>{selectedSeats.length} seats</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold" style={{ color: activeTheme.textSecondary }}>
                          <span>Seat IDs</span>
                          <span style={{ color: activeTheme.accent }}>{selectedSeats.join(', ') || 'None selected'}</span>
                        </div>
                      </div>

                      <button
                        disabled={selectedSeats.length === 0}
                        onClick={() => setFlightStep('extras')}
                        style={{ backgroundColor: activeTheme.accent, color: activeTheme.bg }}
                        className="w-full disabled:opacity-50 font-bold py-3.5 rounded-xl text-xs transition-all active:scale-95 text-center flex items-center justify-center gap-1.5 hover:opacity-90"
                      >
                        Confirm seats & Proceed
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Extras */}
              {flightStep === 'extras' && (
                <motion.div 
                  key="extras"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div style={{ borderColor: activeTheme.border }} className="flex justify-between items-center border-b pb-4 text-left">
                    <h3 style={{ color: activeTheme.text }} className="text-sm font-extrabold uppercase tracking-wider">Trip Customization</h3>
                    <button onClick={() => setFlightStep('seats')} style={{ color: activeTheme.accent }} className="text-xs hover:underline font-bold">Change seats</button>
                  </div>

                  <div className="grid gap-6 md:grid-cols-3 text-left">
                    <div 
                      onClick={() => setBaggageSelected(!baggageSelected)}
                      style={{ 
                        backgroundColor: baggageSelected ? `${activeTheme.accent}0d` : activeTheme.bgSecondary, 
                        borderColor: baggageSelected ? `${activeTheme.accent}4d` : activeTheme.border 
                      }}
                      className="border rounded-2xl p-5 space-y-3 cursor-pointer select-none transition-all shadow-sm"
                    >
                      <FiBriefcase style={{ color: activeTheme.accent }} className="text-3xl" />
                      <h4 style={{ color: activeTheme.text }} className="font-bold text-sm">Add Excess Baggage</h4>
                      <p style={{ color: activeTheme.textSecondary }} className="text-[11px] leading-relaxed font-medium">Add +10kg extra baggage clearance. Included tag handles and fast track airport dispatch.</p>
                      <span style={{ color: activeTheme.text }} className="text-xs font-bold block pt-2">₹1,800 / luggage</span>
                    </div>

                    <div style={{ backgroundColor: activeTheme.bgSecondary, borderColor: activeTheme.border }} className="border rounded-2xl p-5 space-y-3 text-left shadow-sm">
                      <FiCoffee style={{ color: activeTheme.accent }} className="text-3xl" />
                      <h4 style={{ color: activeTheme.text }} className="font-bold text-sm">In-Flight Meal Selection</h4>
                      <p style={{ color: activeTheme.textSecondary }} className="text-[11px] leading-relaxed font-medium">Select gourmet dishes curated by world chefs, paired with soft beverages and desserts.</p>
                      <select 
                        value={mealSelected}
                        onChange={e => setMealSelected(e.target.value)}
                        style={{ backgroundColor: activeTheme.bg, borderColor: activeTheme.border, color: activeTheme.text }}
                        className="w-full text-xs p-2.5 rounded outline-none cursor-pointer"
                      >
                        <option>Standard Meal</option>
                        <option>Vegetarian / Vegan</option>
                        <option>Halal / Kosher</option>
                        <option>Gluten-Free</option>
                      </select>
                    </div>

                    <div 
                      onClick={() => setInsuranceSelected(!insuranceSelected)}
                      style={{ 
                        backgroundColor: insuranceSelected ? `${activeTheme.accent}0d` : activeTheme.bgSecondary, 
                        borderColor: insuranceSelected ? `${activeTheme.accent}4d` : activeTheme.border 
                      }}
                      className="border rounded-2xl p-5 space-y-3 cursor-pointer select-none transition-all shadow-sm"
                    >
                      <FiShield style={{ color: activeTheme.accent }} className="text-3xl" />
                      <h4 style={{ color: activeTheme.text }} className="font-bold text-sm">Travel Insurance Protection</h4>
                      <p style={{ color: activeTheme.textSecondary }} className="text-[11px] leading-relaxed font-medium">Comprehensive trip coverage including ticket cancellation claims and medical covers.</p>
                      <span style={{ color: activeTheme.text }} className="text-xs font-bold block pt-2">₹1,500 / traveler</span>
                    </div>
                  </div>

                  <div style={{ borderColor: activeTheme.border }} className="border-t pt-4 flex justify-end">
                    <button
                      onClick={() => setFlightStep('payment')}
                      style={{ backgroundColor: activeTheme.accent, color: activeTheme.bg }}
                      className="font-bold px-6 py-3 rounded-xl transition-all shadow-lg active:scale-95 text-xs uppercase tracking-wider font-extrabold hover:opacity-90"
                    >
                      Confirm Extras & Pay
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Payment */}
              {flightStep === 'payment' && (
                <motion.div 
                  key="payment"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div style={{ borderColor: activeTheme.border }} className="flex justify-between items-center border-b pb-4 text-left">
                    <h3 style={{ color: activeTheme.text }} className="text-sm font-extrabold uppercase tracking-wider">Secure Payment</h3>
                    <button onClick={() => setFlightStep('extras')} style={{ color: activeTheme.accent }} className="text-xs hover:underline font-bold">Change extras</button>
                  </div>

                  <div className="grid gap-6 md:grid-cols-12 text-left">
                    <div style={{ backgroundColor: activeTheme.bgSecondary, borderColor: activeTheme.border }} className="md:col-span-5 border rounded-2xl p-5 space-y-4 shadow-sm">
                      <h4 style={{ color: activeTheme.textSecondary }} className="text-xs font-bold uppercase tracking-widest">Total Price Summary</h4>
                      <div className="text-xs space-y-2 font-medium" style={{ color: activeTheme.textSecondary }}>
                        <div className="flex justify-between">
                          <span>Flight fare ({selectedSeats.length} seats)</span>
                          <span style={{ color: activeTheme.text }}>₹{((selectedFlight?.price || 40000) * selectedSeats.length).toLocaleString()}</span>
                        </div>
                        {baggageSelected && (
                          <div className="flex justify-between">
                            <span>Excess Baggage (+10kg)</span>
                            <span style={{ color: activeTheme.text }}>₹1,800</span>
                          </div>
                        )}
                        {insuranceSelected && (
                          <div className="flex justify-between">
                            <span>Travel Insurance</span>
                            <span style={{ color: activeTheme.text }}>₹{(1500 * selectedSeats.length).toLocaleString()}</span>
                          </div>
                        )}
                        <div style={{ borderColor: activeTheme.border, color: activeTheme.accent }} className="border-t pt-3 flex justify-between text-sm font-bold">
                          <span>Total Paid Amount</span>
                          <span>
                            ₹{(
                              ((selectedFlight?.price || 40000) * selectedSeats.length) +
                              (baggageSelected ? 1800 : 0) +
                              (insuranceSelected ? (1500 * selectedSeats.length) : 0)
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <form 
                      onSubmit={e => {
                        e.preventDefault();
                        handleBookFlight();
                      }}
                      className="md:col-span-7 space-y-4"
                    >
                      <div className="space-y-2">
                        <span style={{ color: activeTheme.textSecondary }} className="text-[8px] uppercase tracking-widest font-black block">Cardholder Name</span>
                        <input
                          type="text"
                          required
                          value={paymentName}
                          onChange={e => setPaymentName(e.target.value)}
                          placeholder="John Doe"
                          style={{ backgroundColor: activeTheme.bgSecondary, borderColor: activeTheme.border, color: activeTheme.text }}
                          className="w-full rounded-xl border p-3 text-xs outline-none focus:opacity-90"
                        />
                      </div>

                      <div className="space-y-2">
                        <span style={{ color: activeTheme.textSecondary }} className="text-[8px] uppercase tracking-widest font-black block">Card Details</span>
                        <input
                          type="text"
                          required
                          maxLength="19"
                          value={paymentCard}
                          onChange={e => {
                            const val = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                            setPaymentCard(val);
                          }}
                          placeholder="4111 2222 3333 4444"
                          style={{ backgroundColor: activeTheme.bgSecondary, borderColor: activeTheme.border, color: activeTheme.text }}
                          className="w-full rounded-xl border p-3 text-xs outline-none focus:opacity-90 font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <span style={{ color: activeTheme.textSecondary }} className="text-[8px] uppercase tracking-widest font-black block">Expiry Date</span>
                          <input
                            type="text"
                            required
                            maxLength="5"
                            placeholder="MM/YY"
                            style={{ backgroundColor: activeTheme.bgSecondary, borderColor: activeTheme.border, color: activeTheme.text }}
                            className="w-full rounded-xl border p-3 text-xs outline-none focus:opacity-90 text-center font-mono"
                          />
                        </div>
                        <div className="space-y-2">
                          <span style={{ color: activeTheme.textSecondary }} className="text-[8px] uppercase tracking-widest font-black block">CVV Code</span>
                          <input
                            type="password"
                            required
                            maxLength="3"
                            placeholder="***"
                            style={{ backgroundColor: activeTheme.bgSecondary, borderColor: activeTheme.border, color: activeTheme.text }}
                            className="w-full rounded-xl border p-3 text-xs outline-none focus:opacity-90 text-center font-mono"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        style={{ backgroundColor: activeTheme.accent, color: activeTheme.bg }}
                        className="w-full font-black py-3.5 rounded-xl text-xs transition-all active:scale-95 text-center flex items-center justify-center gap-1.5 mt-2 shadow-lg uppercase tracking-wider hover:opacity-90"
                      >
                        Authorize & Pay
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}

              {/* Step 6: Confirmed */}
              {flightStep === 'confirmed' && (
                <motion.div 
                  key="confirmed"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 text-center py-4"
                >
                  <div 
                    style={{ backgroundColor: `${activeTheme.accent}1a`, borderColor: `${activeTheme.accent}33`, color: activeTheme.accent }}
                    className="grid h-16 w-16 place-items-center rounded-full border text-3xl mx-auto animate-bounce"
                  >
                    <FiCheckCircle />
                  </div>

                  <div className="space-y-1">
                    <h3 style={{ color: activeTheme.text }} className="text-2xl font-black uppercase tracking-wider">Booking Confirmed!</h3>
                    <p style={{ color: activeTheme.textSecondary }} className="text-xs font-medium">Your e-tickets have been dispatched to your registered email address.</p>
                  </div>

                  {/* Boarding Pass */}
                  <div 
                    style={{ backgroundColor: activeTheme.darkBlock, borderColor: `${activeTheme.border}22` }}
                    className="max-w-md mx-auto border rounded-[2rem] overflow-hidden shadow-2xl text-left"
                  >
                    <div 
                      style={{ background: `linear-gradient(to right, ${activeTheme.accent}, ${activeTheme.accent}dd)`, color: activeTheme.bg }}
                      className="p-4 flex justify-between items-center font-black text-xs"
                    >
                      <span>BOARDING PASS</span>
                      <span className="tracking-widest">{bookingCode}</span>
                    </div>

                    <div className="p-6 space-y-5 text-left" style={{ color: activeTheme.darkBlockText }}>
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <div>
                          <span style={{ color: `${activeTheme.darkBlockText}70` }} className="text-[8px] uppercase tracking-widest block font-bold">Passenger</span>
                          <span>{paymentName || 'Traveloop Traveler'}</span>
                        </div>
                        <div className="text-right">
                          <span style={{ color: `${activeTheme.darkBlockText}70` }} className="text-[8px] uppercase tracking-widest block font-bold">Cabin Class</span>
                          <span style={{ color: activeTheme.accent }} className="font-bold">{searchClass}</span>
                        </div>
                      </div>

                      <div style={{ borderColor: `${activeTheme.darkBlockText}1a` }} className="border-t border-dashed pt-4 flex justify-between items-center text-xs">
                        <div>
                          <span style={{ color: `${activeTheme.darkBlockText}70` }} className="text-[8px] uppercase tracking-widest block font-bold">From</span>
                          <span className="font-extrabold text-lg">BOM</span>
                          <span style={{ color: `${activeTheme.darkBlockText}b3` }} className="block text-[10px]">Mumbai</span>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <span className="text-lg">✈️</span>
                          <span style={{ color: activeTheme.accent }} className="text-[8px] font-extrabold tracking-widest uppercase mt-1">{selectedFlight?.duration}</span>
                        </div>

                        <div className="text-right">
                          <span style={{ color: `${activeTheme.darkBlockText}70` }} className="text-[8px] uppercase tracking-widest block font-bold">To</span>
                          <span className="font-extrabold text-lg">
                            {countryData.name.substring(0, 3).toUpperCase()}
                          </span>
                          <span style={{ color: `${activeTheme.darkBlockText}b3` }} className="block text-[10px]">{countryData.name}</span>
                        </div>
                      </div>

                      <div style={{ borderColor: `${activeTheme.darkBlockText}1a` }} className="border-t border-dashed pt-4 grid grid-cols-4 gap-2 text-center text-xs font-semibold">
                        <div>
                          <span style={{ color: `${activeTheme.darkBlockText}70` }} className="text-[8px] block">Carrier</span>
                          <span style={{ color: `${activeTheme.darkBlockText}cc` }}>{selectedFlight?.airline.split(' ')[0]}</span>
                        </div>
                        <div>
                          <span style={{ color: `${activeTheme.darkBlockText}70` }} className="text-[8px] block">Seats</span>
                          <span style={{ color: activeTheme.accent }}>{selectedSeats.join(', ')}</span>
                        </div>
                        <div>
                          <span style={{ color: `${activeTheme.darkBlockText}70` }} className="text-[8px] block">Meal</span>
                          <span style={{ color: `${activeTheme.darkBlockText}cc` }}>{mealSelected.split(' ')[0]}</span>
                        </div>
                        <div>
                          <span style={{ color: `${activeTheme.darkBlockText}70` }} className="text-[8px] block">Baggage</span>
                          <span style={{ color: `${activeTheme.darkBlockText}cc` }}>{baggageSelected ? 'Extra +10kg' : 'Std (25kg)'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setFlightStep('search');
                        setSelectedSeats([]);
                        setSelectedFlight(null);
                      }}
                      style={{ backgroundColor: activeTheme.bgSecondary, borderColor: activeTheme.border, color: activeTheme.text }}
                      className="border font-bold px-6 py-2.5 rounded-full text-xs transition-colors hover:opacity-85"
                    >
                      Book Another Flight
                    </button>
                    <button
                      onClick={() => navigate('/my-trips')}
                      style={{ backgroundColor: activeTheme.accent, color: activeTheme.bg }}
                      className="font-bold px-6 py-2.5 rounded-full text-xs transition-colors shadow-md hover:opacity-90"
                    >
                      View My Trips
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Continue Exploring */}
          <div className="space-y-12">
            <div className="max-w-xl space-y-2">
              <span style={{ color: activeTheme.accent }} className="text-xs font-black uppercase tracking-[0.25em] font-bold">Next Destination</span>
              <h2 style={{ color: activeTheme.text }} className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-sans">Continue Exploring</h2>
              <div style={{ backgroundColor: activeTheme.accent }} className="h-0.5 w-16" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otherCountries.map((dest) => {
                const countryId = dest.country.toLowerCase().replace(/\s+/g, '-');
                return (
                  <Link
                    key={dest.name}
                    to={`/destination/${countryId}`}
                    style={{ borderColor: activeTheme.border }}
                    className="group relative rounded-[2rem] overflow-hidden h-60 border shadow-xl bg-slate-900 block"
                  >
                    <img 
                      src={dest.image} 
                      alt={dest.name} 
                      loading="lazy"
                      className="w-full h-full object-cover opacity-75 group-hover:scale-[1.05] transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-5 left-5 text-left">
                      <span style={{ color: activeTheme.accent }} className="text-[8px] uppercase tracking-widest font-extrabold block">Explore {dest.country}</span>
                      <h3 className="text-xl font-black text-white leading-none mt-1">{dest.name}</h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* Premium themed footer */}
      <footer 
        style={{ backgroundColor: activeTheme.bgSecondary, borderColor: activeTheme.border }}
        className="border-t py-12 px-6 text-center text-xs transition-colors duration-500"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link to="/" className="flex flex-col items-start leading-none group text-left">
            <span style={{ color: activeTheme.textSecondary }} className="text-[7px] font-black uppercase tracking-[0.3em] opacity-80">VISIT THE</span>
            <span style={{ color: activeTheme.text }} className="text-base font-black uppercase tracking-tighter">{countryData.name}</span>
          </Link>
          <p style={{ color: activeTheme.textSecondary }} className="font-semibold">© 2026 TravelLoop & VisitTheUSA Journeys. All rights reserved.</p>
          <div className="flex gap-4 font-bold text-[10px] uppercase tracking-widest" style={{ color: activeTheme.textSecondary }}>
            <a href="#overview" className="hover:opacity-80 transition-opacity">Back to top</a>
            <a href="#concierge" className="hover:opacity-80 transition-opacity">AI Concierge</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
