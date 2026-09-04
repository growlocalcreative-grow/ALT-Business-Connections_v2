import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Button } from './UI';
import { Download, Smartphone } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <Button
        onClick={install}
        className="flex items-center gap-2 !px-4 !py-2 text-sm"
        variant="secondary"
      >
        <Download className="w-4 h-4" />
        Install App
      </Button>
    );
  }

  if (isIOS) {
    return (
      <>
        <Button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-2 !px-4 !py-2 text-sm"
          variant="secondary"
        >
          <Smartphone className="w-4 h-4" />
          Install on iOS
        </Button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl border border-[#d4af37]/20">
              <h3 className="text-2xl font-bold text-[#1a3a3a] mb-4 text-center">Install on iPhone / iPad</h3>
              <div className="space-y-4 text-slate-600 mb-8">
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-[#d4af37]/10 text-[#d4af37] rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <p className="pt-1">Tap the <span className="font-bold">Share</span> button in the Safari toolbar.</p>
                </div>
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-[#d4af37]/10 text-[#d4af37] rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <p className="pt-1">Scroll down and tap <span className="font-bold">Add to Home Screen</span>.</p>
                </div>
              </div>
              <Button
                onClick={() => setShowIOSGuide(false)}
                className="w-full"
              >
                Got it
              </Button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
