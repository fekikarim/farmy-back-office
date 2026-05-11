import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = 'Initializing Farmy Command Center...' }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-dark-bg/95 backdrop-blur-sm transition-all animate-in fade-in duration-500">
      <div className="relative mb-8">
        {/* Pulsing ring background */}
        <div className="absolute inset-0 bg-accent-primary/20 rounded-full animate-ping scale-150" />
        
        {/* Central Logo/Icon */}
        <div className="relative bg-[#1A2315] p-6 rounded-full border border-accent-primary/30 shadow-accent-glow">
          <img 
            src="/assets/logo-app-no-bg.png" 
            alt="Farmy" 
            className="h-16 w-auto"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement!.innerHTML += '<span class="text-accent-primary text-3xl font-sora font-bold">F</span>';
            }}
          />
        </div>
      </div>
      
      {/* Loading Text */}
      <div className="flex flex-col items-center gap-4 max-w-xs text-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 text-accent-primary animate-spin" />
          <p className="text-white font-sora font-medium tracking-wide">{message}</p>
        </div>
        <div className="w-48 h-1 bg-border/20 rounded-full overflow-hidden">
          <div className="h-full bg-accent-primary animate-loading-bar" />
        </div>
        <p className="text-dark-text text-[10px] uppercase tracking-[0.2em] font-bold mt-2 opacity-60">
          Secure Connection Established
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-bar {
          width: 50%;
          animation: loading-bar 1.5s infinite linear;
        }
      `}} />
    </div>
  );
};

export default LoadingOverlay;
