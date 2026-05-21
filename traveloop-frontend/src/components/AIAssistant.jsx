import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiSend, FiX, FiInfo, FiTrash2 } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { fetchChatHistory, sendChatMessage, clearChatHistory } from '@/store/slices/aiSlice';

// Lazy-load react-markdown so a load failure doesn't crash the whole app
const ReactMarkdown = lazy(() =>
  import('react-markdown').catch(() => ({
    default: ({ children }) => <span>{children}</span>
  }))
);

export default function AIAssistant() {
  const dispatch = useDispatch();
  const location = useLocation();
  
  const { chatHistory, chatStatus } = useSelector((state) => state.ai);
  const { trips } = useSelector((state) => state.trips);
  const { user } = useSelector((state) => state.auth);
  
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const scrollRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isOpen]);

  // Load chat history when chat is opened (only if authenticated)
  useEffect(() => {
    if (isOpen && user) {
      dispatch(fetchChatHistory());
    }
  }, [dispatch, isOpen, user]);

  // Extract active trip details if the user is currently viewing/building a trip
  const activeTripContext = (() => {
    const match = location.pathname.match(/\/trip\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      const tripId = match[1];
      const activeTrip = (trips || []).find(t => t._id === tripId || t.id === tripId);
      if (activeTrip) {
        return {
          tripName: activeTrip.name,
          startDate: activeTrip.startDate,
          endDate: activeTrip.endDate,
          stopsCount: activeTrip.stops?.length || 0,
          budgetLimit: activeTrip.budgetLimit,
          stops: activeTrip.stops?.map(s => `${s.city}, ${s.country}`) || []
        };
      }
    }
    return null;
  })();

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear your chat history?")) {
      dispatch(clearChatHistory());
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || chatStatus === 'loading') return;

    const userMsg = message.trim();
    setMessage('');

    const context = activeTripContext ? { activeTrip: activeTripContext } : {};
    dispatch(sendChatMessage({ message: userMsg, context }));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 h-[550px] w-80 overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 sm:w-96 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-600 p-4 text-white">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-white/20 animate-pulse">
                  <FiInfo className="text-sm" />
                </div>
                <div>
                  <span className="font-bold block text-sm sm:text-base leading-none">Traveloop AI</span>
                  <span className="text-[10px] text-white/80">Premium Travel Companion</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {user && chatHistory.length > 0 && (
                  <button 
                    onClick={handleClearChat} 
                    title="Clear Chat History"
                    className="rounded-full p-1.5 hover:bg-white/10 transition text-white/90 hover:text-white"
                  >
                    <FiTrash2 />
                  </button>
                )}
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="rounded-full p-1.5 hover:bg-white/10 transition"
                >
                  <FiX />
                </button>
              </div>
            </div>

            {/* Context Badge */}
            {activeTripContext && (
              <div className="bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 px-4 py-1.5 text-xs border-b border-teal-500/15 flex items-center justify-between">
                <span className="truncate">Context: Active Trip <b>{activeTripContext.tripName}</b></span>
                <span className="shrink-0 bg-teal-500 text-white rounded-full px-1.5 py-0.5 text-[8px] font-bold">ACTIVE</span>
              </div>
            )}

            {/* Message Area */}
            <div 
              ref={scrollRef} 
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide dark:bg-slate-950/40"
            >
              {!user ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
                  <div className="p-4 rounded-full bg-gradient-to-br from-teal-500/10 to-indigo-600/10 dark:from-teal-500/20 dark:to-indigo-600/20 border border-teal-500/20">
                    <FiMessageSquare className="text-4xl text-teal-500 animate-pulse" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white">AI Travel Companion</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[240px] leading-relaxed">
                    Log in to unlock custom itineraries, smart packing lists, budget planning, and 24/7 personalized travel assistance.
                  </p>
                  <a
                    href="/login"
                    className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-semibold text-white bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-600 shadow-lg shadow-teal-500/25 hover:opacity-95 active:scale-95 transition-all duration-200"
                  >
                    Log In / Sign Up
                  </a>
                </div>
              ) : chatHistory.length === 0 ? (
                <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-xs">
                  <FiMessageSquare className="mx-auto text-3xl mb-2 opacity-50" />
                  Ask me anything about flights, hotel picks, or itinerary optimizations!
                </div>
              ) : (
                chatHistory.map((msg, i) => (
                  <div key={i} className="space-y-1">
                    {/* User message */}
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-[1.25rem] rounded-tr-none bg-gradient-to-r from-teal-500 to-blue-500 px-4 py-2.5 text-sm text-white shadow-soft">
                        {msg.message}
                      </div>
                    </div>
                    {/* AI reply */}
                    {msg.reply && (
                      <div className="flex justify-start mt-1">
                        <div className="max-w-[85%] rounded-[1.25rem] rounded-tl-none bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-4 py-2.5 text-sm shadow-sm prose dark:prose-invert leading-relaxed break-words">
                          {msg.reply === '...' ? (
                            <div className="flex gap-1.5 items-center py-1">
                              <div className="h-2 w-2 animate-bounce rounded-full bg-teal-500"></div>
                              <div className="h-2 w-2 animate-bounce rounded-full bg-teal-500 delay-75"></div>
                              <div className="h-2 w-2 animate-bounce rounded-full bg-teal-500 delay-150"></div>
                            </div>
                          ) : (
                            <Suspense fallback={<span>{msg.reply}</span>}>
                              <div className="markdown-content">
                                <ReactMarkdown>{msg.reply}</ReactMarkdown>
                              </div>
                            </Suspense>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Form Input */}
            <form 
              onSubmit={handleSend} 
              className="border-t border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex gap-2">
                <input
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={user ? "Ask about hotels, packing, weather..." : "Please log in to chat..."}
                  className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:focus:bg-slate-950 transition"
                  disabled={chatStatus === 'loading' || !user}
                />
                <button 
                  type="submit" 
                  disabled={chatStatus === 'loading' || !message.trim() || !user} 
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-teal-500 to-blue-500 text-white shadow-md transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <FiSend />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-teal-500 via-blue-500 to-indigo-600 text-2xl text-white shadow-lg transition duration-300 hover:scale-110 active:scale-95 relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
        <FiMessageSquare className="relative z-10" />
      </button>
    </div>
  );
}
