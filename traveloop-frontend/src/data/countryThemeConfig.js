// Dynamic Color Themes & Real Video Feeds configuration for TravelLoop Destination Detail Pages

const U = (id, w = 1200, h = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

export const COUNTRY_THEMES = {
  japan: {
    bg: '#FAF4F4', // Soft Sakura Blossom Pink
    bgSecondary: '#F3EAEB', // Muted rose-grey for layout containers
    accent: '#D35269', // Sakura Blossom Crimson
    accentHover: '#C23E56',
    text: '#1C1A1A', // High contrast charcoal text
    textSecondary: '#6E5C5E', // Mauve secondary text
    darkBlock: '#201B1C', // Deep dark espresso split
    darkBlockText: '#FAF4F4',
    border: '#E8D4D6',
    accentLight: '#FAF0F1',
    accentLightBorder: '#F5DEE1',
    glassBg: 'rgba(250, 244, 244, 0.8)'
  },
  india: {
    bg: '#FBF6EC', // Saffron Ivory / Warm cream
    bgSecondary: '#F3EAD9', // Clay ivory for layout containers
    accent: '#D97706', // Saffron Amber
    accentHover: '#C26500',
    text: '#221815', // Deep charcoal mud text
    textSecondary: '#665751',
    darkBlock: '#2C1C18', // Rich mahogany split
    darkBlockText: '#FBF6EC',
    border: '#EADBC4',
    accentLight: '#FBF3E6',
    accentLightBorder: '#F5E4CE',
    glassBg: 'rgba(251, 246, 236, 0.8)'
  },
  france: {
    bg: '#F3F4F8', // Parisian Chic Linen/Lavender
    bgSecondary: '#E5E8F0', // Louvre stone grey
    accent: '#1D4ED8', // Royal French Blue
    accentHover: '#173EAB',
    text: '#0F172A', // Slate 900
    textSecondary: '#4B5563', // Slate 600
    darkBlock: '#151B26', // Deep navy split
    darkBlockText: '#F3F4F8',
    border: '#D1D7E6',
    accentLight: '#EFF2FC',
    accentLightBorder: '#DEE4F7',
    glassBg: 'rgba(243, 244, 248, 0.8)'
  },
  greece: {
    bg: '#F0F7FA', // Aegean Sky Blue-White
    bgSecondary: '#DFECF3',
    accent: '#0284C7', // Aegean Ocean Blue
    accentHover: '#0369A1',
    text: '#0B2236',
    textSecondary: '#476378',
    darkBlock: '#0A1C2A', // Deep Aegean Midnight split
    darkBlockText: '#F0F7FA',
    border: '#CBDCE6',
    accentLight: '#EBF5FA',
    accentLightBorder: '#D2E8F5',
    glassBg: 'rgba(240, 247, 250, 0.8)'
  },
  italy: {
    bg: '#FAF6F0', // Tuscan Clay
    bgSecondary: '#EFE7DA',
    accent: '#A53A15', // Terracotta Orange
    accentHover: '#8C2E0E',
    text: '#221512',
    textSecondary: '#6E5D57',
    darkBlock: '#221B18', // Roasted coffee bean split
    darkBlockText: '#FAF6F0',
    border: '#E8DCC9',
    accentLight: '#FAF2E6',
    accentLightBorder: '#F2E4D0',
    glassBg: 'rgba(250, 246, 240, 0.8)'
  },
  usa: {
    bg: '#F5F6F2', // Forest Sage Cream
    bgSecondary: '#E7EAE0',
    accent: '#065F46', // Deep Pine Green
    accentHover: '#044E39',
    text: '#1E293B',
    textSecondary: '#475569',
    darkBlock: '#1E2522', // Redwood Pine split
    darkBlockText: '#F5F6F2',
    border: '#D5DAD0',
    accentLight: '#ECFDF5',
    accentLightBorder: '#D1FAE5',
    glassBg: 'rgba(245, 246, 242, 0.8)'
  },
  egypt: {
    bg: '#FDFBF6', // Alabaster Desert Sand
    bgSecondary: '#F4ECE0',
    accent: '#B45309', // Desert gold
    accentHover: '#92400E',
    text: '#1C1B18',
    textSecondary: '#5C5850',
    darkBlock: '#221F1B', // Basalt black split
    darkBlockText: '#FDFBF6',
    border: '#ECE2CE',
    accentLight: '#FEF3C7',
    accentLightBorder: '#FDE68A',
    glassBg: 'rgba(253, 251, 246, 0.8)'
  },
  morocco: {
    bg: '#FAF2ED', // Marrakech Clay Rose
    bgSecondary: '#EFE0D4',
    accent: '#EA580C', // Cinnamon Amber
    accentHover: '#C2410C',
    text: '#261611',
    textSecondary: '#6B544C',
    darkBlock: '#261B17', // Roasted clove split
    darkBlockText: '#FAF2ED',
    border: '#EAD3C2',
    accentLight: '#FFF7ED',
    accentLightBorder: '#FFEDD5',
    glassBg: 'rgba(250, 242, 237, 0.8)'
  },
  thailand: {
    bg: '#FCF3FA', // Siamese Lotus Orchid
    bgSecondary: '#F4DFEE',
    accent: '#C026D3', // Lotus Magenta
    accentHover: '#A21CAF',
    text: '#241822',
    textSecondary: '#665063',
    darkBlock: '#261623', // Deep Orchid Velvet split
    darkBlockText: '#FCF3FA',
    border: '#EAD0E7',
    accentLight: '#FDF4FF',
    accentLightBorder: '#FAE8FF',
    glassBg: 'rgba(252, 243, 250, 0.8)'
  },
  indonesia: {
    bg: '#F1F6F0', // Bali Bamboo Green
    bgSecondary: '#E1ECE0',
    accent: '#0D9488', // Island Turquoise Teal
    accentHover: '#0F766E',
    text: '#111E1D',
    textSecondary: '#4A5D5A',
    darkBlock: '#121F1D', // Deep jungle emerald split
    darkBlockText: '#F1F6F0',
    border: '#D2E2D0',
    accentLight: '#F0FDFA',
    accentLightBorder: '#CCFBF1',
    glassBg: 'rgba(241, 246, 240, 0.8)'
  },
  default: {
    bg: '#F5F2EB', // Classic Travel Cream
    bgSecondary: '#ECE9DF',
    accent: '#0D9488', // Teal
    accentHover: '#0F766E',
    text: '#1E293B',
    textSecondary: '#475569',
    darkBlock: '#1C222C', // Classic Dark Slate split
    darkBlockText: '#F5F2EB',
    border: '#E2E8F0',
    accentLight: '#F0FDFA',
    accentLightBorder: '#CCFBF1',
    glassBg: 'rgba(245, 242, 235, 0.8)'
  }
};

export const COUNTRY_VIDEOS = {
  japan: {
    heroVideoUrl: '/Create_a_second_cinematic_a.mp4',
    reels: [
      {
        id: 'jp_cinematic',
        title: 'Exclusive Japan Cinematic Journey',
        videoUrl: '/Create_a_second_cinematic_a.mp4',
        thumbnail: '/paradise_sunset.jpg',
        duration: '0:10',
        views: '1.2M'
      },
      {
        id: 'jp1',
        title: 'Late Night Neon Wandering in Shinjuku, Tokyo',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-traffic-in-a-futuristic-city-at-night-44368-large.mp4',
        thumbnail: U('1540959733332-eab4deabeeaf'),
        duration: '0:18',
        views: '542K'
      },
      {
        id: 'jp2',
        title: 'Morning Serenity at Arashiyama Bamboo Paths',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-flying-over-a-green-mountain-forest-48907-large.mp4',
        thumbnail: U('1503899036084-c55cdd92da26'),
        duration: '0:22',
        views: '320K'
      },
      {
        id: 'jp3',
        title: 'Okinawa Coastline: Pure Emerald Beach Sanctuary',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-tropical-beach-and-sea-background-48866-large.mp4',
        thumbnail: U('1507525428034-b723cf961d3e'),
        duration: '0:15',
        views: '189K'
      },
      {
        id: 'jp4',
        title: 'Breathtaking Highway Views of the Japanese Alps',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-driving-on-a-scenic-coastal-road-48913-large.mp4',
        thumbnail: U('1578271887552-5ac3a72752bc'),
        duration: '0:20',
        views: '298K'
      }
    ]
  },
  india: {
    heroVideoUrl: '/Create_a_second_cinematic_a.mp4',
    reels: [
      {
        id: 'in_cinematic',
        title: 'Exclusive India Cinematic Vibe',
        videoUrl: '/Create_a_second_cinematic_a.mp4',
        thumbnail: '/paradise_sunset.jpg',
        duration: '0:10',
        views: '1.5M'
      },
      {
        id: 'in1',
        title: 'Golden Hour Reflecting on Taj Mahal Marble Walls',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-scenic-view-of-a-mountain-lake-48908-large.mp4',
        thumbnail: U('1524413840003-0c315883a8f4'),
        duration: '0:15',
        views: '710K'
      },
      {
        id: 'in2',
        title: 'Old Delhi Bazaars: Busy Avenues of Spices & Fabric',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-walking-on-a-busy-city-street-44372-large.mp4',
        thumbnail: U('1599661046289-e31897846e41'),
        duration: '0:20',
        views: '389K'
      },
      {
        id: 'in3',
        title: 'Alleppey Backwaters: Handcrafted Houseboat Cruising',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-tropical-beach-and-sea-background-48866-large.mp4',
        thumbnail: U('1593693397690-362cb9666fc2'),
        duration: '0:18',
        views: '450K'
      },
      {
        id: 'in4',
        title: 'Coral Reef Snorkeling in the Lakshadweep Sea',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-underwater-shot-of-a-coral-reef-with-fish-49807-large.mp4',
        thumbnail: U('1507525428034-b723cf961d3e'),
        duration: '0:25',
        views: '190K'
      }
    ]
  },
  france: {
    heroVideoUrl: '/Create_a_second_cinematic_a.mp4',
    reels: [
      {
        id: 'fr_cinematic',
        title: 'Exclusive France Cinematic Vibe',
        videoUrl: '/Create_a_second_cinematic_a.mp4',
        thumbnail: '/paradise_sunset.jpg',
        duration: '0:10',
        views: '1.1M'
      },
      {
        id: 'fr1',
        title: 'Seine River Cruise: Sunset Over the Eiffel Tower',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-time-lapse-of-a-sunset-over-a-city-skyline-48909-large.mp4',
        thumbnail: U('1502602898657-3e91760cbb34'),
        duration: '0:16',
        views: '612K'
      },
      {
        id: 'fr2',
        title: 'Walk through Historic Cafe Districts of Saint-Germain',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-walking-on-a-busy-city-street-44372-large.mp4',
        thumbnail: U('1499856871958-5b9647a64bc8'),
        duration: '0:21',
        views: '345K'
      },
      {
        id: 'fr3',
        title: 'Chamonix Valley: Pine Forests & Snowy Alps Peaks',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-snow-falling-on-pine-trees-48911-large.mp4',
        thumbnail: U('1454496522488-7a8e488e8606'),
        duration: '0:18',
        views: '240K'
      },
      {
        id: 'fr4',
        title: 'Lavender Trail: Flying Over Provence Blooms',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-flying-over-a-green-mountain-forest-48907-large.mp4',
        thumbnail: U('1500382017468-9049fed747ef'),
        duration: '0:24',
        views: '419K'
      }
    ]
  },
  usa: {
    heroVideoUrl: '/Create_a_second_cinematic_a.mp4',
    reels: [
      {
        id: 'us_cinematic',
        title: 'Exclusive USA Cinematic Vibe',
        videoUrl: '/Create_a_second_cinematic_a.mp4',
        thumbnail: '/paradise_sunset.jpg',
        duration: '0:10',
        views: '1.4M'
      },
      {
        id: 'us1',
        title: 'Redwood Highway Coastal Drive in California',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-driving-on-a-scenic-coastal-road-48913-large.mp4',
        thumbnail: U('1506905925346-21bda4d32df4'),
        duration: '0:15',
        views: '488K'
      },
      {
        id: 'us2',
        title: 'New York Skyline: Manhattan Sunset Timelapse',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-time-lapse-of-a-sunset-over-a-city-skyline-48909-large.mp4',
        thumbnail: U('1496442226666-8d4d0e62e6e9'),
        duration: '0:19',
        views: '930K'
      },
      {
        id: 'us3',
        title: 'Jungle Cascades: Yellowstone Canyon Waterfalls',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4',
        thumbnail: U('1447752875215-b2761acb3c5d'),
        duration: '0:22',
        views: '315K'
      },
      {
        id: 'us4',
        title: 'Sunset over Key West Beaches & Palm Groves',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-tropical-beach-and-sea-background-48866-large.mp4',
        thumbnail: U('1507525428034-b723cf961d3e'),
        duration: '0:14',
        views: '266K'
      }
    ]
  },
  greece: {
    heroVideoUrl: '/Create_a_second_cinematic_a.mp4',
    reels: [
      {
        id: 'gr_cinematic',
        title: 'Exclusive Greece Cinematic Vibe',
        videoUrl: '/Create_a_second_cinematic_a.mp4',
        thumbnail: '/paradise_sunset.jpg',
        duration: '0:10',
        views: '1.3M'
      },
      {
        id: 'gr1',
        title: 'Santorini Blue Domes: Cliffside Aerial Flyover',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-beautiful-island-48906-large.mp4',
        thumbnail: U('1570077188670-e3a8d69ac5ff'),
        duration: '0:20',
        views: '840K'
      },
      {
        id: 'gr2',
        title: 'Aegean Sea Sunset: Golden Light over Crystal Water',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-time-lapse-of-a-sunset-over-a-city-skyline-48909-large.mp4',
        thumbnail: U('1514282401047-d79a71a590e8'),
        duration: '0:15',
        views: '498K'
      },
      {
        id: 'gr3',
        title: 'Coastal Highway Tour of the Peloponnese Peninsula',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-driving-on-a-scenic-coastal-road-48913-large.mp4',
        thumbnail: U('1506973035872-a4ec16b8e8d9'),
        duration: '0:18',
        views: '277K'
      },
      {
        id: 'gr4',
        title: 'Glacial Waters & Secret Lagunas in Corfu',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-scenic-view-of-a-mountain-lake-48908-large.mp4',
        thumbnail: U('1537996194471-e657df975ab4'),
        duration: '0:22',
        views: '350K'
      }
    ]
  },
  egypt: {
    heroVideoUrl: '/Create_a_second_cinematic_a.mp4',
    reels: [
      {
        id: 'eg_cinematic',
        title: 'Exclusive Egypt Cinematic Vibe',
        videoUrl: '/Create_a_second_cinematic_a.mp4',
        thumbnail: '/paradise_sunset.jpg',
        duration: '0:10',
        views: '1.2M'
      },
      {
        id: 'eg1',
        title: 'Pyramids Sunrise: Giza Plateau Basalt Glow',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-time-lapse-of-a-sunset-over-a-city-skyline-48909-large.mp4',
        thumbnail: U('1539768942893-daf2d21bef84'),
        duration: '0:17',
        views: '955K'
      },
      {
        id: 'eg2',
        title: 'Nile Evening Cruise: Drifting past Historic Luxor',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-scenic-view-of-a-mountain-lake-48908-large.mp4',
        thumbnail: U('1561361513-2d89af450548'),
        duration: '0:22',
        views: '380K'
      },
      {
        id: 'eg3',
        title: 'Red Sea Reef Diving: Coral Kingdoms at Sharm',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-underwater-shot-of-a-coral-reef-with-fish-49807-large.mp4',
        thumbnail: U('1507525428034-b723cf961d3e'),
        duration: '0:25',
        views: '235K'
      },
      {
        id: 'eg4',
        title: 'Desert Dunes Road Trip: Sinai Mountains Drive',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-driving-on-a-scenic-coastal-road-48913-large.mp4',
        thumbnail: U('1469854523086-cc02fe5d8800'),
        duration: '0:19',
        views: '179K'
      }
    ]
  },
  default: {
    heroVideoUrl: '/Create_a_second_cinematic_a.mp4',
    reels: [
      {
        id: 'def_cinematic',
        title: 'Exclusive Travel Cinematic Vibe',
        videoUrl: '/Create_a_second_cinematic_a.mp4',
        thumbnail: '/paradise_sunset.jpg',
        duration: '0:10',
        views: '1.2M'
      },
      {
        id: 'r1',
        title: 'Exploring Scenic Mountain Ranges & Alpine Valleys',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-scenic-view-of-a-mountain-lake-48908-large.mp4',
        thumbnail: U('1470071459604-3b5ec3a7fe05'),
        duration: '0:15',
        views: '124K'
      },
      {
        id: 'r2',
        title: 'Wandering Through Cozy Regional Marketplace Districts',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-walking-on-a-busy-city-street-44372-large.mp4',
        thumbnail: U('1533105079780-92b9be482077'),
        duration: '0:20',
        views: '98K'
      },
      {
        id: 'r3',
        title: 'Stunning Drone Landscapes of Islands & Reef Shores',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-beautiful-island-48906-large.mp4',
        thumbnail: U('1507525428034-b723cf961d3e'),
        duration: '0:18',
        views: '240K'
      },
      {
        id: 'r4',
        title: 'Scenic Coastal Drives & Road Trip Escapes',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-driving-on-a-scenic-coastal-road-48913-large.mp4',
        thumbnail: U('1469854523086-cc02fe5d8800'),
        duration: '0:12',
        views: '185K'
      }
    ]
  }
};

export function getCountryTheme(countryId, countryName) {
  const cId = (countryId || '').toLowerCase();
  const cName = (countryName || '').toLowerCase();
  
  if (cId.includes('japan') || cId.includes('tokyo') || cId.includes('kyoto') || cName.includes('japan')) {
    return COUNTRY_THEMES.japan;
  }
  if (cId.includes('india') || cId.includes('mumbai') || cId.includes('delhi') || cName.includes('india')) {
    return COUNTRY_THEMES.india;
  }
  if (cId.includes('france') || cId.includes('paris') || cName.includes('france')) {
    return COUNTRY_THEMES.france;
  }
  if (cId.includes('greece') || cId.includes('santorini') || cName.includes('greece')) {
    return COUNTRY_THEMES.greece;
  }
  if (cId.includes('italy') || cId.includes('rome') || cId.includes('venice') || cName.includes('italy')) {
    return COUNTRY_THEMES.italy;
  }
  if (cId.includes('usa') || cId.includes('newyork') || cId.includes('lasvegas') || cId.includes('miami') || cName.includes('united states') || cName.includes('usa')) {
    return COUNTRY_THEMES.usa;
  }
  if (cId.includes('egypt') || cId.includes('cairo') || cName.includes('egypt')) {
    return COUNTRY_THEMES.egypt;
  }
  if (cId.includes('morocco') || cId.includes('marrakech') || cName.includes('morocco')) {
    return COUNTRY_THEMES.morocco;
  }
  if (cId.includes('thailand') || cId.includes('bangkok') || cId.includes('phuket') || cName.includes('thailand')) {
    return COUNTRY_THEMES.thailand;
  }
  if (cId.includes('indonesia') || cId.includes('bali') || cName.includes('indonesia')) {
    return COUNTRY_THEMES.indonesia;
  }
  
  return COUNTRY_THEMES.default;
}

export function getCountryVideoData(countryId, countryName) {
  const cId = (countryId || '').toLowerCase();
  const cName = (countryName || '').toLowerCase();
  
  if (cId.includes('japan') || cId.includes('tokyo') || cId.includes('kyoto') || cName.includes('japan')) {
    return COUNTRY_VIDEOS.japan;
  }
  if (cId.includes('india') || cId.includes('mumbai') || cId.includes('delhi') || cName.includes('india')) {
    return COUNTRY_VIDEOS.india;
  }
  if (cId.includes('france') || cId.includes('paris') || cName.includes('france')) {
    return COUNTRY_VIDEOS.france;
  }
  if (cId.includes('greece') || cId.includes('santorini') || cName.includes('greece')) {
    return COUNTRY_VIDEOS.greece;
  }
  if (cId.includes('egypt') || cId.includes('cairo') || cName.includes('egypt')) {
    return COUNTRY_VIDEOS.egypt;
  }
  if (cId.includes('usa') || cId.includes('newyork') || cId.includes('lasvegas') || cId.includes('miami') || cName.includes('united states') || cName.includes('usa')) {
    return COUNTRY_VIDEOS.usa;
  }
  
  return COUNTRY_VIDEOS.default;
}
