import { Quote, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Testimonial } from "../types";

export const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "testimonials"), orderBy("order", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setTestimonials(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Testimonial)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" />
      </div>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={testimonial.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="bg-white border border-[#d4af37]/10 p-8 rounded-2xl shadow-sm relative"
        >
          <Quote className="absolute top-4 right-4 w-8 h-8 text-[#d4af37]/20" />
          <p className="text-slate-600 mb-8 italic relative z-10">"{testimonial.content}"</p>
          <div className="flex items-center">
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full border-2 border-[#d4af37] mr-4 object-cover"
              referrerPolicy="no-referrer"
            />
            <div>
              <h4 className="font-bold text-[#1a3a3a] text-sm">{testimonial.name}</h4>
              <p className="text-xs text-slate-400">{testimonial.role}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
