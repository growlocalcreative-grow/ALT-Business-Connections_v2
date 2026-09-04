import { Calendar as CalendarIcon, Clock, MapPin, X, Phone, Mail, ExternalLink, CalendarPlus, Share2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { AppEvent } from "../types";

export const EventCalendar = () => {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<AppEvent | null>(null);

  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("startTime", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as AppEvent)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const getGoogleCalendarUrl = (event: AppEvent) => {
    const baseUrl = "https://www.google.com/calendar/render?action=TEMPLATE";
    const text = encodeURIComponent(event.title);
    const dates = `${event.startTime}/${event.endTime}`;
    const details = encodeURIComponent(`${event.description}\n\nHost: ${event.host}\nEmail: ${event.hostEmail}\nPhone: ${event.hostPhone}`);
    const location = encodeURIComponent(event.location);
    return `${baseUrl}&text=${text}&dates=${dates}&details=${details}&location=${location}`;
  };

  const handleShare = async (event: AppEvent) => {
    const shareData = {
      title: event.title,
      text: `${event.title} on ${event.date} at ${event.location}. ${event.description}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        alert("Event details copied to clipboard!");
      } catch (err) {
        console.error("Clipboard error:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-3">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white border border-[#d4af37]/20 p-6 rounded-2xl hover:border-[#d4af37] transition-all duration-300 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] bg-[#d4af37]/10 px-3 py-1 rounded-full">
                {event.category}
              </span>
              <CalendarIcon className="w-5 h-5 text-[#1a3a3a] opacity-40" />
            </div>
            
            <h3 className="text-xl font-bold text-[#1a3a3a] mb-4 group-hover:text-[#d4af37] transition-colors">
              {event.title}
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center text-slate-600 text-sm">
                <CalendarIcon className="w-4 h-4 mr-3 text-[#d4af37]" />
                {event.date}
              </div>
              <div className="flex items-center text-slate-600 text-sm">
                <Clock className="w-4 h-4 mr-3 text-[#d4af37]" />
                {event.time}
              </div>
              <div className="flex items-center text-slate-600 text-sm">
                <MapPin className="w-4 h-4 mr-3 text-[#d4af37]" />
                {event.location}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <button 
                onClick={() => setSelectedEvent(event)}
                className="text-sm font-bold text-[#1a3a3a] hover:underline flex items-center"
              >
                Learn More
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="ml-2"
                >
                  →
                </motion.span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="absolute inset-0 bg-[#1a3a3a]/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37] mb-2 block">
                      {selectedEvent.category}
                    </span>
                    <h2 className="text-3xl font-bold text-[#1a3a3a] leading-tight">
                      {selectedEvent.title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleShare(selectedEvent)}
                      className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-[#d4af37]"
                      title="Share Event"
                    >
                      <Share2 className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => setSelectedEvent(null)}
                      className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                      <X className="w-6 h-6 text-slate-400" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-[#fbfaf8] p-4 rounded-2xl border border-[#d4af37]/10">
                    <div className="flex items-center text-[#d4af37] mb-1">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Date</span>
                    </div>
                    <p className="text-sm font-bold text-[#1a3a3a]">{selectedEvent.date}</p>
                  </div>
                  <div className="bg-[#fbfaf8] p-4 rounded-2xl border border-[#d4af37]/10">
                    <div className="flex items-center text-[#d4af37] mb-1">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Time</span>
                    </div>
                    <p className="text-sm font-bold text-[#1a3a3a]">{selectedEvent.time}</p>
                  </div>
                </div>

                <div className="space-y-6 mb-8">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-[#1a3a3a]/5 flex items-center justify-center shrink-0 mr-4">
                      <MapPin className="w-5 h-5 text-[#d4af37]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1a3a3a] uppercase tracking-wider mb-1">Location</h4>
                      <p className="text-slate-600">{selectedEvent.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-[#1a3a3a]/5 flex items-center justify-center shrink-0 mr-4">
                      <CalendarPlus className="w-5 h-5 text-[#d4af37]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1a3a3a] uppercase tracking-wider mb-1">Description</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{selectedEvent.description}</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-[#1a3a3a] uppercase tracking-wider mb-4">Host Contact</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <a 
                        href={`mailto:${selectedEvent.hostEmail}`}
                        className="flex items-center text-slate-600 text-sm hover:text-[#d4af37] transition-colors"
                      >
                        <Mail className="w-4 h-4 mr-3 text-[#d4af37]" />
                        {selectedEvent.hostEmail}
                      </a>
                      <a 
                        href={`tel:${selectedEvent.hostPhone}`}
                        className="flex items-center text-slate-600 text-sm hover:text-[#d4af37] transition-colors"
                      >
                        <Phone className="w-4 h-4 mr-3 text-[#d4af37]" />
                        {selectedEvent.hostPhone}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <a 
                    href={getGoogleCalendarUrl(selectedEvent)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#d4af37] hover:bg-[#c09d30] text-white py-4 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg shadow-[#d4af37]/20"
                  >
                    <CalendarPlus className="w-5 h-5 mr-2" />
                    Add to Calendar
                  </a>
                  <button 
                    onClick={() => handleShare(selectedEvent)}
                    className="flex-1 border-2 border-[#1a3a3a]/10 hover:border-[#1a3a3a] text-[#1a3a3a] py-4 rounded-xl font-bold transition-all flex items-center justify-center"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Share Event
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};


