import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { Search, Plus, Phone, Mail, Globe, Share2, MessageCircle, BadgeCheck, X, ArrowRight, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import React, { useEffect, useState } from "react";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { MembershipModal } from "./MembershipModal";
import { Business } from "../types";
import { Button, Card, Section } from "./UI";

const BusinessDetailModal = ({ business, isOpen, onClose }: { business: Business | null; isOpen: boolean; onClose: () => void }) => {
  if (!business) return null;

  const formatPhone = (value: string) => {
    if (!value) return "";
    const cleaned = value.replace(/[^\d]/g, "");
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return value;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#1a3a3a]/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-y-auto overflow-x-hidden slim-scrollbar"
          >
            <div className="relative h-32 sm:h-48 bg-[#1a3a3a] flex items-center justify-center flex-shrink-0">
              <div className="absolute inset-0 opacity-10 overflow-hidden">
                <div className="grid grid-cols-8 gap-4 p-4">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <div key={i} className="w-12 h-12 rounded-full bg-[#d4af37]" />
                  ))}
                </div>
              </div>
              <div className="relative z-10 w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-2xl shadow-xl border-4 border-white overflow-hidden transform translate-y-10 sm:translate-y-12">
                {business.logo ? (
                  <img src={business.logo} alt={business.name} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="w-10 h-10 sm:w-16 sm:h-16 text-[#d4af37]" />
                  </div>
                )}
              </div>
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all backdrop-blur-sm z-20"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="p-6 sm:p-10 pt-12 sm:pt-16">
              <div className="flex flex-col gap-2 mb-6">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37] bg-[#d4af37]/5 px-3 py-1.5 rounded-full border border-[#d4af37]/10">
                    {business.category}
                  </span>
                  {business.isABCClubMember && (
                    <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-[#d4af37] bg-[#d4af37]/10 px-3 py-1.5 rounded-full border border-[#d4af37]/20">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      ABC CLUB MEMBER
                    </div>
                  )}
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold text-[#1a3a3a] font-serif leading-tight">{business.name}</h2>
                <p className="text-base sm:text-lg text-slate-500 font-medium italic">Owned by {business.owner}</p>
              </div>

              <div className="prose prose-slate max-w-none mb-8 sm:mb-10">
                <p className="text-slate-600 leading-relaxed text-base sm:text-lg whitespace-pre-wrap">
                  {business.description}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-0">
                <a 
                  href={`tel:${business.phone}`}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#fbfaf8] border border-slate-100 hover:border-[#d4af37]/30 hover:bg-white hover:shadow-md transition-all group"
                >
                  <div className="p-3 rounded-full bg-white text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-white transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Call</span>
                </a>
                {business.isTextEnabled && (
                  <a 
                    href={`sms:${business.phone}?body=Hi ${business.owner}, I found your business ${business.name} in the ALT Business Directory!`}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#fbfaf8] border border-slate-100 hover:border-[#d4af37]/30 hover:bg-white hover:shadow-md transition-all group"
                  >
                    <div className="p-3 rounded-full bg-white text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-white transition-colors">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Text</span>
                  </a>
                )}
                <a 
                  href={`mailto:${business.email}?subject=Inquiry from ALT Business Directory`}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#fbfaf8] border border-slate-100 hover:border-[#d4af37]/30 hover:bg-white hover:shadow-md transition-all group"
                >
                  <div className="p-3 rounded-full bg-white text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-white transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</span>
                </a>
                <a 
                  href={business.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#fbfaf8] border border-slate-100 hover:border-[#d4af37]/30 hover:bg-white hover:shadow-md transition-all group"
                >
                  <div className="p-3 rounded-full bg-white text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-white transition-colors">
                    <Globe className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Web</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const DirectoryPage = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [displayLimit, setDisplayLimit] = useState(12);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  useEffect(() => {
    const q = query(collection(db, "businesses"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Business[];
      setBusinesses(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "businesses");
    });
    return unsubscribe;
  }, []);

  const categories = ["All", ...Array.from(new Set(businesses.map(b => b.category)))].sort();

  const filteredBusinesses = businesses.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || b.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const visibleBusinesses = filteredBusinesses.slice(0, displayLimit);

  const handleShare = async (e: React.MouseEvent, business: Business) => {
    e.stopPropagation();
    const shareData = {
      title: business.name,
      text: `Check out ${business.name} in the ALT Business Directory! ${business.description.slice(0, 100)}...`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        alert("Business details copied to clipboard!");
      } catch (err) {
        console.error("Clipboard error:", err);
      }
    }
  };

  const formatPhone = (value: string) => {
    if (!value) return "";
    const cleaned = value.replace(/[^\d]/g, "");
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return value;
  };

  return (
    <div className="pt-24 min-h-screen bg-[#fbfaf8]">
      <Section
        title="ALT Business Directory"
        subtitle="Supporting our neighbors and home-based services in Auburn Lake Trails."
      >
        <div className="flex flex-col gap-8 mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search categories, services, or names..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#d4af37]/20 focus:ring-2 focus:ring-[#d4af37] outline-none bg-white shadow-sm"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setDisplayLimit(12);
                }}
              />
            </div>
            <Button variant="primary" onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 w-full md:w-auto justify-center">
              <Plus className="w-5 h-5" />
              Add My Business
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pb-4 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setDisplayLimit(12);
                }}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-[#1a3a3a] text-white shadow-md"
                    : "bg-white text-slate-500 border border-slate-100 hover:border-[#d4af37]/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
            <span>Showing {Math.min(displayLimit, filteredBusinesses.length)} of {filteredBusinesses.length} Results</span>
            {searchTerm || selectedCategory !== "All" ? (
              <button 
                onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
                className="text-[#d4af37] hover:underline"
              >
                Clear Filters
              </button>
            ) : null}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {visibleBusinesses.map((business) => (
              <motion.div
                key={business.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group cursor-pointer"
                onClick={() => setSelectedBusiness(business)}
              >
                <Card className="h-full flex flex-col border-[#d4af37]/10 group-hover:border-[#d4af37] transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                  <div className="flex flex-col gap-4 mb-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37] bg-[#d4af37]/5 px-2 py-1 rounded w-fit">
                          {business.category}
                        </span>
                        {business.isABCClubMember && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-[#d4af37] bg-[#d4af37]/10 px-2 py-1 rounded border border-[#d4af37]/20">
                            <BadgeCheck className="w-3 h-3" />
                            ABC
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={(e) => handleShare(e, business)}
                        className="text-slate-300 hover:text-[#d4af37] transition-colors p-1"
                        title="Share Business"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="w-16 h-16 rounded-xl bg-[#fbfaf8] border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {business.logo ? (
                        <img src={business.logo} alt={business.name} className="w-full h-full object-contain" />
                      ) : (
                        <Building2 className="w-8 h-8 text-slate-200" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-[#1a3a3a] leading-tight mb-1">{business.name}</h3>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Owner: {business.owner}</p>
                    </div>
                  </div>

                  <div className="flex-grow">
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-4">
                      {business.description}
                    </p>
                    <button className="flex items-center gap-1 text-xs font-bold text-[#d4af37] hover:gap-2 transition-all uppercase tracking-widest">
                      View Profile <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-6 mt-6 border-t border-slate-50">
                    <a 
                      href={`tel:${business.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-[#d4af37] hover:text-white transition-all duration-200"
                      title={`Call ${formatPhone(business.phone)}`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                    {business.isTextEnabled && (
                      <a 
                        href={`sms:${business.phone}?body=Hi ${business.owner}, I found your business ${business.name} in the ALT Business Directory!`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-[#d4af37] hover:text-white transition-all duration-200"
                        title={`Text ${formatPhone(business.phone)}`}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <a 
                      href={`mailto:${business.email}?subject=Inquiry from ALT Business Directory`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-[#d4af37] hover:text-white transition-all duration-200"
                      title={`Email ${business.email}`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                    <a 
                      href={business.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-[#d4af37] hover:text-white transition-all duration-200"
                      title="Visit Website"
                    >
                      <Globe className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {displayLimit < filteredBusinesses.length && (
          <div className="mt-16 flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => setDisplayLimit(prev => prev + 12)}
              className="px-12 py-4 text-lg font-bold border-[#d4af37]/30 text-[#1a3a3a] hover:bg-[#d4af37]/5"
            >
              Show More Listings
            </Button>
          </div>
        )}

        {filteredBusinesses.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[#d4af37]/30">
            <p className="text-slate-400">No neighbors found matching your search. Be the first to join!</p>
          </div>
        )}
      </Section>

      <MembershipModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add My Business"
        defaultJoinClub={false}
        showJoinClubCheckbox={true}
        defaultDirectory={true}
        showDirectoryCheckbox={false}
      />

      <BusinessDetailModal 
        isOpen={!!selectedBusiness}
        onClose={() => setSelectedBusiness(null)}
        business={selectedBusiness}
      />
    </div>
  );
};
