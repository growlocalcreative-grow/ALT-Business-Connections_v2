import { 
  Calendar, Heart, Menu, X, LayoutGrid, ChevronDown, ChevronUp, Users, Shield,
  Megaphone, Store, Lightbulb, Zap, Award, Globe, Briefcase, Handshake, HelpCircle, BadgeCheck
} from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { ContactForm } from "./components/ContactForm";
import { DirectoryPage } from "./components/DirectoryPage";
import { EventCalendar } from "./components/EventCalendar";
import { Testimonials } from "./components/Testimonials";
import { MembershipModal } from "./components/MembershipModal";
import { PWAInstallButton } from "./components/PWAInstallButton";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { AdminDashboard } from "./components/AdminDashboard";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { TermsOfService } from "./components/TermsOfService";
import { MobileThumbNav } from "./components/MobileThumbNav";
import { Button, Card, Section } from "./components/UI";
import { cn } from "./lib/utils";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./lib/firebase";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Small delay to ensure the component is mounted and rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  
  return null;
};

const AnnouncementBanner = ({ text }: { text?: string }) => {
  if (!text) return null;
  return (
    <div className="bg-[#d4af37] text-white py-2 px-6 text-center text-xs font-bold uppercase tracking-widest z-[60] relative">
      {text}
    </div>
  );
};

const Navigation = ({ onJoinClick }: { onJoinClick: () => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();
  
  const headerBg = useTransform(scrollY, [0, 50], ["rgba(251, 250, 248, 0)", "rgba(251, 250, 248, 0.9)"]);
  const headerBorder = useTransform(scrollY, [0, 50], ["rgba(212, 175, 55, 0)", "rgba(212, 175, 55, 0.1)"]);

  const navLinks = [
    { name: "About", href: "/#about" },
    { name: "Community", href: "/#community" },
    { name: "Events", href: "/#events" },
    { name: "Directory", href: "/directory", icon: LayoutGrid },
  ];

  return (
    <motion.nav
      style={{ backgroundColor: headerBg, borderBottom: `1px solid ${headerBorder}` }}
      className="px-6 py-4 transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/ABC Logo.png" alt="ALT Business Connections Logo" className="h-10 w-auto object-contain" referrerPolicy="no-referrer" />
          <span className="font-bold text-xl text-[#1a3a3a] hidden sm:block tracking-tight uppercase">
            ALT <span className="text-[#d4af37]">Business</span> Connections
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "text-sm font-bold uppercase tracking-widest flex items-center gap-2 transition-colors",
                (location.pathname === link.href || (link.href.startsWith("/#") && location.pathname === "/" && location.hash === "#" + link.href.split("#")[1])) 
                  ? "text-[#d4af37]" 
                  : "text-[#1a3a3a]/70 hover:text-[#1a3a3a]"
              )}
            >
              {link.icon && <link.icon className="w-4 h-4" />}
              {link.name}
            </Link>
          ))}
          <PWAInstallButton />
          <Button variant="primary" className="text-sm py-2 px-6" onClick={onJoinClick}>
            Join Now
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-[#1a3a3a]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-[#fbfaf8] border-b border-[#d4af37]/10 p-6 flex flex-col gap-4 md:hidden shadow-xl"
        >
          {navLinks.map((link) => (
            link.href.startsWith("/#") ? (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-bold text-[#1a3a3a] uppercase tracking-wider"
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "text-lg font-bold uppercase tracking-wider",
                  location.pathname === link.href ? "text-[#d4af37]" : "text-[#1a3a3a]"
                )}
              >
                {link.name}
              </Link>
            )
          ))}
          <div className="pt-2 flex justify-center">
            <PWAInstallButton />
          </div>
          <Button variant="primary" className="w-full" onClick={onJoinClick}>
            Join Now
          </Button>
        </motion.div>
      )}
    </motion.nav>
  );
};

const HomePage = ({ onJoinClick, settings }: { onJoinClick: () => void; settings: any }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Geometric Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full -mr-48 -mt-24 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#1a3a3a]/5 rounded-full -ml-24 -mb-24 blur-2xl pointer-events-none" />
        <div className="absolute top-1/4 left-10 w-px h-64 bg-gradient-to-b from-transparent via-[#d4af37]/30 to-transparent rotate-12" />
        <div className="absolute top-1/3 right-20 w-px h-96 bg-gradient-to-b from-transparent via-[#1a3a3a]/20 to-transparent -rotate-12" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 rounded-full bg-[#d4af37]/10 text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-6">
              Founded by Annette Gregg • Rooted in ALT
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-[#1a3a3a] leading-[1.1] mb-8">
              {settings?.heroTitle || "Rooted in ALT. Growing Together."}
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
              {settings?.heroSubtitle || "A neighborly cooperative for home-based and small business owners in Auburn Lake Trails. Built on hard work, dedication, and community spirit."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" onClick={onJoinClick}>Join Our Cooperative</Button>
              <Link to="/directory">
                <Button variant="secondary" className="w-full sm:w-auto">Browse Directory</Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 w-full aspect-square rounded-full border-4 border-[#d4af37] p-4 overflow-hidden shadow-2xl bg-white">
              <img
                src={settings?.heroImage || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop"}
                alt="Local Business Collaboration"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Floating Graphic Accents */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 w-24 h-24 bg-[#1a3a3a] rounded-xl flex items-center justify-center shadow-xl rotate-12"
            >
              <Users className="text-white w-10 h-10" />
            </motion.div>
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-8 -left-8 w-20 h-20 bg-[#d4af37] rounded-full flex items-center justify-center shadow-xl"
            >
              <Heart className="text-white w-8 h-8" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <Section
        id="about"
        title={settings?.aboutTitle || "Our Mission"}
        subtitle={settings?.aboutContent || "Promoting local services and serving the ALT community through boots-on-the-ground collaboration."}
        className="bg-white relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent" />
        
        <div className="grid md:grid-cols-3 gap-12 mt-12">
          <Card className="border-none bg-slate-50">
            <div className="w-14 h-14 bg-[#1a3a3a]/10 rounded-xl flex items-center justify-center mb-6">
              <Shield className="text-[#1a3a3a] w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#1a3a3a] mb-4">Hard Work</h3>
            <p className="text-slate-600">We celebrate the grit and dedication it takes to run a small or home-based business in our community.</p>
          </Card>
          <Card className="border-none bg-slate-50">
            <div className="w-14 h-14 bg-[#d4af37]/10 rounded-xl flex items-center justify-center mb-6">
              <Users className="text-[#d4af37] w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#1a3a3a] mb-4">Neighborly Support</h3>
            <p className="text-slate-600">Think of us as friends and neighbors first. We're here to pull each other up and share our successes.</p>
          </Card>
          <Card className="border-none bg-slate-50">
            <div className="w-14 h-14 bg-[#1a3a3a]/10 rounded-xl flex items-center justify-center mb-6">
              <Heart className="text-[#1a3a3a] w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#1a3a3a] mb-4">Community First</h3>
            <p className="text-slate-600">From the ALT Yard Sale to local seminars, our focus is always on making Auburn Lake Trails a better place to live and work.</p>
          </Card>
        </div>
      </Section>

      {/* Community Section */}
      <Section
        id="community"
        title={settings?.clubTitle || "A Cooperative Club"}
        subtitle={settings?.clubContent || "Working together to showcase the best ALT has to offer."}
        className="bg-[#fbfaf8]"
      >
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            {/* Features List */}
            <div className="space-y-8">
              {(settings?.communityFeatures || [
                { id: '1', title: "Local Promotion", content: "We actively promote member services on the ALT Facebook page and through community events.", icon: "Megaphone" },
                { id: '2', title: "Collaborative Booths", content: "Join our shared spaces at events like the Independence Day Celebration and WIFFs Yard Sale.", icon: "Store" },
                { id: '3', title: "Knowledge Sharing", content: "Attend market seminars at the Lakeside Clubhouse featuring industry experts to grow your business.", icon: "Lightbulb" }
              ]).map((feature: any, index: number) => {
                const ICON_MAP: Record<string, any> = {
                  Megaphone, Store, Lightbulb, Users, Shield, Heart, Zap, Award, Globe, Briefcase, Handshake, HelpCircle, BadgeCheck
                };
                const IconComponent = ICON_MAP[feature.icon] || BadgeCheck;
                return (
                  <div key={feature.id || index} className="flex gap-6 items-start group">
                    <div className="flex-shrink-0 w-12 h-12 bg-white border border-[#d4af37] rounded-lg flex items-center justify-center shadow-sm group-hover:bg-[#d4af37]/5 transition-colors">
                      <IconComponent className="w-6 h-6 text-[#1a3a3a]" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-[#1a3a3a] mb-2 uppercase tracking-wide">
                        {feature.title}
                      </h4>
                      <p className="text-slate-600">
                        {feature.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="relative">
             <div className="absolute -inset-4 border-2 border-[#d4af37] rounded-2xl -rotate-2" />
             <div className="absolute -inset-4 border-2 border-[#1a3a3a]/10 rounded-2xl rotate-1" />
             <img
              src={settings?.clubImage || "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1000&auto=format&fit=crop"}
              alt="Cooperative Collaboration"
              className="rounded-xl shadow-2xl relative z-10 w-full h-[400px] object-cover"
              referrerPolicy="no-referrer"
             />
          </div>
        </div>
      </Section>

      {/* Events Section */}
      <Section
        id="events"
        title={settings?.eventsTitle || "Community Calendar"}
        subtitle={settings?.eventsContent || "Real events, real connections. Join us where the community gathers."}
        className="bg-white"
      >
        <EventCalendar />
      </Section>

      {/* Testimonials Section */}
      <Section
        id="testimonials"
        title={settings?.testimonialsTitle || "Neighborly Voices"}
        subtitle={settings?.testimonialsSubtitle || "Hear from the small business owners who are the heart of ALT."}
        className="bg-[#fbfaf8] border-y border-[#d4af37]/10"
      >
        <Testimonials />
      </Section>

      {/* Membership / Contact Form */}
      <Section
        id="contact"
        title="Join the Club"
        subtitle="Interested in joining our ALT Business Connections? Click below to start your application."
      >
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <button
            onClick={() => setIsFormVisible(!isFormVisible)}
            className={cn(
              "flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all shadow-sm border",
              isFormVisible 
                ? "bg-white text-[#1a3a3a] border-slate-200" 
                : "bg-[#1a3a3a] text-white border-[#1a3a3a] hover:bg-[#2a4a4a]"
            )}
          >
            {isFormVisible ? (
              <>
                <ChevronUp className="w-5 h-5" />
                Hide Application Form
              </>
            ) : (
              <>
                <ChevronDown className="w-5 h-5" />
                Show Application Form
              </>
            )}
          </button>

          <AnimatePresence>
            {isFormVisible && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full overflow-hidden mt-8"
              >
                <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-[#d4af37]/10">
                  <ContactForm 
                    defaultJoinClub={true}
                    showJoinClubCheckbox={false}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Section>
    </>
  );
};

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "global"), (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data());
      }
    });
    return () => unsub();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-[#fbfaf8] text-slate-800 font-sans selection:bg-[#d4af37]/30 pb-20 md:pb-0">
        <header className="fixed top-0 left-0 right-0 z-50">
          <AnnouncementBanner text={settings?.announcement} />
          <Navigation onJoinClick={() => setIsModalOpen(true)} />
        </header>
        <MobileThumbNav onJoinClick={() => setIsModalOpen(true)} />
        
        <Routes>
          <Route path="/" element={<HomePage onJoinClick={() => setIsModalOpen(true)} settings={settings} />} />
          <Route path="/directory" element={<DirectoryPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Routes>

        <MembershipModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <OfflineIndicator />

        {/* Footer */}
        <footer className="bg-[#1a3a3a] text-white py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-2">
                <Link to="/" className="flex items-center gap-2 mb-6">
                  <img src="/ABC Logo.png" alt="ALT Business Connections Logo" className="h-8 w-auto object-contain" referrerPolicy="no-referrer" />
                  <span className="font-bold text-xl tracking-tight uppercase">
                    ALT <span className="text-[#d4af37]">Business</span> Connections
                  </span>
                </Link>
                <p className="text-slate-300 max-w-sm mb-8">
                  {settings?.footerContent || "A cooperative club for Auburn Lake Trails entrepreneurs. Helping neighbors thrive through local services and collaboration."}
                </p>
                <div className="flex gap-4">
                  <Link to="/directory" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#d4af37] transition-colors cursor-pointer">
                     <Users className="w-5 h-5" />
                  </Link>
                  <a href="/#events" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#d4af37] transition-colors cursor-pointer">
                     <Calendar className="w-5 h-5" />
                  </a>
                  <button onClick={() => setIsModalOpen(true)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#d4af37] transition-colors cursor-pointer">
                     <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-[#d4af37] uppercase tracking-widest text-sm mb-6">Navigation</h5>
                <ul className="space-y-4">
                  <li><Link to="/#about" className="text-slate-400 hover:text-white transition-colors text-sm">About</Link></li>
                  <li><Link to="/#community" className="text-slate-400 hover:text-white transition-colors text-sm">Community</Link></li>
                  <li><Link to="/#events" className="text-slate-400 hover:text-white transition-colors text-sm">Events</Link></li>
                  <li><Link to="/directory" className="text-slate-400 hover:text-white transition-colors text-sm">Directory</Link></li>
                  <li><Link to="/admin" className="text-slate-400 hover:text-white transition-colors text-sm">Admin</Link></li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-[#d4af37] uppercase tracking-widest text-sm mb-6">Contact Organizer</h5>
                <ul className="space-y-4">
                  <li className="text-slate-400 text-sm font-bold">Annette Gregg</li>
                  <li className="text-slate-400 text-sm">annettegregg@kw.com</li>
                  <li className="text-slate-400 text-sm">530-305-7759</li>
                  <li className="text-slate-400 text-sm italic">Auburn Lake Trails (ALT)</li>
                </ul>
              </div>
            </div>
            
            <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-col gap-2 text-center md:text-left">
                <p className="text-slate-500 text-[10px] sm:text-xs uppercase tracking-widest">
                  © 2026 ALT Business Connections. Founded by Annette Gregg.
                </p>
                <p className="text-slate-500 text-[10px] sm:text-xs uppercase tracking-widest">
                  Site built by <a href="https://www.growlocalcreative.com" target="_blank" rel="noopener noreferrer" className="text-[#d4af37] hover:text-[#e4bf47] transition-colors">Grow Local Creative</a> — Your Local Digital Helper
                </p>
              </div>
              <div className="flex gap-8">
                <Link to="/privacy" className="text-slate-500 hover:text-white text-xs uppercase tracking-widest transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="text-slate-500 hover:text-white text-xs uppercase tracking-widest transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
