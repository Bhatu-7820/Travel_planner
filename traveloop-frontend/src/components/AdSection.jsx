import { useState, useEffect } from 'react';
import { memo } from 'react';
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

function AdSection() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx(p => (p + 1) % ads.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="responsive-card group relative h-72 w-full overflow-hidden border border-white/20 bg-white/10 shadow-soft backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)] dark:border-white/10 dark:bg-slate-950/20 sm:h-80">
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
            loading="lazy"
            decoding="async"
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.75 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full w-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          {/* Visual gradient overlay for clean high-contrast reading */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/30 to-transparent dark:from-slate-950/75 dark:via-slate-950/35 dark:to-transparent"></div>
          
          <div className="absolute inset-0 flex items-end p-4 sm:items-center sm:p-8 lg:p-12">
            {/* Sliding text container */}
            <motion.div
              initial={{ x: -45, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
              className="relative z-10 max-w-lg rounded-2xl border border-white/30 bg-white/70 p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/20 dark:border-white/10 dark:bg-slate-950/55 sm:rounded-[2rem] sm:p-8"
            >
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/10 dark:bg-teal-500/20 border border-teal-500/20 dark:border-teal-500/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-300 mb-4 font-mono">
                <FiGlobe className="animate-pulse" />
                {ads[idx].tag}
              </span>
              <h3 className="text-xl font-black leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl">{ads[idx].title}</h3>
              <p className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-300 sm:mt-3 sm:text-base">{ads[idx].subtitle}</p>
              <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-xs font-bold text-white shadow-xl transition-all hover:scale-105 hover:bg-cyan-600 active:scale-[0.98] dark:bg-white dark:text-slate-900 dark:hover:bg-cyan-400 sm:mt-6 sm:w-auto">
                Explore Now <FiArrowRight />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-4 right-5 z-20 flex gap-2 sm:bottom-6 sm:right-8">
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

export default memo(AdSection);
