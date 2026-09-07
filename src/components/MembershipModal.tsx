import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ContactForm } from "./ContactForm";

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  defaultJoinClub?: boolean;
  showJoinClubCheckbox?: boolean;
  defaultDirectory?: boolean;
  showDirectoryCheckbox?: boolean;
}

export const MembershipModal = ({ 
  isOpen, 
  onClose, 
  title = "Membership Application",
  defaultJoinClub = true,
  showJoinClubCheckbox = false,
  defaultDirectory = true,
  showDirectoryCheckbox = true,
}: MembershipModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#1a3a3a]/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="relative w-full max-w-2xl bg-[#fbfaf8] rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-[#d4af37]/10 flex items-center justify-between bg-white">
              <div>
                <h2 className="text-2xl font-bold text-[#1a3a3a]">{title}</h2>
                <p className="text-sm text-slate-500">Join the ALT Business Connections cooperative</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="p-8 max-h-[80vh] overflow-y-auto">
              <ContactForm 
                onSuccess={onClose} 
                defaultJoinClub={defaultJoinClub}
                showJoinClubCheckbox={showJoinClubCheckbox}
                defaultDirectory={defaultDirectory}
                showDirectoryCheckbox={showDirectoryCheckbox}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
