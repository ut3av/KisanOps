import React, { useState } from 'react';
import { Mic, Sparkles } from 'lucide-react';
import { VoiceAssistantModal } from './VoiceAssistantModal';

export const FloatingVoiceButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-emerald-600 to-agri-800 text-white rounded-full p-4 sm:px-5 sm:py-3.5 shadow-2xl flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all ring-4 ring-emerald-500/20 group cursor-pointer border border-emerald-400/30"
          title="बोलकर मशीन खोजें (Voice Assistant)"
        >
          <div className="relative">
            <Mic className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          </div>
          <span className="hidden sm:inline font-extrabold text-xs tracking-wide">
            बोलकर खोजें (Voice AI)
          </span>
        </button>
      </div>

      <VoiceAssistantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
