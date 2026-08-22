import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Sparkles,
  Mic,
  MicOff,
  Send,
  X,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Trash2,
  Download,
  RotateCcw,
  Bot,
  User,
  Radio,
  Tractor,
  Layers,
  ChevronRight,
  Loader2,
  Copy,
  Check,
  Building2,
  Wheat,
  ShieldCheck
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import {
  YuktiMessage,
  YuktiLanguage,
  processYuktiQuery,
  getDefaultSuggestions,
} from '../../services/yuktiAiService';
import { YuktiActionCard } from './YuktiActionCard';
import clsx from 'clsx';

interface YuktiAiWidgetProps {
  initialOpen?: boolean;
}

export const YuktiAiWidget: React.FC<YuktiAiWidgetProps> = ({ initialOpen = false }) => {
  const { state } = useKisanOpsStore();
  const location = useLocation();

  // Widget States
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<YuktiLanguage>('hi');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  // Persona mode: Auto, Farmer, or CHC
  const [personaMode, setPersonaMode] = useState<'AUTO' | 'FARMER' | 'CHC'>('AUTO');

  // Messages History
  const [messages, setMessages] = useState<YuktiMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text:
        state.selectedRole === 'FARMER'
          ? `नमस्ते **${state.currentUser.fullName} जी**! 🙏 मैं **युक्ति AI (Yukti AI)** हूँ। मैं आपके 8 एकड़ खेत के लिए सही मशीन खोजने, AgriCredit सहायता, और मौसम अनुसार फसल कटाई सलाह में मदद कर सकता हूँ। बोलकर या लिखकर पूछें!`
          : `नमस्ते **${state.currentUser.fullName} जी**! 🏢 मैं **युक्ति AI**, आपका हब ऑपरेशन्स को-पायलट हूँ। सीहोर व भोपाल में 24 मशीनों की लाइव टेलीमैटिक्स, मांग पूर्वानुमान, और फ्लीट री-एलोकेशन के लिए तैयार हूँ।`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: 'hi',
      suggestedReplies: getDefaultSuggestions(state.selectedRole, true),
    },
  ]);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  // Sync with global custom event to open Yukti AI from anywhere
  useEffect(() => {
    const handleOpenTrigger = (e: any) => {
      setIsOpen(true);
      if (e.detail?.query) {
        handleSendMessage(e.detail.query);
      }
    };
    window.addEventListener('open-yukti-ai', handleOpenTrigger);
    return () => window.removeEventListener('open-yukti-ai', handleOpenTrigger);
  }, []);

  // Web Speech Synthesis (TTS) Helper
  const speakText = (text: string) => {
    if (isMuted || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Strip markdown bold and special symbols for cleaner speech
      const cleanText = text.replace(/[*#_•\n]/g, ' ').slice(0, 200);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = selectedLanguage === 'en' ? 'en-IN' : 'hi-IN';
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS not supported or blocked:', e);
    }
  };

  // Speech Recognition (STT) Setup
  const toggleSpeechRecognition = () => {
    if (isVoiceActive) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsVoiceActive(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in this browser. You can type your request below.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage === 'en' ? 'en-IN' : 'hi-IN';

      recognition.onstart = () => {
        setIsVoiceActive(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((res: any) => res[0].transcript)
          .join('');
        setInputText(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsVoiceActive(false);
      };

      recognition.onend = () => {
        setIsVoiceActive(false);
        if (inputText.trim()) {
          handleSendMessage(inputText);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start voice recognition:', err);
      setIsVoiceActive(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    setInputText('');
    const userMsg: YuktiMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: selectedLanguage,
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const aiResponse = await processYuktiQuery(
        query,
        state,
        selectedLanguage,
        location.pathname
      );

      setMessages(prev => [...prev, aiResponse]);

      // Speak response if voice audio not already supplied
      if (aiResponse.audioBase64 && audioPlayerRef.current) {
        audioPlayerRef.current.src = aiResponse.audioBase64;
        if (!isMuted) audioPlayerRef.current.play();
      } else {
        speakText(aiResponse.text);
      }
    } catch (err) {
      console.error('Yukti AI processing error:', err);
      const fallbackMsg: YuktiMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'assistant',
        text:
          selectedLanguage === 'en'
            ? "I encountered a minor processing delay. I've reconnected to KisanOps intelligence. Please try again!"
            : 'प्रसंस्करण में कुछ समय लग रहा है। कृपया पुनः प्रयास करें!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'assistant',
        text: 'चैट इतिहास साफ कर दिया गया है। नया प्रश्न पूछें!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedReplies: getDefaultSuggestions(state.selectedRole, true),
      },
    ]);
  };

  const handleExportChat = () => {
    const transcript = messages
      .map(m => `[${m.timestamp}] ${m.sender.toUpperCase()}: ${m.text}`)
      .join('\n\n');
    const blob = new Blob([transcript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Yukti_AI_Transcript_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentRole = state.selectedRole;
  const isFarmer = currentRole === 'FARMER';

  return (
    <>
      {/* Floating Trigger FAB Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 group">
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open Yukti AI Assistant"
            className="relative flex items-center gap-3 px-4 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-indigo-800 text-white shadow-2xl hover:shadow-emerald-500/25 transition-all transform hover:scale-105 active:scale-95 border border-white/20"
          >
            {/* Glowing Radar Pulse Ring */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-white text-[9px] font-black items-center justify-center text-slate-900">
                AI
              </span>
            </span>

            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-300">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>

            <div className="text-left pr-1 hidden sm:block">
              <div className="text-xs font-black tracking-tight leading-none flex items-center gap-1.5">
                <span>Yukti AI</span>
                <span className="text-[10px] font-bold text-amber-300">युक्ति</span>
              </div>
              <span className="text-[9px] text-emerald-100 font-medium leading-tight">
                {isFarmer ? 'Kisan Mitra • किसान साथी' : 'Fleet & Ops Co-Pilot'}
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Main AI Assistant Window / Drawer */}
      {isOpen && (
        <div
          className={clsx(
            'fixed z-50 transition-all duration-300 flex flex-col bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden',
            isExpanded
              ? 'inset-4 sm:inset-8 md:inset-12 rounded-3xl'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[440px] h-[640px] max-h-[88vh] rounded-3xl'
          )}
        >
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-emerald-900 p-4 text-white flex items-center justify-between shrink-0 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-400 shadow-inner">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base tracking-tight flex items-center gap-1.5">
                    <span>Yukti AI</span>
                    <span className="text-amber-400 text-xs font-bold">युक्ति</span>
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    {isFarmer ? 'Kisan Mitra' : 'Ops Hub'}
                  </span>
                </div>
                <p className="text-[10px] text-indigo-200 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>
                    {isFarmer ? 'Active: Ramesh Kumar (8.0 Acres)' : 'Active: Sehore CHC Grid'}
                  </span>
                </p>
              </div>
            </div>

            {/* Header Control Actions */}
            <div className="flex items-center gap-1 text-white/80">
              {/* Language Selector */}
              <div className="flex items-center bg-white/10 rounded-xl p-0.5 text-[11px] font-bold mr-1">
                <button
                  onClick={() => setSelectedLanguage('hi')}
                  className={clsx(
                    'px-2 py-1 rounded-lg transition-colors',
                    selectedLanguage === 'hi' ? 'bg-amber-400 text-indigo-950 shadow-sm' : 'text-white/80 hover:text-white'
                  )}
                >
                  हिन्दी
                </button>
                <button
                  onClick={() => setSelectedLanguage('en')}
                  className={clsx(
                    'px-2 py-1 rounded-lg transition-colors',
                    selectedLanguage === 'en' ? 'bg-amber-400 text-indigo-950 shadow-sm' : 'text-white/80 hover:text-white'
                  )}
                >
                  EN
                </button>
              </div>

              {/* Speech Mute Toggle */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                className="p-1.5 rounded-xl hover:bg-white/10 transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>

              {/* Maximize / Minimize Mode */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Collapse view' : 'Expand full screen'}
                className="p-1.5 rounded-xl hover:bg-white/10 transition-colors hidden sm:block"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Stream Area */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50 dark:bg-slate-950/50"
          >
            {messages.map(msg => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={clsx(
                    'flex flex-col',
                    isUser ? 'items-end' : 'items-start'
                  )}
                >
                  {/* Message Bubble Container */}
                  <div
                    className={clsx(
                      'max-w-[88%] sm:max-w-[82%] rounded-2xl p-3.5 text-xs shadow-sm transition-all',
                      isUser
                        ? 'bg-indigo-900 text-white rounded-br-none'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-none'
                    )}
                  >
                    {/* Assistant Message Header */}
                    {!isUser && (
                      <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-slate-100 dark:border-slate-700/50">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          <Bot className="w-3.5 h-3.5" />
                          <span>Yukti AI Assistant</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <span>{msg.timestamp}</span>
                          <button
                            onClick={() => handleCopyMessage(msg.id, msg.text)}
                            className="hover:text-slate-600 dark:hover:text-slate-200 ml-1"
                            title="Copy response"
                          >
                            {copiedMsgId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Formatted Text Content */}
                    <div className="leading-relaxed whitespace-pre-line font-medium">
                      {msg.text}
                    </div>

                    {/* Interactive Action Card if supplied */}
                    {msg.actionCard && (
                      <YuktiActionCard
                        card={msg.actionCard}
                        onActionTriggered={actionText => {
                          // Post a small follow-up
                          setMessages(prev => [
                            ...prev,
                            {
                              id: `ack-${Date.now()}`,
                              sender: 'system',
                              text: `✅ Action executed: ${actionText}`,
                              timestamp: new Date().toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              }),
                            },
                          ]);
                        }}
                      />
                    )}
                  </div>

                  {/* Suggested Quick Replies below latest assistant message */}
                  {!isUser && msg.suggestedReplies && msg.suggestedReplies.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                      {msg.suggestedReplies.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(suggestion)}
                          className="text-[11px] font-semibold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-900/60 text-indigo-900 dark:text-indigo-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 shadow-subtle hover:border-indigo-400 transition-all flex items-center gap-1 text-left"
                        >
                          <span>{suggestion}</span>
                          <ChevronRight className="w-3 h-3 text-indigo-400 shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-indigo-100 dark:border-slate-700 shadow-sm max-w-[200px]">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                <span className="text-xs font-bold animate-pulse">Yukti AI is thinking...</span>
              </div>
            )}
          </div>

          {/* Voice Active Recording Overlay Banner */}
          {isVoiceActive && (
            <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white p-3 flex items-center justify-between animate-pulse shrink-0">
              <div className="flex items-center gap-2 text-xs font-bold">
                <Mic className="w-4 h-4" />
                <span>Listening to your voice in {selectedLanguage === 'hi' ? 'Hindi' : 'English'}...</span>
              </div>
              <button
                onClick={toggleSpeechRecognition}
                className="px-2 py-0.5 bg-white text-rose-700 font-bold rounded-lg text-xs"
              >
                Done
              </button>
            </div>
          )}

          {/* Input & Microphone Bar */}
          <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0 space-y-2">
            <div className="flex items-center gap-2">
              {/* Push-to-Talk Voice Button */}
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                title={isVoiceActive ? 'Stop Listening' : 'Speak to Yukti AI'}
                className={clsx(
                  'p-3 rounded-2xl transition-all shadow-md flex items-center justify-center shrink-0 active:scale-95',
                  isVoiceActive
                    ? 'bg-rose-500 text-white animate-bounce ring-4 ring-rose-200'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                )}
              >
                {isVoiceActive ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Text Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  placeholder={
                    selectedLanguage === 'hi'
                      ? 'यहाँ बोलें या लिखें (उदा. "8 एकड़ के लिए हार्वेस्टर बुक करो")...'
                      : 'Ask Yukti AI (e.g. "Book harvester for 8 acres")...'
                  }
                  className="w-full pl-4 pr-10 py-3 bg-surface-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom utility bar */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 pt-1">
              <div className="flex items-center gap-2">
                <span>Powered by Yukti AI Neural Engine</span>
                <span>•</span>
                <button
                  onClick={handleClearHistory}
                  className="hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>

              <button
                onClick={handleExportChat}
                className="hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                <span>Export Chat</span>
              </button>
            </div>
          </div>

          {/* Hidden audio element for TTS playback */}
          <audio ref={audioPlayerRef} className="hidden" />
        </div>
      )}
    </>
  );
};

