import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={cn(
        "relative w-full max-w-lg glass-card bg-surface shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300",
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-bg-primary/50">
          <h3 className="text-xl font-sora font-bold">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-bg-primary text-text-muted transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
