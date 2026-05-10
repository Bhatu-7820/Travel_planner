import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ads = [
  {
    id: 1,
    title: "Summer in Santorini",
    subtitle: "Get up to 30% discount on luxury stays",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1200",
    color: "from-blue-500 to-teal-400"
  },
  {
    id: 2,
    title: "Adventure in Bali",
    subtitle: "Book now for the ultimate surf & soul experience",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200",
    color: "from-orange-500 to-red-400"
  },
  {
    id: 3,
    title: "Swiss Alps Escape",
    subtitle: "Planning tools now include vehicle rentals",
    image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?q=80&w=1200",
    color: "from-indigo-600 to-purple-500"
  }
];

export default function AdSection() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx(p => (p + 1) % ads.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-64 w-full overflow-hidden rounded-[2.5rem] shadow-soft">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="absolute inset-0"
        >
          <img src={ads[idx].image} alt={ads[idx].title} className="h-full w-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-r ${ads[idx].color} opacity-60`}></div>
          <div className="absolute inset-0 flex flex-col justify-center p-8 text-white">
            <h3 className="text-3xl font-black">{ads[idx].title}</h3>
            <p className="mt-2 text-lg font-medium opacity-90">{ads[idx].subtitle}</p>
            <button className="mt-6 w-fit rounded-full bg-white px-6 py-2.5 text-sm font-bold text-slate-900 shadow-xl transition hover:scale-105">
              Explore Now
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {ads.map((_, i) => (
          <div key={i} className={`h-1.5 w-8 rounded-full transition-all ${i === idx ? 'bg-white' : 'bg-white/30'}`}></div>
        ))}
      </div>
    </div>
  );
}
