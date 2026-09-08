import React, { useEffect, useState } from "react";
import { 
  collection, 
  onSnapshot, 
  doc, 
  deleteDoc, 
  setDoc, 
  updateDoc,
  addDoc,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User
} from "firebase/auth";
import { 
  db, 
  auth, 
  handleFirestoreError, 
  OperationType 
} from "../lib/firebase";
import { 
  Settings, 
  Users, 
  Building2, 
  LogOut, 
  Trash2, 
  CheckCircle, 
  ShieldAlert,
  Loader2,
  Edit,
  ExternalLink,
  Search,
  Check,
  X,
  BadgeCheck,
  Quote,
  Calendar,
  Plus,
  Image as ImageIcon,
  Upload,
  Megaphone,
  Store,
  Lightbulb,
  Heart,
  Zap,
  Award,
  Globe,
  Briefcase,
  Handshake,
  HelpCircle,
  Shield,
  Mail,
  Send
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button, Card, Section } from "./UI";
import { Business, MembershipApplication, SiteSettings, Testimonial, AppEvent, NewsletterSettings } from "../types";
import { AnimatePresence, motion } from "motion/react";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Business>) => Promise<void>;
  initialData?: Partial<Business>;
  title: string;
}

const EditBusinessModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSave, initialData, title }) => {
  const [formData, setFormData] = useState<Partial<Business>>(initialData || {});

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        alert("Image size must be less than 1MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#1a3a3a]/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-[#fbfaf8]">
          <h2 className="text-2xl font-bold text-[#1a3a3a] font-serif">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Business Logo</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                {formData.logo ? (
                  <img src={formData.logo} alt="Logo Preview" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-slate-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  placeholder="Logo URL"
                  value={formData.logo || ""}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="w-full px-4 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#d4af37] outline-none"
                />
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="admin-logo-upload"
                  />
                  <label
                    htmlFor="admin-logo-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold border border-slate-200 cursor-pointer hover:bg-slate-100 transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Logo
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Business Name</label>
              <input
                type="text"
                required
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#d4af37] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category</label>
              <input
                type="text"
                required
                value={formData.category || ""}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#d4af37] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Owner</label>
              <input
                type="text"
                required
                value={formData.owner || ""}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#d4af37] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email</label>
              <input
                type="email"
                required
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#d4af37] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Phone</label>
              <input
                type="text"
                required
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#d4af37] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Website</label>
              <input
                type="url"
                required
                value={formData.website || ""}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#d4af37] outline-none"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description</label>
            <textarea
              required
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#d4af37] outline-none min-h-[100px]"
            />
          </div>
          <div className="flex flex-wrap gap-6 pt-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.isABCClubMember || false}
                onChange={(e) => setFormData({ ...formData, isABCClubMember: e.target.checked })}
                className="w-5 h-5 rounded border-slate-300 text-[#1a3a3a] focus:ring-[#d4af37]"
              />
              <span className="text-sm font-bold text-slate-600 group-hover:text-[#1a3a3a] transition-colors flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-[#d4af37]" />
                ABC Club Member
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.isTextEnabled || false}
                onChange={(e) => setFormData({ ...formData, isTextEnabled: e.target.checked })}
                className="w-5 h-5 rounded border-slate-300 text-[#1a3a3a] focus:ring-[#d4af37]"
              />
              <span className="text-sm font-bold text-slate-600 group-hover:text-[#1a3a3a] transition-colors">
                Supports Texting
              </span>
            </label>
          </div>
          <div className="pt-8 flex gap-4">
            <Button type="submit" variant="primary" className="flex-1 py-4">Save Changes</Button>
            <Button type="button" onClick={onClose} variant="outline" className="px-8">Cancel</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const EditTestimonialModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Testimonial>) => Promise<void>;
  initialData?: Partial<Testimonial>;
}> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Testimonial>>(initialData || {});
  useEffect(() => setFormData(initialData || {}), [initialData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        alert("Image size must be less than 1MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#1a3a3a]/40 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-[#fbfaf8]">
          <h2 className="text-2xl font-bold text-[#1a3a3a] font-serif">Neighborly Voice</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Name</label>
              <input type="text" required value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#d4af37]" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Role</label>
              <input type="text" required value={formData.role || ""} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#d4af37]" />
            </div>
          </div>
          
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Profile Image</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-slate-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  placeholder="Image URL"
                  value={formData.image || ""}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#d4af37] outline-none"
                />
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="testimonial-image-upload"
                  />
                  <label
                    htmlFor="testimonial-image-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold border border-slate-200 cursor-pointer hover:bg-slate-100 transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Photo
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Quote Content</label>
            <textarea required value={formData.content || ""} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#d4af37] min-h-[100px]" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Display Order</label>
            <input type="number" value={formData.order || 0} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#d4af37]" />
          </div>
          <div className="pt-4 flex gap-4">
            <Button type="submit" variant="primary" className="flex-1 py-4">Save Voice</Button>
            <Button type="button" onClick={onClose} variant="outline" className="px-8">Cancel</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const EditEventModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<AppEvent>) => Promise<void>;
  initialData?: Partial<AppEvent>;
}> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<AppEvent>>(initialData || {});
  useEffect(() => setFormData(initialData || {}), [initialData]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#1a3a3a]/40 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-[#fbfaf8]">
          <h2 className="text-2xl font-bold text-[#1a3a3a] font-serif">Community Event</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-8 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Title</label>
              <input type="text" required value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-[#d4af37]" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
              <input type="text" required value={formData.category || ""} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-[#d4af37]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Date (Display)</label>
              <input type="text" required placeholder="e.g. Jun 16, 2026" value={formData.date || ""} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-[#d4af37]" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Time (Display)</label>
              <input type="text" required placeholder="e.g. 2:00 PM - 4:00 PM" value={formData.time || ""} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-[#d4af37]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">ISO Start (Calendar)</label>
              <input type="text" required placeholder="e.g. 20260616T140000" value={formData.startTime || ""} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} className="w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-[#d4af37]" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">ISO End (Calendar)</label>
              <input type="text" required placeholder="e.g. 20260616T160000" value={formData.endTime || ""} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} className="w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-[#d4af37]" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Location</label>
            <input type="text" required value={formData.location || ""} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-[#d4af37]" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Description</label>
            <textarea required value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-[#d4af37] min-h-[80px]" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Host Name</label>
              <input type="text" required value={formData.host || ""} onChange={(e) => setFormData({ ...formData, host: e.target.value })} className="w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-[#d4af37]" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Host Email</label>
              <input type="email" required value={formData.hostEmail || ""} onChange={(e) => setFormData({ ...formData, hostEmail: e.target.value })} className="w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-[#d4af37]" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Host Phone</label>
              <input type="text" required value={formData.hostPhone || ""} onChange={(e) => setFormData({ ...formData, hostPhone: e.target.value })} className="w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-[#d4af37]" />
            </div>
          </div>
          <div className="pt-4 flex gap-4">
            <Button type="submit" variant="primary" className="flex-1 py-4">Save Event</Button>
            <Button type="button" onClick={onClose} variant="outline" className="px-8">Cancel</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const ConfirmDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: "danger" | "info";
}> = ({ isOpen, onClose, onConfirm, title, message, type = "info" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#1a3a3a]/40 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-8 space-y-4">
          <h2 className={`text-xl font-bold font-serif ${type === 'danger' ? 'text-red-600' : 'text-[#1a3a3a]'}`}>{title}</h2>
          <p className="text-slate-600 leading-relaxed">{message}</p>
          <div className="pt-4 flex gap-4">
            <Button onClick={onConfirm} variant={type === 'danger' ? 'primary' : 'primary'} className={`flex-1 py-3 ${type === 'danger' ? 'bg-red-600 hover:bg-red-700' : ''}`}>
              Confirm
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1 py-3">Cancel</Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const MessageModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}> = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#1a3a3a]/40 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-8 space-y-4 text-center">
          <h2 className="text-xl font-bold text-[#1a3a3a] font-serif">{title}</h2>
          <p className="text-slate-600">{message}</p>
          <div className="pt-4">
            <Button onClick={onClose} variant="primary" className="w-full py-3">OK</Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const RecipientModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  recipients: { email: string; name: string; source: string }[];
  selectedEmails: Set<string>;
  onToggleEmail: (email: string) => void;
  onToggleAll: () => void;
  onConfirm: () => void;
  isSending: boolean;
}> = ({ isOpen, onClose, recipients, selectedEmails, onToggleEmail, onToggleAll, onConfirm, isSending }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#1a3a3a]/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden border border-[#d4af37]/20"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-[#1a3a3a]">Review Recipients</h3>
            <p className="text-xs text-slate-500 mt-1">Select exactly who should receive this update.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <span className="text-sm font-bold text-slate-600">{selectedEmails.size} of {recipients.length} Selected</span>
            <button 
              onClick={onToggleAll}
              className="text-xs font-bold text-[#d4af37] uppercase tracking-widest hover:underline"
            >
              {selectedEmails.size === recipients.length ? "Deselect All" : "Select All"}
            </button>
          </div>

          <div className="space-y-2">
            {recipients.map((r) => (
              <label 
                key={r.email} 
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer",
                  selectedEmails.has(r.email) ? "bg-[#d4af37]/5 border-[#d4af37]/30" : "bg-white border-slate-100 hover:border-slate-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-5 h-5 rounded border flex items-center justify-center transition-all",
                    selectedEmails.has(r.email) ? "bg-[#d4af37] border-[#d4af37]" : "bg-white border-slate-300"
                  )}>
                    {selectedEmails.has(r.email) && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1a3a3a]">{r.name || "Member"}</p>
                    <p className="text-xs text-slate-400">{r.email}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-full uppercase tracking-tighter">
                  {r.source}
                </span>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={selectedEmails.has(r.email)}
                  onChange={() => onToggleEmail(r.email)}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button 
            variant="primary" 
            onClick={onConfirm} 
            disabled={isSending || selectedEmails.size === 0}
            className="flex-[2] flex items-center justify-center gap-2"
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send to {selectedEmails.size} Neighbors
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export const NewsletterPanel: React.FC<{ 
  businesses: Business[], 
  memberships: MembershipApplication[],
  isLoading?: boolean,
  settings: NewsletterSettings | null,
  onSaveSettings: (data: Partial<NewsletterSettings>) => Promise<void>
}> = ({ businesses, memberships, isLoading = false, settings, onSaveSettings }) => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingSettings, setEditingSettings] = useState<Partial<NewsletterSettings>>(settings || {});

  useEffect(() => {
    if (settings) {
      setEditingSettings(settings);
    }
  }, [settings]);

  const handleSaveSettings = async () => {
    await onSaveSettings(editingSettings);
    setIsSettingsOpen(false);
  };

  // Extract unique recipients with metadata
  const recipientMap = new Map<string, { email: string; name: string; source: string }>();
  
  businesses.forEach(b => {
    if (b.email && b.email.includes('@')) {
      recipientMap.set(b.email, { email: b.email, name: b.name, source: 'Business' });
    }
  });

  memberships.forEach(m => {
    if (m.email && m.email.includes('@')) {
      if (!recipientMap.has(m.email)) {
        recipientMap.set(m.email, { email: m.email, name: m.name, source: 'Application' });
      }
    }
  });

  const allRecipients = Array.from(recipientMap.values());
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());

  // Initialize/Update selected emails when data arrives
  useEffect(() => {
    if (!isLoading && allRecipients.length > 0 && selectedEmails.size === 0) {
      setSelectedEmails(new Set(allRecipients.map(r => r.email)));
    }
  }, [allRecipients.length, isLoading]);

  const toggleEmail = (email: string) => {
    const next = new Set(selectedEmails);
    if (next.has(email)) next.delete(email);
    else next.add(email);
    setSelectedEmails(next);
  };

  const toggleAll = () => {
    if (selectedEmails.size === allRecipients.length) {
      setSelectedEmails(new Set());
    } else {
      setSelectedEmails(new Set(allRecipients.map(r => r.email)));
    }
  };

  const handleSendClick = () => {
    if (!subject.trim() || !body.trim()) {
      setStatus({ type: 'error', message: "Please provide a subject and message body first." });
      // Scroll to status if needed or just let the UI show it
      return;
    }

    if (allRecipients.length === 0) {
      setStatus({ type: 'error', message: "No recipients found. Make sure your Directory or Applications lists have valid email addresses." });
      return;
    }

    setIsModalOpen(true);
  };

  const confirmSend = async () => {
    if (selectedEmails.size === 0) return;

    setIsSending(true);
    setStatus(null);

    try {
      // Revert to relative path to use the domain host as requested by user
      // If Cloudflare is configured correctly, this will hit the backend API
      const apiUrl = `/api/newsletter/send`;
      
      console.log("Sending newsletter via domain host API:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          body,
          recipients: Array.from(selectedEmails),
          customization: settings ? {
            bannerColor: settings.bannerColor,
            bannerTextColor: settings.bannerTextColor,
            organizationName: settings.organizationName,
            address: settings.address,
            phone: settings.phone,
            contactEmail: settings.contactEmail,
            website: settings.website,
            replyTo: settings.replyTo,
            footerText: settings.footerText
          } : undefined
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error(`Server returned invalid response format (${response.status})`);
      }

      if (response.ok) {
        // Also save to Firestore for history/tracking
        try {
          await addDoc(collection(db, "newsletter_queue"), {
            subject,
            body,
            recipients: Array.from(selectedEmails),
            status: 'sent',
            createdAt: serverTimestamp(),
            sentAt: serverTimestamp(),
            createdBy: auth.currentUser?.email || 'admin',
            recipientCount: selectedEmails.size,
            messageId: data.messageId
          });
        } catch (e) {
          console.warn("Failed to save history log, but email was sent.");
          try {
            handleFirestoreError(e, OperationType.CREATE, "newsletter_queue");
          } catch (loggingError) {
            // Keep original behavior of just warning, but now with better console output
          }
        }

        setStatus({ type: 'success', message: "Newsletter sent successfully!" });
        setSubject("");
        setBody("");
        setIsModalOpen(false);
      } else {
        throw new Error(data.error || `Server error (${response.status})`);
      }
    } catch (error: any) {
      console.error("Newsletter error details:", error);
      const is405 = error.message?.includes('405');
      const errorMessage = is405 
        ? "The domain host (Cloudflare) still returned a 405 error. Please ensure the API is correctly routed or use the direct API URL in settings."
        : (error.message || "An unexpected error occurred while sending.");
      setStatus({ type: 'error', message: errorMessage });
    } finally {
      setIsSending(false);
    }

  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-8">
      <RecipientModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recipients={allRecipients}
        selectedEmails={selectedEmails}
        onToggleEmail={toggleEmail}
        onToggleAll={toggleAll}
        onConfirm={confirmSend}
        isSending={isSending}
      />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#d4af37]/10 rounded-xl">
              <Mail className="w-6 h-6 text-[#d4af37]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1a3a3a]">Blast Newsletter</h2>
              <p className="text-slate-500">Send an update to your {allRecipients.length} members & neighbors.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-[#1a3a3a] rounded-xl text-sm font-bold border border-slate-200 hover:bg-slate-100 transition-all"
          >
            <Settings className="w-4 h-4" />
            Newsletter Branding
          </button>
        </div>

      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-6 mt-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#1a3a3a]">Design & Footer Settings</h3>
                <p className="text-xs text-slate-400 italic">Changes here update your default newsletter look.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Header Banner Color</label>
                    <div className="flex gap-3">
                      <input 
                        type="color" 
                        value={editingSettings.bannerColor || "#1a3a3a"} 
                        onChange={(e) => setEditingSettings({ ...editingSettings, bannerColor: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent"
                      />
                      <input 
                        type="text" 
                        value={editingSettings.bannerColor || ""} 
                        onChange={(e) => setEditingSettings({ ...editingSettings, bannerColor: e.target.value })}
                        className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 uppercase font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Header Text Color</label>
                    <div className="flex gap-3">
                      <input 
                        type="color" 
                        value={editingSettings.bannerTextColor || "#d4af37"} 
                        onChange={(e) => setEditingSettings({ ...editingSettings, bannerTextColor: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent"
                      />
                      <input 
                        type="text" 
                        value={editingSettings.bannerTextColor || ""} 
                        onChange={(e) => setEditingSettings({ ...editingSettings, bannerTextColor: e.target.value })}
                        className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 uppercase font-mono"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-slate-200">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Live Preview</div>
                    <div className="space-y-4">
                      {/* Header Preview */}
                      <div 
                        className="h-12 rounded-lg flex items-center justify-center font-bold text-sm tracking-widest uppercase"
                        style={{ backgroundColor: editingSettings.bannerColor, color: editingSettings.bannerTextColor }}
                      >
                        {editingSettings.organizationName || "ALT Business Connections"}
                      </div>

                      {/* Footer Preview */}
                      <div className="pt-4 border-t border-slate-100 text-center space-y-1">
                        <p className="text-[11px] font-bold text-slate-700">{editingSettings.organizationName}</p>
                        <p className="text-[10px] text-slate-400">{editingSettings.address}</p>
                        <div className="flex flex-wrap justify-center gap-x-3 text-[10px] text-[#d4af37]">
                          {editingSettings.phone && <span>{editingSettings.phone}</span>}
                          {editingSettings.contactEmail && <span>{editingSettings.contactEmail}</span>}
                          <span>{editingSettings.website?.replace('https://', '').replace('http://', '')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Organization Name</label>
                    <input 
                      type="text" 
                      value={editingSettings.organizationName || ""} 
                      onChange={(e) => setEditingSettings({ ...editingSettings, organizationName: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Office Address</label>
                    <input 
                      type="text" 
                      value={editingSettings.address || ""} 
                      onChange={(e) => setEditingSettings({ ...editingSettings, address: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Website URL</label>
                    <input 
                      type="text" 
                      value={editingSettings.website || ""} 
                      onChange={(e) => setEditingSettings({ ...editingSettings, website: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Contact Phone</label>
                    <input 
                      type="text" 
                      value={editingSettings.phone || ""} 
                      onChange={(e) => setEditingSettings({ ...editingSettings, phone: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Contact Email</label>
                    <input 
                      type="email" 
                      value={editingSettings.contactEmail || ""} 
                      onChange={(e) => setEditingSettings({ ...editingSettings, contactEmail: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Compliance Footer Text</label>
                    <textarea 
                      value={editingSettings.footerText || ""} 
                      onChange={(e) => setEditingSettings({ ...editingSettings, footerText: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveSettings}>Save Branding Settings</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#1a3a3a] uppercase tracking-widest">Email Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. September Member Update & Yard Sale Details"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#d4af37] outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#1a3a3a] uppercase tracking-widest">Message Content</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
            placeholder="Write your newsletter here..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#d4af37] outline-none resize-none"
          />
          <p className="text-xs text-slate-400">Pro-tip: Keep it concise and neighborly. The app's header and footer will be added automatically.</p>
        </div>

        {status && (
          <div className={cn(
            "p-4 rounded-xl flex items-center gap-3",
            status.type === 'success' ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
          )}>
            {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            <p className="text-sm font-medium">{status.message}</p>
          </div>
        )}

        <Button 
          onClick={handleSendClick} 
          disabled={isSending || isLoading}
          className="w-full py-4 text-lg flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Syncing Neighbors...
            </>
          ) : isSending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Review & Send to {allRecipients.length} Neighbors
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"directory" | "members" | "settings" | "testimonials" | "events" | "newsletter">("directory");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [memberships, setMemberships] = useState<MembershipApplication[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [newsletterSettings, setNewsletterSettings] = useState<NewsletterSettings | null>(null);

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Partial<Business> | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  // Testimonial/Event Modals
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<AppEvent> | null>(null);

  // Custom UI Dialogs
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void; type: "danger" | "info" }>({
    isOpen: false, title: "", message: "", onConfirm: () => {}, type: "info"
  });
  const [messageModal, setMessageModal] = useState<{ isOpen: boolean; title: string; message: string }>({
    isOpen: false, title: "", message: ""
  });

  const showConfirm = (title: string, message: string, onConfirm: () => void, type: "danger" | "info" = "info") => {
    setConfirmDialog({ isOpen: true, title, message, onConfirm, type });
  };

  const showMessage = (title: string, message: string) => {
    setMessageModal({ isOpen: true, title, message });
  };

  useEffect(() => {
    let unsubAdmin: (() => void) | null = null;
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      // Clean up previous admin listener if it exists
      if (unsubAdmin) {
        unsubAdmin();
        unsubAdmin = null;
      }

      if (currentUser) {
        // Check if user is admin
        const adminDoc = doc(db, "admins", currentUser.uid);
        unsubAdmin = onSnapshot(adminDoc, (snapshot) => {
          setIsAdmin(snapshot.exists());
          setIsLoading(false);
        }, (error) => {
          console.error("Admin check failed", error);
          setIsAdmin(false);
          setIsLoading(false);
        });
      } else {
        setIsAdmin(false);
        setIsLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (unsubAdmin) unsubAdmin();
    };
  }, []);

  useEffect(() => {
    if (!isAdmin || !user) {
      setBusinesses([]);
      setMemberships([]);
      setSiteSettings(null);
      return;
    }

    console.log("Admin verified. Setting up data listeners...");

    const unsubBusinesses = onSnapshot(
      query(collection(db, "businesses"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setBusinesses(snapshot.docs.map(d => ({ ...d.data(), id: d.id } as any)));
      },
      (error) => {
        if (error.message.includes("permissions")) {
          console.warn("Permissions error on businesses, retrying in 2s...");
          setTimeout(() => setIsAdmin(prev => prev), 2000); // Trigger re-eval
        }
        handleFirestoreError(error, OperationType.LIST, "businesses");
      }
    );

    const unsubMemberships = onSnapshot(
      query(collection(db, "memberships"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setMemberships(snapshot.docs.map(d => ({ ...d.data(), id: d.id } as any)));
      },
      (error) => {
        if (error.message.includes("permissions")) {
          console.warn("Permissions error on memberships. User may not be initialized in 'admins' collection yet.");
        }
        handleFirestoreError(error, OperationType.LIST, "memberships");
      }
    );

    const unsubSettings = onSnapshot(
      doc(db, "settings", "global"),
      (snapshot) => {
        setSiteSettings(snapshot.data() as SiteSettings || { 
          heroTitle: "Rooted in ALT. Growing Together.",
          heroSubtitle: "A neighborly cooperative for home-based and small business owners in Auburn Lake Trails.",
          heroImage: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop",
          announcement: "",
          aboutTitle: "Our Mission",
          aboutContent: "Promoting local services and serving the ALT community through boots-on-the-ground collaboration.",
          eventsTitle: "Community Calendar",
          eventsContent: "Real events, real connections. Join us where the community gathers.",
          clubTitle: "A Cooperative Club",
          clubContent: "Working together to showcase the best ALT has to offer.",
          clubImage: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1000&auto=format&fit=crop",
          communityFeatures: [
            { id: '1', title: "Local Promotion", content: "We actively promote member services on the ALT Facebook page and through community events.", icon: "Megaphone" },
            { id: '2', title: "Collaborative Booths", content: "Join our shared spaces at events like the Independence Day Celebration and WIFFs Yard Sale.", icon: "Store" },
            { id: '3', title: "Knowledge Sharing", content: "Attend market seminars at the Lakeside Clubhouse featuring industry experts to grow your business.", icon: "Lightbulb" }
          ],
          footerContent: "A cooperative club for Auburn Lake Trails entrepreneurs. Helping neighbors thrive through local services and collaboration.",
          testimonialsTitle: "Neighborly Voices",
          testimonialsSubtitle: "Hear from the small business owners who are the heart of ALT.",
          updatedAt: new Date().toISOString()
        });
      },
      (error) => handleFirestoreError(error, OperationType.GET, "settings/global")
    );

    const unsubTestimonials = onSnapshot(
      query(collection(db, "testimonials"), orderBy("order", "asc")),
      (snapshot) => {
        setTestimonials(snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Testimonial)));
      },
      (error) => handleFirestoreError(error, OperationType.LIST, "testimonials")
    );

    const unsubEvents = onSnapshot(
      query(collection(db, "events"), orderBy("startTime", "asc")),
      (snapshot) => {
        setEvents(snapshot.docs.map(d => ({ ...d.data(), id: d.id } as AppEvent)));
      },
      (error) => handleFirestoreError(error, OperationType.LIST, "events")
    );

    const unsubNewsletterSettings = onSnapshot(
      doc(db, "settings", "newsletter"),
      (snapshot) => {
        setNewsletterSettings(snapshot.data() as NewsletterSettings || {
          bannerColor: "#1a3a3a",
          bannerTextColor: "#d4af37",
          organizationName: "ALT Business Connections",
          address: "Auburn Lake Trails • Cool, California",
          phone: "530-000-0000",
          contactEmail: "growlocalcreative@gmail.com",
          website: "https://www.altbusinessconnections.org",
          replyTo: "growlocalcreative@gmail.com",
          footerText: "You are receiving this because you are part of our local community network.",
          updatedAt: new Date().toISOString()
        });
      },
      (error) => handleFirestoreError(error, OperationType.GET, "settings/newsletter")
    );

    return () => {
      unsubBusinesses();
      unsubMemberships();
      unsubSettings();
      unsubTestimonials();
      unsubEvents();
      unsubNewsletterSettings();
    };
  }, [isAdmin, user]);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = () => signOut(auth);

  const bootstrapAdmin = async () => {
    if (!user || user.email !== "growlocalcreative@gmail.com") return;
    setIsLoading(true);
    try {
      console.log("Initializing admin record for:", user.uid);
      await setDoc(doc(db, "admins", user.uid), {
        email: user.email,
        initializedAt: new Date().toISOString()
      });
      // The onSnapshot in the first useEffect will pick this up and set isAdmin to true
      showMessage("Success", "Admin access initialized! The dashboard will now reload.");
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "admins");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBusiness = async (id: string) => {
    showConfirm("Delete Listing", "Are you sure you want to remove this business from the directory?", async () => {
      try {
        await deleteDoc(doc(db, "businesses", id));
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `businesses/${id}`);
      }
    }, "danger");
  };

  const deleteMembership = async (id: string) => {
    showConfirm("Delete Application", "Are you sure you want to delete this membership application?", async () => {
      try {
        await deleteDoc(doc(db, "memberships", id));
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `memberships/${id}`);
      }
    }, "danger");
  };

  const deleteTestimonial = async (id: string) => {
    showConfirm("Delete Voice", "Are you sure you want to delete this neighborly voice?", async () => {
      try {
        await deleteDoc(doc(db, "testimonials", id));
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `testimonials/${id}`);
      }
    }, "danger");
  };

  const deleteEvent = async (id: string) => {
    showConfirm("Delete Event", "Are you sure you want to delete this community event?", async () => {
      try {
        await deleteDoc(doc(db, "events", id));
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `events/${id}`);
      }
    }, "danger");
  };

  const handleEditBusiness = (biz: Business) => {
    setEditingBusiness(biz);
    setIsApproving(false);
    setIsEditModalOpen(true);
  };

  const handleApproveStart = (m: MembershipApplication) => {
    setEditingBusiness({
      name: m.businessName,
      owner: m.name,
      email: m.email,
      phone: m.phone,
      category: m.category,
      description: m.description,
      website: m.website,
      logo: m.logo || "",
      isTextEnabled: m.isTextEnabled,
      isABCClubMember: m.joinClub, // Respect user preference from application
      timestamp: new Date().toISOString()
    });
    setApprovingId(m.id || null);
    setIsApproving(true);
    setIsEditModalOpen(true);
  };

  const saveBusiness = async (data: Partial<Business>) => {
    try {
      if (isApproving && approvingId) {
        // Create new business
        const newBizRef = doc(collection(db, "businesses"));
        await setDoc(newBizRef, {
          ...data,
          timestamp: new Date().toISOString()
        });
        // Delete membership application
        await deleteDoc(doc(db, "memberships", approvingId));
        showMessage("Success", "Application approved and business listed!");
      } else if (editingBusiness?.id) {
        // Update existing business
        await updateDoc(doc(db, "businesses", editingBusiness.id), data);
        showMessage("Success", "Business updated!");
      }
      setIsEditModalOpen(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "businesses");
    }
  };

  const saveTestimonial = async (data: Partial<Testimonial>) => {
    try {
      if (data.id) {
        await updateDoc(doc(db, "testimonials", data.id), data);
      } else {
        const newRef = doc(collection(db, "testimonials"));
        await setDoc(newRef, { ...data, order: data.order || 0 });
      }
      setIsTestimonialModalOpen(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "testimonials");
    }
  };

  const saveEvent = async (data: Partial<AppEvent>) => {
    try {
      if (data.id) {
        await updateDoc(doc(db, "events", data.id), data);
      } else {
        const newRef = doc(collection(db, "events"));
        await setDoc(newRef, data);
      }
      setIsEventModalOpen(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "events");
    }
  };

  const seedDatabase = async () => {
    showConfirm("Initialize Sample Data", "This will add sample testimonials and events to your database. Continue?", async () => {
      setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      try {
        const testimonialsRef = collection(db, "testimonials");
        const sampleTestimonials = [
          {
            name: "Diane Miller",
            role: "Local Handcrafted Goods",
            content: "Being a home-based business in ALT can feel isolating, but ABC changed that. It's like having a team of neighbors who really want to see you succeed.",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
            order: 0
          },
          {
            name: "Tom Henderson",
            role: "Henderson Landscape & Design",
            content: "The Yard Sale booths and community seminars have been great for getting my name out there. It's honest hard work backed by a great group of people.",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
            order: 1
          },
          {
            name: "Sarah Owens",
            role: "ALT Professional Services",
            content: "Annette has built something special here. It's not about stuffy suits; it's about real people helping real people grow their local services.",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
            order: 2
          }
        ];

        for (const t of sampleTestimonials) {
          await addDoc(testimonialsRef, t);
        }

        const eventsRef = collection(db, "events");
        const sampleEvents = [
          {
            title: "Market Seminar w/ Steve Hovhannisyan",
            date: "Jun 16, 2026",
            time: "2:00 PM - 4:00 PM",
            location: "Lakeside Clubhouse",
            category: "Education",
            description: "Join local expert Steve Hovhannisyan for an in-depth seminar on market trends and community growth strategies.",
            host: "Steve Hovhannisyan",
            hostEmail: "steve@example.com",
            hostPhone: "530-555-0123",
            startTime: "20260616T140000",
            endTime: "20260616T160000",
          },
          {
            title: "Independence Day Celebration Booth",
            date: "Jul 04, 2026",
            time: "10:00 AM - 4:00 PM",
            location: "ALT Community Park",
            category: "Community",
            description: "ALT Business Connections will have a prominent booth at the annual Independence Day celebration.",
            host: "Annette Gregg",
            hostEmail: "annettegregg@kw.com",
            hostPhone: "530-305-7759",
            startTime: "20260704T100000",
            endTime: "20260704T160000",
          },
          {
            title: "WIFFs Yard Sale - ABC Booth",
            date: "Sep 12, 2026",
            time: "8:00 AM - 2:00 PM",
            location: "ALT Main Entrance",
            category: "Local Market",
            description: "The WIFFs Yard Sale is one of the biggest community events of the year. ABC will host a dedicated booth.",
            host: "Annette Gregg",
            hostEmail: "annettegregg@kw.com",
            hostPhone: "530-305-7759",
            startTime: "20260912T080000",
            endTime: "20260912T140000",
          }
        ];

        for (const e of sampleEvents) {
          await addDoc(eventsRef, e);
        }

        showMessage("Success", "Sample data initialized successfully!");
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, "seed");
      }
    });
  };

  const categories = ["All", ...Array.from(new Set(businesses.map(b => b.category)))].sort();

  const filteredBusinesses = businesses.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || b.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage);
  const paginatedBusinesses = filteredBusinesses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const filteredMemberships = memberships.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "settings", "global"), {
        ...siteSettings,
        updatedAt: new Date().toISOString()
      });
      showMessage("Success", "Settings saved!");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "settings/global");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        showMessage("Error", "Image size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSiteSettings({ ...siteSettings, [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfaf8]">
        <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <Section className="min-h-screen flex items-center justify-center pt-24 bg-[#fbfaf8]">
        <Card className="max-w-md w-full p-12 text-center border-[#d4af37]/20 shadow-2xl">
          <ShieldAlert className="w-16 h-16 text-[#d4af37] mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-[#1a3a3a] mb-4 font-serif">Admin Portal</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Please sign in with your authorized Google account to manage the ALT Business Connections platform.
          </p>
          <Button onClick={handleLogin} variant="primary" className="w-full py-4 text-lg">
            Sign in with Google
          </Button>
        </Card>
      </Section>
    );
  }

  if (!isAdmin) {
    return (
      <Section className="min-h-screen flex items-center justify-center pt-24 bg-[#fbfaf8]">
        <Card className="max-w-md w-full p-12 text-center border-red-200">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-[#1a3a3a] mb-2">Access Denied</h2>
          <p className="text-slate-600 mb-8">
            Your account ({user.email}) does not have administrative privileges.
          </p>
          {user.email === "growlocalcreative@gmail.com" && (
            <Button onClick={bootstrapAdmin} variant="secondary" className="w-full mb-4">
              Initialize My Admin Access
            </Button>
          )}
          <Button onClick={handleLogout} variant="outline" className="w-full">
            Log Out
          </Button>
        </Card>
      </Section>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-[#fbfaf8]">
      <Section className="max-w-7xl mx-auto px-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-[#1a3a3a] font-serif">Command Center</h1>
            <p className="text-slate-500 mt-2">Managing the ALT Business Connections Ecosystem</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-[#1a3a3a]">{user.displayName}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="!p-2 rounded-xl">
              <LogOut className="w-5 h-5 text-slate-400" />
            </Button>
          </div>
        </header>

        <div className="flex flex-wrap gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 w-fit mb-8">
          <button
            onClick={() => { setActiveTab("directory"); setSearchTerm(""); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === "directory" ? "bg-[#1a3a3a] text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Building2 className="w-4 h-4" />
            Directory
          </button>
          <button
            onClick={() => { setActiveTab("members"); setSearchTerm(""); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === "members" ? "bg-[#1a3a3a] text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Users className="w-4 h-4" />
            Applications
            {memberships.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#d4af37] text-[10px] text-white">
                {memberships.length}
              </span>
            )}
          </button>
          <button
            onClick={() => { setActiveTab("settings"); setSearchTerm(""); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === "settings" ? "bg-[#1a3a3a] text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Settings className="w-4 h-4" />
            Site Settings
          </button>
          <button
            onClick={() => { setActiveTab("testimonials"); setSearchTerm(""); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === "testimonials" ? "bg-[#1a3a3a] text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Quote className="w-4 h-4" />
            Voices
          </button>
          <button
            onClick={() => { setActiveTab("events"); setSearchTerm(""); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === "events" ? "bg-[#1a3a3a] text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Calendar
          </button>
          <button
            onClick={() => { setActiveTab("newsletter"); setSearchTerm(""); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === "newsletter" ? "bg-[#1a3a3a] text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Mail className="w-4 h-4" />
            Newsletter
          </button>
        </div>

        {(activeTab === "directory" || activeTab === "members") && (
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab === "directory" ? "listings" : "applications"}...`}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#d4af37] outline-none"
              />
            </div>
            {activeTab === "directory" && (
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-6 py-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#d4af37] outline-none text-sm font-bold text-[#1a3a3a] min-w-[200px] cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            )}
          </div>
        )}

        <div className="grid gap-8">
          {activeTab === "directory" && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Showing {filteredBusinesses.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredBusinesses.length)} of {filteredBusinesses.length} Listings
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Items per page:</span>
                  <select 
                    value={itemsPerPage} 
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="text-xs font-bold bg-transparent border-none focus:ring-0 cursor-pointer"
                  >
                    <option value={15}>15</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-[#1a3a3a] uppercase tracking-wider">Business</th>
                      <th className="px-6 py-4 text-xs font-bold text-[#1a3a3a] uppercase tracking-wider">Owner</th>
                      <th className="px-6 py-4 text-xs font-bold text-[#1a3a3a] uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-xs font-bold text-[#1a3a3a] uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedBusinesses.map((biz) => (
                      <tr key={biz.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                              {biz.logo ? (
                                <img src={biz.logo} alt={biz.name} className="w-full h-full object-contain" />
                              ) : (
                                <Building2 className="w-5 h-5 text-slate-200" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#1a3a3a]">{biz.name}</p>
                              <p className="text-xs text-slate-400">{biz.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{biz.owner}</td>
                        <td className="px-6 py-4">
                          {biz.isABCClubMember ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/10 text-[#d4af37] text-[10px] font-bold uppercase tracking-wider border border-[#d4af37]/20">
                              <BadgeCheck className="w-3.5 h-3.5" />
                              ABC Club Member
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                              Listing Only
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-500">{biz.phone}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[150px]">{biz.email}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleEditBusiness(biz)}
                              className="p-2 text-slate-400 hover:text-[#d4af37] hover:bg-[#d4af37]/5 rounded-lg transition-all"
                              title="Edit Listing"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteBusiness(biz.id!)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete Listing"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredBusinesses.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-20 text-center">
                          <Building2 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                          <p className="text-slate-400 font-medium">No business listings found.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {totalPages > 1 && (
                <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-xs font-bold disabled:opacity-50"
                  >
                    Previous
                  </Button>
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                          currentPage === page
                            ? "bg-[#1a3a3a] text-white"
                            : "text-slate-400 hover:bg-slate-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-xs font-bold disabled:opacity-50"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === "members" && (
            <div className="overflow-x-auto bg-white rounded-3xl border border-slate-200 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-[#1a3a3a] uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#1a3a3a] uppercase tracking-wider">Applicant</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#1a3a3a] uppercase tracking-wider">Business</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#1a3a3a] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMemberships.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(m.timestamp).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-[#1a3a3a]">{m.name}</p>
                        <p className="text-xs text-slate-400">{m.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-[#1a3a3a]">{m.businessName}</p>
                        <p className="text-xs text-[#d4af37] mb-1">{m.category}</p>
                        {m.joinClub ? (
                          <span className="text-[10px] font-bold text-[#d4af37] uppercase tracking-wider bg-[#d4af37]/5 px-2 py-0.5 rounded border border-[#d4af37]/20">
                            Club Interest
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                            Listing Only
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                          Pending Review
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleApproveStart(m)}
                            className="p-2 text-[#d4af37] hover:bg-[#d4af37] hover:text-white rounded-xl transition-all"
                            title="Approve & List"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteMembership(m.id!)}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredMemberships.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-medium">No membership applications yet.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "settings" && (
            <Card className="p-12 max-w-4xl border-slate-200">
              <form onSubmit={saveSettings} className="space-y-12">
                {/* Hero Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-[#1a3a3a] font-serif border-b pb-2">Hero Section</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#1a3a3a] uppercase tracking-widest">Hero Title</label>
                      <input
                        type="text"
                        value={siteSettings?.heroTitle || ""}
                        onChange={(e) => setSiteSettings({ ...siteSettings, heroTitle: e.target.value })}
                        className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#d4af37] outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-[#1a3a3a] uppercase tracking-widest block">Hero Image</label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                          {siteSettings?.heroImage ? (
                            <img src={siteSettings.heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-slate-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            placeholder="Image URL"
                            value={siteSettings?.heroImage || ""}
                            onChange={(e) => setSiteSettings({ ...siteSettings, heroImage: e.target.value })}
                            className="w-full px-4 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#d4af37] outline-none"
                          />
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, "heroImage")}
                              className="hidden"
                              id="hero-image-upload"
                            />
                            <label
                              htmlFor="hero-image-upload"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold border border-slate-200 cursor-pointer hover:bg-slate-100 transition-all"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              Upload Local Image
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#1a3a3a] uppercase tracking-widest">Hero Subtitle</label>
                    <textarea
                      value={siteSettings?.heroSubtitle || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, heroSubtitle: e.target.value })}
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#d4af37] outline-none transition-all min-h-[100px]"
                    />
                  </div>
                </div>

                {/* About Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-[#1a3a3a] font-serif border-b pb-2">About Section</h3>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#1a3a3a] uppercase tracking-widest">About Title</label>
                    <input
                      type="text"
                      value={siteSettings?.aboutTitle || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, aboutTitle: e.target.value })}
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#d4af37] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#1a3a3a] uppercase tracking-widest">About Subtitle</label>
                    <textarea
                      value={siteSettings?.aboutContent || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, aboutContent: e.target.value })}
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#d4af37] outline-none transition-all min-h-[100px]"
                    />
                  </div>
                </div>

                {/* Community Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-[#1a3a3a] font-serif border-b pb-2">Community Section</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#1a3a3a] uppercase tracking-widest">Section Title</label>
                      <input
                        type="text"
                        value={siteSettings?.clubTitle || ""}
                        onChange={(e) => setSiteSettings({ ...siteSettings, clubTitle: e.target.value })}
                        className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#d4af37] outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-[#1a3a3a] uppercase tracking-widest block">Section Image</label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                          {siteSettings?.clubImage ? (
                            <img src={siteSettings.clubImage} alt="Club Preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-slate-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            placeholder="Image URL"
                            value={siteSettings?.clubImage || ""}
                            onChange={(e) => setSiteSettings({ ...siteSettings, clubImage: e.target.value })}
                            className="w-full px-4 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#d4af37] outline-none"
                          />
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, "clubImage")}
                              className="hidden"
                              id="club-image-upload"
                            />
                            <label
                              htmlFor="club-image-upload"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold border border-slate-200 cursor-pointer hover:bg-slate-100 transition-all"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              Upload Local Image
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#1a3a3a] uppercase tracking-widest">Section Subtitle</label>
                    <textarea
                      value={siteSettings?.clubContent || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, clubContent: e.target.value })}
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#d4af37] outline-none transition-all min-h-[100px]"
                    />
                  </div>

                  {/* Club Points / Community Features */}
                  <div className="pt-6 space-y-8">
                    <div className="flex justify-between items-center border-l-4 border-[#d4af37] pl-4">
                      <h4 className="text-sm font-bold text-[#d4af37] uppercase tracking-[0.2em]">Community Features</h4>
                      <Button 
                        type="button"
                        onClick={() => {
                          const currentFeatures = siteSettings?.communityFeatures || [];
                          setSiteSettings({
                            ...siteSettings,
                            communityFeatures: [
                              ...currentFeatures,
                              { id: Math.random().toString(36).substr(2, 9), title: "New Feature", content: "Feature description", icon: "BadgeCheck" }
                            ]
                          });
                        }}
                        variant="primary"
                        className="scale-75 origin-right flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Add Feature
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-8">
                      {(siteSettings?.communityFeatures || []).map((feature, index) => (
                        <div key={feature.id || index} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                          <button
                            type="button"
                            onClick={() => {
                              const newFeatures = [...(siteSettings?.communityFeatures || [])];
                              newFeatures.splice(index, 1);
                              setSiteSettings({ ...siteSettings, communityFeatures: newFeatures });
                            }}
                            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            {/* Icon Picker */}
                            <div className="md:col-span-3 space-y-4">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Icon</label>
                              <div className="grid grid-cols-4 gap-2">
                                {[
                                  'Megaphone', 'Store', 'Lightbulb', 'Users', 
                                  'Shield', 'Heart', 'Zap', 'Award', 
                                  'Globe', 'Briefcase', 'Handshake', 'HelpCircle'
                                ].map((iconName) => {
                                  const ICON_MAP: Record<string, any> = {
                                    Megaphone, Store, Lightbulb, Users, Shield, Heart, Zap, Award, Globe, Briefcase, Handshake, HelpCircle, BadgeCheck
                                  };
                                  const IconComp = ICON_MAP[iconName] || HelpCircle;
                                  return (
                                    <button
                                      key={iconName}
                                      type="button"
                                      onClick={() => {
                                        const newFeatures = [...(siteSettings?.communityFeatures || [])];
                                        newFeatures[index] = { ...newFeatures[index], icon: iconName };
                                        setSiteSettings({ ...siteSettings, communityFeatures: newFeatures });
                                      }}
                                      className={cn(
                                        "p-2 rounded-lg border transition-all flex items-center justify-center",
                                        feature.icon === iconName 
                                          ? "bg-[#1a3a3a] border-[#1a3a3a] text-white shadow-md" 
                                          : "bg-white border-slate-200 text-slate-400 hover:border-[#d4af37] hover:text-[#d4af37]"
                                      )}
                                    >
                                      <IconComp className="w-4 h-4" />
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Content Inputs */}
                            <div className="md:col-span-9 space-y-4">
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Title</label>
                                <input
                                  type="text"
                                  value={feature.title}
                                  onChange={(e) => {
                                    const newFeatures = [...(siteSettings?.communityFeatures || [])];
                                    newFeatures[index] = { ...newFeatures[index], title: e.target.value };
                                    setSiteSettings({ ...siteSettings, communityFeatures: newFeatures });
                                  }}
                                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#d4af37] outline-none"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</label>
                                <textarea
                                  value={feature.content}
                                  onChange={(e) => {
                                    const newFeatures = [...(siteSettings?.communityFeatures || [])];
                                    newFeatures[index] = { ...newFeatures[index], content: e.target.value };
                                    setSiteSettings({ ...siteSettings, communityFeatures: newFeatures });
                                  }}
                                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#d4af37] outline-none min-h-[80px] text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {(siteSettings?.communityFeatures || []).length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
                          <p className="text-slate-400 italic">No features added. Click "Add Feature" to get started.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Announcement Banner */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-[#1a3a3a] font-serif border-b pb-2">Announcement Banner</h3>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#1a3a3a] uppercase tracking-widest">Banner Text</label>
                    <input
                      type="text"
                      placeholder="Leave empty to hide"
                      value={siteSettings?.announcement || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, announcement: e.target.value })}
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#d4af37] outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Footer Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-[#1a3a3a] font-serif border-b pb-2">Footer Section</h3>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#1a3a3a] uppercase tracking-widest">Footer Description</label>
                    <textarea
                      value={siteSettings?.footerContent || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, footerContent: e.target.value })}
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#d4af37] outline-none transition-all min-h-[100px]"
                    />
                  </div>
                </div>

                {/* Testimonials Section Headers */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-[#1a3a3a] font-serif border-b pb-2">Neighborly Voices Headers</h3>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#1a3a3a] uppercase tracking-widest">Section Title</label>
                    <input
                      type="text"
                      value={siteSettings?.testimonialsTitle || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, testimonialsTitle: e.target.value })}
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#d4af37] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#1a3a3a] uppercase tracking-widest">Section Subtitle</label>
                    <textarea
                      value={siteSettings?.testimonialsSubtitle || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, testimonialsSubtitle: e.target.value })}
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#d4af37] outline-none transition-all min-h-[100px]"
                    />
                  </div>
                </div>

                <Button type="submit" variant="primary" className="w-full py-4 text-lg shadow-xl shadow-[#1a3a3a]/20">
                  Publish All Changes
                </Button>
              </form>
            </Card>
          )}

          {activeTab === "testimonials" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-[#1a3a3a] font-serif">Neighborly Voices</h3>
                <Button onClick={() => { setEditingTestimonial(null); setIsTestimonialModalOpen(true); }} variant="primary" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Voice
                </Button>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((t) => (
                  <Card key={t.id} className="p-6 relative group">
                    <div className="flex items-center gap-4 mb-4">
                      <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#d4af37]" />
                      <div>
                        <h4 className="font-bold text-[#1a3a3a]">{t.name}</h4>
                        <p className="text-xs text-slate-500 uppercase tracking-widest">{t.role}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 italic mb-6">"{t.content}"</p>
                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                      <button onClick={() => { setEditingTestimonial(t); setIsTestimonialModalOpen(true); }} className="p-2 text-slate-400 hover:text-[#d4af37] transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => deleteTestimonial(t.id!)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </Card>
                ))}
                {testimonials.length === 0 && (
                  <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
                    <Quote className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 mb-6">No testimonials yet. Add some to show on the landing page!</p>
                    <Button onClick={seedDatabase} variant="outline" className="mx-auto">
                      Initialize Sample Voices
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "events" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-[#1a3a3a] font-serif">Community Calendar</h3>
                <Button onClick={() => { setEditingEvent(null); setIsEventModalOpen(true); }} variant="primary" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Event
                </Button>
              </div>
              <div className="overflow-x-auto bg-white rounded-3xl border border-slate-200 shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-[#1a3a3a] uppercase tracking-wider">Event</th>
                      <th className="px-6 py-4 text-xs font-bold text-[#1a3a3a] uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-4 text-xs font-bold text-[#1a3a3a] uppercase tracking-wider">Location</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {events.map((e) => (
                      <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-[#1a3a3a]">{e.title}</p>
                          <p className="text-xs text-[#d4af37] font-bold uppercase">{e.category}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {e.date} • {e.time}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{e.location}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => { setEditingEvent(e); setIsEventModalOpen(true); }} className="p-2 text-slate-400 hover:text-[#1a3a3a] transition-colors"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => deleteEvent(e.id!)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {events.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-20 text-center">
                          <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                          <p className="text-slate-400 mb-6">No events scheduled. Time to plan something!</p>
                          <Button onClick={seedDatabase} variant="outline" className="mx-auto">
                            Initialize Sample Events
                          </Button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "newsletter" && (
            <NewsletterPanel 
              businesses={businesses} 
              memberships={memberships} 
              isLoading={isLoading}
              settings={newsletterSettings}
              onSaveSettings={async (data) => {
                try {
                  await setDoc(doc(db, "settings", "newsletter"), {
                    ...data,
                    updatedAt: serverTimestamp()
                  });
                  setStatus({ type: 'success', message: "Branding settings saved successfully!" });
                } catch (e) {
                  console.error("Failed to save settings:", e);
                  handleFirestoreError(e, OperationType.UPDATE, "settings/newsletter");
                }
              }}
            />
          )}
        </div>
      </Section>

      <AnimatePresence>
        {isEditModalOpen && (
          <EditBusinessModal
            key="edit-business-modal"
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={saveBusiness}
            initialData={editingBusiness || {}}
            title={isApproving ? "Approve Application" : "Edit Business Listing"}
          />
        )}
        {isTestimonialModalOpen && (
          <EditTestimonialModal
            key="edit-testimonial-modal"
            isOpen={isTestimonialModalOpen}
            onClose={() => setIsTestimonialModalOpen(false)}
            onSave={saveTestimonial}
            initialData={editingTestimonial || {}}
          />
        )}
        {isEventModalOpen && (
          <EditEventModal
            key="edit-event-modal"
            isOpen={isEventModalOpen}
            onClose={() => setIsEventModalOpen(false)}
            onSave={saveEvent}
            initialData={editingEvent || {}}
          />
        )}

        <ConfirmDialog
          key="confirm-dialog"
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
          onConfirm={confirmDialog.onConfirm}
          title={confirmDialog.title}
          message={confirmDialog.message}
          type={confirmDialog.type}
        />

        <MessageModal
          key="message-modal"
          isOpen={messageModal.isOpen}
          onClose={() => setMessageModal(prev => ({ ...prev, isOpen: false }))}
          title={messageModal.title}
          message={messageModal.message}
        />
      </AnimatePresence>
    </div>
  );
};
