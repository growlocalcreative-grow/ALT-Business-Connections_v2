import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-6 z-50 flex items-center gap-3 rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white shadow-2xl border border-amber-500/50"
        >
          <WifiOff className="w-5 h-5 animate-pulse" />
          <span>Offline Mode — Using cached data</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
