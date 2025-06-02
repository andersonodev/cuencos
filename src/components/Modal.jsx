import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, className = "" }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-[2000] overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className={`bg-[#1a1a1a] rounded-lg max-w-md w-full max-h-[90vh] shadow-xl relative ${className}`}>
        {/* Header do modal */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Fechar modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Conteúdo do modal */}
        <div className="overflow-y-auto max-h-[calc(90vh-4rem)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
