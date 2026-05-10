import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiSend, FiX, FiMinus, FiInfo } from 'react-icons/fi';
import api from '@/services/api';
import { getErrorMessage } from '@/utils/helpers';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([
    { role: 'assistant', content: 'Hello! I am your Traveloop AI. How can I help you plan your dream trip today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat]);

  const send = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMsg = message.trim();
    setMessage('');
    setChat(p => [...p, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await api.post('/api/ai/chat', { message: userMsg });
      setChat(p => [...p, { role: 'assistant', content: res.data.reply }]);
    } catch (error) {
      setChat(p => [...p, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now. " + getErrorMessage(error) }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 h-[500px] w-80 overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 sm:w-96"
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-teal-500 to-blue-500 p-4 text-white">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-white/20">
                  <FiInfo className="text-sm" />
                </div>
                <span className="font-bold">Traveloop AI</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setIsOpen(false)} className="rounded-full p-1.5 hover:bg-white/10">
                  <FiX />
                </button>
              </div>
            </div>

            <div ref={scrollRef} className="flex h-[360px] flex-col gap-3 overflow-y-auto p-4 scrollbar-hide">
              {chat.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    msg.role === 'user' 
                    ? 'bg-teal-500 text-white' 
                    : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-slate-100 px-4 py-2 dark:bg-slate-800">
                    <div className="flex gap-1">
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"></div>
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 delay-75"></div>
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={send} className="absolute bottom-0 left-0 right-0 border-t border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex gap-2">
                <input
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Ask about destinations, budget..."
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-950"
                />
                <button type="submit" disabled={loading} className="grid h-10 w-10 place-items-center rounded-xl bg-teal-500 text-white shadow-soft">
                  <FiSend />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-teal-500 to-blue-500 text-2xl text-white shadow-lg transition hover:scale-110 active:scale-95"
      >
        <FiMessageSquare />
      </button>
    </div>
  );
}
