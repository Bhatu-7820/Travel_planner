import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGlobe, FiArrowRight } from 'react-icons/fi';

const ads = [
  {
    id: 1,
    title: "Summer in Santorini",
    subtitle: "Get up to 30% discount on luxury stays",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1200",
    tag: "Exclusive Deal"
  },
  {
    id: 2,
    title: "Adventure in Bali",
    subtitle: "Book now for the ultimate surf & soul experience",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200",
    tag: "Trending Destination"
  },
  {
    id: 3,
    title: "Swiss Alps Escape",
    subtitle: "Planning tools now include vehicle rentals",
    image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?q=80&w=1200",
    tag: "New Feature"
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
    <div className="relative h-80 w-full overflow-hidden rounded-[2.5rem] border border-white/20 dark:border-white/10 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)] group bg-white/10 dark:bg-slate-950/20 backdrop-blur-xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          {/* Breathing image scale-out animation */}
          <motion.img
            key={`img-${idx}`}
            src={ads[idx].image}
            alt={ads[idx].title}
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.75 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full w-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          {/* Visual gradient overlay for clean high-contrast reading */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/30 to-transparent dark:from-slate-950/75 dark:via-slate-950/35 dark:to-transparent"></div>
          
          <div className="absolute inset-0 flex items-center p-8 sm:p-12">
            {/* Sliding text container */}
            <motion.div
              initial={{ x: -45, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
              className="relative z-10 max-w-lg rounded-[2rem] bg-white/60 dark:bg-slate-950/50 border border-white/30 dark:border-white/10 backdrop-blur-xl p-6 sm:p-8 shadow-2xl hover:border-cyan-500/20 transition-all duration-300"
            >
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/10 dark:bg-teal-500/20 border border-teal-500/20 dark:border-teal-500/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-300 mb-4 font-mono">
                <FiGlobe className="animate-pulse" />
                {ads[idx].tag}
              </span>
              <h3 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">{ads[idx].title}</h3>
              <p className="mt-3 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300">{ads[idx].subtitle}</p>
              <button className="mt-6 flex items-center gap-2 rounded-full bg-slate-900 dark:bg-white px-6 py-3 text-xs font-bold text-white dark:text-slate-900 shadow-xl transition-all hover:bg-cyan-600 dark:hover:bg-cyan-400 hover:scale-105 active:scale-[0.98]">
                Explore Now <FiArrowRight />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-6 right-8 flex gap-2 z-20">
        {ads.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? 'w-8 bg-cyan-500 dark:bg-cyan-400' : 'w-2 bg-slate-400/40 dark:bg-white/40 hover:bg-cyan-500 dark:hover:bg-cyan-400'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
