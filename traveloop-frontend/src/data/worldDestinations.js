// Comprehensive world destinations with reliable Unsplash photo IDs
// Images use the Unsplash Source API which never returns broken images

const U = (id, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

export const WORLD_DESTINATIONS = [
  // ── EUROPE ──────────────────────────────────────────────────────────
  {
    id: 'paris', name: 'Paris', country: 'France', continent: 'Europe',
    image: U('1502602898657-3e91760cbb34'),
    tag: '🗼', cost: '₹10,500', season: 'Apr – Oct', safety: '92%',
    desc: 'City of light, art, and romance',
  },
  {
    id: 'london', name: 'London', country: 'UK', continent: 'Europe',
    image: U('1513635269975-59663e0ac1ad'),
    tag: '🎡', cost: '₹12,000', season: 'May – Sep', safety: '94%',
    desc: 'Where history meets the modern world',
  },
  {
    id: 'rome', name: 'Rome', country: 'Italy', continent: 'Europe',
    image: U('1552832230-c0197dd311b5'),
    tag: '🏛️', cost: '₹7,600', season: 'Apr – Jun', safety: '91%',
    desc: 'Eternal city of ancient wonders',
  },
  {
    id: 'barcelona', name: 'Barcelona', country: 'Spain', continent: 'Europe',
    image: U('1539037116277-4db20889f2d4'),
    tag: '🎨', cost: '₹6,800', season: 'May – Oct', safety: '93%',
    desc: 'Gaudí architecture and stunning beaches',
  },
  {
    id: 'amsterdam', name: 'Amsterdam', country: 'Netherlands', continent: 'Europe',
    image: U('1534351590666-13e3e96b5017'),
    tag: '🚲', cost: '₹8,900', season: 'Apr – Sep', safety: '93%',
    desc: 'Canals, tulips, and golden age art',
  },
  {
    id: 'prague', name: 'Prague', country: 'Czech Republic', continent: 'Europe',
    image: U('1519671482749-fd09be7ccebf'),
    tag: '🏰', cost: '₹4,200', season: 'May – Sep', safety: '96%',
    desc: 'Fairytale castles and cobblestone charm',
  },
  {
    id: 'vienna', name: 'Vienna', country: 'Austria', continent: 'Europe',
    image: U('1516550893923-42d28e5677af'),
    tag: '🎼', cost: '₹9,200', season: 'Apr – Oct', safety: '97%',
    desc: 'Imperial grandeur and classical music',
  },
  {
    id: 'zurich', name: 'Zurich', country: 'Switzerland', continent: 'Europe',
    image: U('1515488764276-beab7607c1e6'),
    tag: '⛰️', cost: '₹16,000', season: 'Jun – Sep', safety: '99%',
    desc: 'Alpine luxury and pristine lakes',
  },
  {
    id: 'santorini', name: 'Santorini', country: 'Greece', continent: 'Europe',
    image: U('1570077188670-e3a8d69ac5ff'),
    tag: '🌅', cost: '₹9,800', season: 'Jun – Sep', safety: '95%',
    desc: 'White cliffs, blue domes, and sunsets',
  },
  {
    id: 'lisbon', name: 'Lisbon', country: 'Portugal', continent: 'Europe',
    image: U('1548707309-dcebeab9ea9b'),
    tag: '🚋', cost: '₹5,500', season: 'Mar – Oct', safety: '94%',
    desc: 'Fado music and sun-drenched hills',
  },
  {
    id: 'venice', name: 'Venice', country: 'Italy', continent: 'Europe',
    image: U('1527631746610-bca00a040d60'),
    tag: '🚤', cost: '₹11,000', season: 'Apr – Jun', safety: '94%',
    desc: 'Floating city of art and gondolas',
  },
  {
    id: 'berlin', name: 'Berlin', country: 'Germany', continent: 'Europe',
    image: U('1560969184-10fe8719e047'),
    tag: '🎸', cost: '₹7,000', season: 'May – Sep', safety: '92%',
    desc: 'Culture, history, and vibrant nightlife',
  },
  {
    id: 'copenhagen', name: 'Copenhagen', country: 'Denmark', continent: 'Europe',
    image: U('1513622470522-26c3c8a854bc'),
    tag: '🦢', cost: '₹13,500', season: 'Jun – Aug', safety: '98%',
    desc: 'Design, hygge, and Nordic charm',
  },
  {
    id: 'edinburgh', name: 'Edinburgh', country: 'Scotland', continent: 'Europe',
    image: U('1566665797739-167e32223882'),
    tag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', cost: '₹9,500', season: 'May – Sep', safety: '95%',
    desc: 'Highland drama and historic castle',
  },
  {
    id: 'budapest', name: 'Budapest', country: 'Hungary', continent: 'Europe',
    image: U('1541185933-ef5d1370d735'),
    tag: '🏊', cost: '₹4,500', season: 'Apr – Oct', safety: '93%',
    desc: 'Thermal baths and baroque splendor',
  },

  // ── ASIA ─────────────────────────────────────────────────────────────
  {
    id: 'tokyo', name: 'Tokyo', country: 'Japan', continent: 'Asia',
    image: U('1540959733332-eab4deabeeaf'),
    tag: '🗾', cost: '₹9,800', season: 'Mar – May', safety: '98%',
    desc: 'Neon modernity meets ancient tradition',
  },
  {
    id: 'bali', name: 'Bali', country: 'Indonesia', continent: 'Asia',
    image: U('1537996194471-e657df975ab4'),
    tag: '🌺', cost: '₹3,200', season: 'Apr – Oct', safety: '88%',
    desc: 'Spiritual temples and tropical paradise',
  },
  {
    id: 'singapore', name: 'Singapore', country: 'Singapore', continent: 'Asia',
    image: U('1525625293386-f5e1d7e04c84'),
    tag: '🌃', cost: '₹11,500', season: 'Year-round', safety: '99%',
    desc: 'Futuristic garden city of Southeast Asia',
  },
  {
    id: 'bangkok', name: 'Bangkok', country: 'Thailand', continent: 'Asia',
    image: U('1508009603885-50cf7c579365'),
    tag: '🛕', cost: '₹3,800', season: 'Nov – Feb', safety: '87%',
    desc: 'Temples, street food, and nightlife',
  },
  {
    id: 'dubai', name: 'Dubai', country: 'UAE', continent: 'Asia',
    image: U('1512453979798-5ea266f8880c'),
    tag: '🏙️', cost: '₹11,000', season: 'Nov – Mar', safety: '97%',
    desc: 'Superlatives and desert luxury',
  },
  {
    id: 'kyoto', name: 'Kyoto', country: 'Japan', continent: 'Asia',
    image: U('1493976040374-85c8e12f0c0e'),
    tag: '⛩️', cost: '₹8,500', season: 'Mar – May', safety: '99%',
    desc: 'Ancient temples and cherry blossoms',
  },
  {
    id: 'seoul', name: 'Seoul', country: 'South Korea', continent: 'Asia',
    image: U('1538485399081-7191377e8241'),
    tag: '🇰🇷', cost: '₹7,200', season: 'Apr – Jun', safety: '96%',
    desc: 'K-pop culture and innovative cuisine',
  },
  {
    id: 'mumbai', name: 'Mumbai', country: 'India', continent: 'Asia',
    image: U('1529253355930-ddbe423a2ac7'),
    tag: '🎬', cost: '₹2,500', season: 'Nov – Feb', safety: '82%',
    desc: 'Bollywood, beaches, and street food',
  },
  {
    id: 'delhi', name: 'New Delhi', country: 'India', continent: 'Asia',
    image: U('1587474260584-136574528ed5'),
    tag: '🕌', cost: '₹2,200', season: 'Oct – Mar', safety: '80%',
    desc: 'Mughal heritage and vibrant bazaars',
  },
  {
    id: 'hongkong', name: 'Hong Kong', country: 'China', continent: 'Asia',
    image: U('1506449586099-01fd43cffd8c'),
    tag: '🌉', cost: '₹10,500', season: 'Oct – Dec', safety: '95%',
    desc: 'Glittering skyline and dim sum culture',
  },
  {
    id: 'phuket', name: 'Phuket', country: 'Thailand', continent: 'Asia',
    image: U('1519046909901-ef1169f0e9e1'),
    tag: '🏝️', cost: '₹4,200', season: 'Nov – Apr', safety: '87%',
    desc: 'Crystal waters and tropical beaches',
  },
  {
    id: 'istanbul', name: 'Istanbul', country: 'Turkey', continent: 'Asia',
    image: U('1541432901042-2d8bd64b4a9b'),
    tag: '🕌', cost: '₹5,500', season: 'Apr – Oct', safety: '85%',
    desc: 'Where East meets West across two continents',
  },
  {
    id: 'maldives', name: 'Maldives', country: 'Maldives', continent: 'Asia',
    image: U('1514282401047-d79a71a590e8'),
    tag: '🪸', cost: '₹18,000', season: 'Nov – Apr', safety: '96%',
    desc: 'Overwater bungalows and crystal lagoons',
  },
  {
    id: 'kathmandu', name: 'Kathmandu', country: 'Nepal', continent: 'Asia',
    image: U('1605640840605-3bbeb647a8f0'),
    tag: '🏔️', cost: '₹2,000', season: 'Oct – Nov', safety: '83%',
    desc: 'Gateway to the Himalayas',
  },

  // ── AMERICAS ─────────────────────────────────────────────────────────
  {
    id: 'newyork', name: 'New York', country: 'USA', continent: 'Americas',
    image: U('1496442226666-8d4d0e62e6e9'),
    tag: '🗽', cost: '₹14,500', season: 'Sep – Nov', safety: '89%',
    desc: 'The city that never sleeps',
  },
  {
    id: 'lasvegas', name: 'Las Vegas', country: 'USA', continent: 'Americas',
    image: U('1542314831-068cd1dbfeeb'),
    tag: '🎰', cost: '₹12,000', season: 'Mar – May', safety: '87%',
    desc: 'Entertainment capital of the world',
  },
  {
    id: 'rio', name: 'Rio de Janeiro', country: 'Brazil', continent: 'Americas',
    image: U('1483729600519-fedd8cd7d9e8'),
    tag: '🎭', cost: '₹6,800', season: 'Dec – Mar', safety: '75%',
    desc: 'Carnival, beaches, and Christ the Redeemer',
  },
  {
    id: 'toronto', name: 'Toronto', country: 'Canada', continent: 'Americas',
    image: U('1517935706615-2717063c2225'),
    tag: '🍁', cost: '₹11,500', season: 'Jun – Sep', safety: '95%',
    desc: 'Multicultural hub on Lake Ontario',
  },
  {
    id: 'miami', name: 'Miami', country: 'USA', continent: 'Americas',
    image: U('1506905925346-21bda4d32df4'),
    tag: '🌴', cost: '₹13,000', season: 'Nov – Apr', safety: '86%',
    desc: 'Art deco beaches and Latin vibes',
  },
  {
    id: 'mexicocity', name: 'Mexico City', country: 'Mexico', continent: 'Americas',
    image: U('1585464231338-e98ea3ab1485'),
    tag: '🌮', cost: '₹5,500', season: 'Nov – Apr', safety: '78%',
    desc: 'Aztec history and world-class cuisine',
  },
  {
    id: 'buenosaires', name: 'Buenos Aires', country: 'Argentina', continent: 'Americas',
    image: U('1612294037637-ec328d0e075e'),
    tag: '💃', cost: '₹5,200', season: 'Sep – Nov', safety: '81%',
    desc: 'Tango, steak, and European elegance',
  },
  {
    id: 'cusco', name: 'Cusco', country: 'Peru', continent: 'Americas',
    image: U('1526392060635-9d6019884377'),
    tag: '🦙', cost: '₹4,200', season: 'May – Sep', safety: '82%',
    desc: 'Inca Empire gateway and Machu Picchu base',
  },
  {
    id: 'vancouver', name: 'Vancouver', country: 'Canada', continent: 'Americas',
    image: U('1559511260-b62f9c5e2a7e'),
    tag: '🏔️', cost: '₹12,500', season: 'Jun – Sep', safety: '96%',
    desc: 'Mountains, ocean, and urban paradise',
  },

  // ── AFRICA ───────────────────────────────────────────────────────────
  {
    id: 'capetown', name: 'Cape Town', country: 'South Africa', continent: 'Africa',
    image: U('1580060839134-75a5edca2e99'),
    tag: '🏔️', cost: '₹5,800', season: 'Nov – Mar', safety: '78%',
    desc: 'Table Mountain and world-class winelands',
  },
  {
    id: 'marrakech', name: 'Marrakech', country: 'Morocco', continent: 'Africa',
    image: U('1597212720450-f4a54e9b1a49'),
    tag: '🧡', cost: '₹4,500', season: 'Mar – May', safety: '84%',
    desc: 'Spice markets, riads, and desert dunes',
  },
  {
    id: 'cairo', name: 'Cairo', country: 'Egypt', continent: 'Africa',
    image: U('1539768942893-daf2d21bef84'),
    tag: '🐪', cost: '₹3,800', season: 'Oct – Apr', safety: '79%',
    desc: 'Pyramids, pharaohs, and the Nile',
  },
  {
    id: 'nairobi', name: 'Nairobi', country: 'Kenya', continent: 'Africa',
    image: U('1611348586840-c2f78f24ade8'),
    tag: '🦁', cost: '₹4,200', season: 'Jun – Oct', safety: '74%',
    desc: 'Safari gateway and vibrant capital',
  },
  {
    id: 'zanzibar', name: 'Zanzibar', country: 'Tanzania', continent: 'Africa',
    image: U('1547978501-5c9f0576a64a'),
    tag: '🌊', cost: '₹5,200', season: 'Jun – Oct', safety: '82%',
    desc: 'Spice island with pristine white beaches',
  },

  // ── OCEANIA ──────────────────────────────────────────────────────────
  {
    id: 'sydney', name: 'Sydney', country: 'Australia', continent: 'Oceania',
    image: U('1506973035872-a4ec16b8e8d9'),
    tag: '🦘', cost: '₹10,200', season: 'Sep – Nov', safety: '95%',
    desc: 'Opera House, harbour, and golden beaches',
  },
  {
    id: 'melbourne', name: 'Melbourne', country: 'Australia', continent: 'Oceania',
    image: U('1514395462011-5e32dbbce55f'),
    tag: '☕', cost: '₹9,800', season: 'Oct – Apr', safety: '96%',
    desc: 'Coffee culture and creative arts scene',
  },
  {
    id: 'auckland', name: 'Auckland', country: 'New Zealand', continent: 'Oceania',
    image: U('1507699622143-9d5d1e82a57b'),
    tag: '🌿', cost: '₹9,500', season: 'Dec – Feb', safety: '97%',
    desc: 'Volcanic landscape and Maori culture',
  },
  {
    id: 'queenstown', name: 'Queenstown', country: 'New Zealand', continent: 'Oceania',
    image: U('1506905925346-21bda4d32df4'),
    tag: '🎿', cost: '₹10,500', season: 'Dec – Feb', safety: '98%',
    desc: 'Adventure capital of the world',
  },

  // ── MIDDLE EAST ──────────────────────────────────────────────────────
  {
    id: 'abudhabi', name: 'Abu Dhabi', country: 'UAE', continent: 'Middle East',
    image: U('1503631285924-e58f77ae49e8'),
    tag: '🕌', cost: '₹10,500', season: 'Nov – Mar', safety: '98%',
    desc: 'Grand Mosque and desert adventures',
  },
  {
    id: 'muscat', name: 'Muscat', country: 'Oman', continent: 'Middle East',
    image: U('1532375810709-75b1da03537a'),
    tag: '🐠', cost: '₹7,500', season: 'Oct – Apr', safety: '96%',
    desc: 'Dramatic fjords and hidden wadis',
  },

  // ── SOUTH/CENTRAL ASIA ───────────────────────────────────────────────
  {
    id: 'colombo', name: 'Colombo', country: 'Sri Lanka', continent: 'Asia',
    image: U('1566552881360-0905ca73e4e1'),
    tag: '🍵', cost: '₹3,200', season: 'Dec – Mar', safety: '85%',
    desc: 'Tea trails, temples, and pristine shores',
  },
  {
    id: 'hanoi', name: 'Hanoi', country: 'Vietnam', continent: 'Asia',
    image: U('1528360983277-13d401cdc186'),
    tag: '🍜', cost: '₹2,800', season: 'Oct – Apr', safety: '88%',
    desc: 'Ancient Old Quarter and street pho',
  },
  {
    id: 'hoian', name: 'Hoi An', country: 'Vietnam', continent: 'Asia',
    image: U('1573748494907-12e7eba9a893'),
    tag: '🏮', cost: '₹2,500', season: 'Feb – Jul', safety: '92%',
    desc: 'Lantern-lit ancient town and tailor shops',
  },
  {
    id: 'kualalumpur', name: 'Kuala Lumpur', country: 'Malaysia', continent: 'Asia',
    image: U('1596422846543-b3fc9ea9a44e'),
    tag: '🌆', cost: '₹4,800', season: 'May – Jul', safety: '88%',
    desc: 'Petronas Towers and amazing hawker food',
  },
  {
    id: 'dhaka', name: 'Kathmandu', country: 'Nepal', continent: 'Asia',
    image: U('1544735716-ea4e7b12f7a1'),
    tag: '⛩️', cost: '₹1,800', season: 'Oct – Nov', safety: '81%',
    desc: 'Ancient pagodas and Himalayan views',
  },

  // ── CENTRAL EUROPE ───────────────────────────────────────────────────
  {
    id: 'dubrovnik', name: 'Dubrovnik', country: 'Croatia', continent: 'Europe',
    image: U('1555990538-1ac5c80cd935'),
    tag: '🏛️', cost: '₹6,200', season: 'May – Sep', safety: '97%',
    desc: 'Game of Thrones city on the Adriatic',
  },
  {
    id: 'reykjavik', name: 'Reykjavik', country: 'Iceland', continent: 'Europe',
    image: U('1473580544434-8250ec7f0411'),
    tag: '🌌', cost: '₹14,000', season: 'Jun – Aug', safety: '99%',
    desc: 'Northern Lights and geothermal wonders',
  },
  {
    id: 'porto', name: 'Porto', country: 'Portugal', continent: 'Europe',
    image: U('1555881400-74d7acaacd2b'),
    tag: '🍷', cost: '₹5,200', season: 'Apr – Sep', safety: '95%',
    desc: 'Wine cellars and azulejo-tiled facades',
  },
];

export const CONTINENTS = [...new Set(WORLD_DESTINATIONS.map(d => d.continent))];
