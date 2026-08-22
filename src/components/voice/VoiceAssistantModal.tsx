import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Send,
  Sparkles,
  Tractor,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  ArrowRight,
  Radio,
  Clock,
  Wheat,
  Zap,
  Check
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { globalVoiceController } from '../../routes/voice.routes';
import { BrowserTTSService } from '../../services/tts/tts.service';
import {
  VoiceProcessResponse,
  ConversationTurn,
  MatchedMachineResult,
  BookingDraft
} from '../../types/voice';
import { RazorpayCheckoutModal } from '../common/RazorpayCheckoutModal';
import { BrandedReceiptModal } from '../common/BrandedReceiptModal';
import { MachineThumbnail } from '../common/MachineThumbnail';
import clsx from 'clsx';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type VoiceUiState =
  | 'IDLE'
  | 'LISTENING'
  | 'PROCESSING'
  | 'SEARCHING'
  | 'SPEAKING'
  | 'ERROR';

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { state, createBooking } = useKisanOpsStore();
  const { farm, machines, currentUser, agriCredit, invoices } = state;

  const [uiState, setUiState] = useState<VoiceUiState>('IDLE');
  const [typedText, setTypedText] = useState<string>('');
  const [history, setHistory] = useState<ConversationTurn[]>([]);
  const [matchedMachines, setMatchedMachines] = useState<MatchedMachineResult[]>([]);
  const [bookingDraft, setBookingDraft] = useState<BookingDraft | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState<boolean>(false);
  const [completedInvoice, setCompletedInvoice] = useState<any>(null);

  const sessionIdRef = useRef<string>(`session-${Date.now()}`);
  const ttsServiceRef = useRef<BrowserTTSService>(new BrowserTTSService());
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Initial Hindi greeting
  useEffect(() => {
    if (isOpen && history.length === 0) {
      const initialGreeting =
        farm.sizeAcres > 0
          ? `नमस्ते ${currentUser.fullName}! बताइए, आपके ${farm.sizeAcres} एकड़ खेत के लिए किस मशीन की ज़रूरत है?`
          : `नमस्ते ${currentUser.fullName}! बताइए, आपको किस काम के लिए मशीन चाहिए? जैसे कटाई, जुताई या बुवाई?`;

      const initialTurn: ConversationTurn = {
        id: `turn-init-${Date.now()}`,
        speaker: 'assistant',
        text: initialGreeting,
        timestamp: new Date().toISOString(),
      };

      setHistory([initialTurn]);
      if (!isMuted) {
        ttsServiceRef.current.speak(initialGreeting);
      }
    }
  }, [isOpen, farm, currentUser]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [history, uiState, matchedMachines]);

  // Clean up audio on modal close
  useEffect(() => {
    if (!isOpen) {
      ttsServiceRef.current.stop();
      stopRecordingCleanup();
    }
  }, [isOpen]);

  const stopRecordingCleanup = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
  };

  // Farmer Context definition
  const getFarmerContext = () => ({
    farmer_id: currentUser.id,
    farmer_name: currentUser.fullName,
    farmer_phone: currentUser.phoneNumber,
    farm_acres: farm.sizeAcres > 0 ? farm.sizeAcres : 8.0,
    district: farm.district || 'Sehore',
    village: farm.village || 'Bilkisganj',
    current_crop: farm.crop?.cropName || 'Wheat',
    soil_type: farm.soilType || 'Medium Black Clayey Loam',
    available_credit: agriCredit.availableCredit,
  });

  // Handle Speech-to-Text Recording
  const startRecording = async () => {
    setErrorMessage(null);
    ttsServiceRef.current.stop();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleAudioProcessing(audioBlob);
      };

      recorder.start();
      setUiState('LISTENING');
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 29) {
            stopRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.warn('Microphone access issue:', err);
      // Seamless browser speech recognition fallback if permission or media stream issue
      startBrowserSpeechFallback();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setUiState('PROCESSING');
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  const startBrowserSpeechFallback = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setUiState('LISTENING');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleTextTurn(transcript);
      };

      recognition.onerror = (e: any) => {
        setUiState('IDLE');
        setErrorMessage('माइक्रोफोन में समस्या है। आप नीचे लिखकर भी बता सकते हैं।');
      };

      recognition.start();
    } else {
      setUiState('IDLE');
      setErrorMessage('माइक्रोफोन की अनुमति नहीं मिली। आप नीचे लिखकर भी बता सकते हैं।');
    }
  };

  const handleAudioProcessing = async (audioBlob: Blob) => {
    setUiState('SEARCHING');
    try {
      const response = await globalVoiceController.processAudio({
        audioBlob,
        sessionId: sessionIdRef.current,
        machines,
        context: getFarmerContext(),
        onExecuteBooking: handleExecuteBooking,
      });

      applyTurnResponse(response);
    } catch (err) {
      setUiState('ERROR');
      setErrorMessage('इंटरनेट कनेक्शन में समस्या है। कृपया दोबारा कोशिश करें।');
    }
  };

  const handleTextTurn = (text: string) => {
    if (!text.trim()) return;
    setErrorMessage(null);
    setUiState('PROCESSING');
    ttsServiceRef.current.stop();

    const response = globalVoiceController.processText({
      text: text.trim(),
      sessionId: sessionIdRef.current,
      machines,
      context: getFarmerContext(),
      onExecuteBooking: handleExecuteBooking,
    });

    applyTurnResponse(response);
  };

  const applyTurnResponse = (response: VoiceProcessResponse) => {
    // Add user turn & assistant turn
    const newTurns: ConversationTurn[] = [
      {
        id: `user-${Date.now()}`,
        speaker: 'user',
        text: response.transcribed_text,
        timestamp: new Date().toISOString(),
      },
      {
        id: `asst-${Date.now()}`,
        speaker: 'assistant',
        text: response.assistant_response_text,
        timestamp: new Date().toISOString(),
      },
    ];

    setHistory((prev) => [...prev, ...newTurns]);
    setMatchedMachines(response.matched_machines);
    setBookingDraft(response.booking_draft || null);

    setUiState('SPEAKING');
    if (!isMuted) {
      ttsServiceRef.current.speak(response.assistant_response_text).then(() => {
        setUiState('IDLE');
      });
    } else {
      setUiState('IDLE');
    }
  };

  const handleExecuteBooking = (draft: BookingDraft) => {
    const booking = createBooking({
      farmerId: currentUser.id,
      farmerName: currentUser.fullName,
      farmerPhone: currentUser.phoneNumber,
      chcId: draft.chc_id,
      chcName: draft.chc_name,
      machineId: draft.machine_id,
      machineIdentifier: 'MH-CAN-01',
      machineModel: draft.machine_model,
      machineCategory: 'HARVESTER',
      farmId: farm.id,
      farmName: farm.farmName,
      farmLocation: `${farm.village ? farm.village + ', ' : ''}${farm.district} (${farm.sizeAcres} Acres)`,
      activity: draft.activity,
      status: 'CONFIRMED',
      bookingMode: 'HOURLY',
      bookedHours: draft.booked_hours,
      startTime: `${draft.target_date}T08:00:00.000Z`,
      endTime: `${draft.target_date}T14:00:00.000Z`,
      hourlyRate: draft.hourly_rate,
      estimatedTotal: draft.estimated_total,
      paymentMethod: draft.payment_method,
      paymentStatus: draft.payment_method === 'AGRICREDIT_DEFERRED' ? 'AUTHORIZED' : 'CAPTURED',
      operatorName: 'Raju Verma (Certified Operator)',
      operatorPhone: '+91 97550 12399',
    });

    const inv = invoices.find((i) => i.bookingId === booking.id);
    if (inv) setCompletedInvoice(inv);

    return booking;
  };

  const handleSpeakText = (text: string) => {
    ttsServiceRef.current.stop();
    ttsServiceRef.current.speak(text);
  };

  // 1-Click Deterministic Demo Trigger for Ramesh Kumar
  const handleDemoScenario = () => {
    handleTextTurn('भैया कल मेरे 8 एकड़ गेहूं की कटाई करनी है, सीहोर में कोई हार्वेस्टर मिल जाएगा?');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto font-sans">
      <div className="bg-white rounded-[32px] max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 my-auto max-h-[92vh] flex flex-col justify-between overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-agri-800 text-white flex items-center justify-center font-bold shadow-sm">
              <Sparkles className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  Yukti आवाज़ सहायक
                </h2>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-md uppercase">
                  Voice AI
                </span>
              </div>
              <p className="text-xs text-slate-500">
                बोलकर मशीन खोजें, किराया पता करें और तुरंत बुकिंग करें
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Mute Toggle */}
            <button
              onClick={() => {
                const nextMuted = !isMuted;
                setIsMuted(nextMuted);
                if (nextMuted) ttsServiceRef.current.stop();
              }}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-emerald-600" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Conversation Stream */}
        <div
          ref={chatScrollRef}
          className="flex-1 overflow-y-auto space-y-4 py-3 pr-1 text-xs sm:text-sm min-h-[260px] max-h-[420px]"
        >
          {/* Conversational turns */}
          {history.map((turn) => {
            const isUser = turn.speaker === 'user';
            return (
              <div
                key={turn.id}
                className={clsx(
                  'flex items-start gap-2.5 animate-in fade-in',
                  isUser ? 'justify-end' : 'justify-start'
                )}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Tractor className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={clsx(
                    'p-3.5 rounded-2xl max-w-[85%] sm:max-w-[75%] leading-relaxed shadow-2xs space-y-1.5',
                    isUser
                      ? 'bg-agri-800 text-white rounded-br-none font-medium'
                      : 'bg-surface-50 border border-slate-200 text-slate-900 rounded-bl-none'
                  )}
                >
                  <p>{turn.text}</p>
                  {!isUser && (
                    <div className="flex items-center justify-end gap-1 pt-1">
                      <button
                        onClick={() => handleSpeakText(turn.text)}
                        className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>फिर से सुनें</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Real-Time Machine Recommendations Cards */}
          {matchedMachines.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>उपलब्ध मशीनें ({matchedMachines.length})</span>
                <span className="text-emerald-700 font-extrabold">स्मार्ट मैचिंग सक्रिय</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchedMachines.slice(0, 2).map((item, idx) => (
                  <div
                    key={item.machine.id}
                    className="p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-subtle space-y-2 relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-flex items-center gap-1 border border-emerald-200 mb-1">
                          <Sparkles className="w-3 h-3" />
                          <span>{item.match_score}% मैच</span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-sm">
                          {item.machine.brand} {item.machine.model}
                        </h4>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-agri-700" />
                          <span>{item.distance_km} किमी दूर • {item.machine.chcName}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-black text-agri-950">
                          ₹{item.price_quote.quotedRatePerHour}/घंटा
                        </div>
                        <div className="text-[10px] text-slate-500">पारदर्शी दर</div>
                      </div>
                    </div>

                    {/* Suitability Points */}
                    <div className="text-[11px] text-slate-600 bg-surface-50 p-2 rounded-xl border border-slate-100 space-y-0.5">
                      {item.reasons.slice(0, 2).map((r, i) => (
                        <div key={i} className="flex items-center gap-1.5 truncate">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{r}</span>
                        </div>
                      ))}
                    </div>

                    {/* Book Buttons */}
                    <div className="pt-1 flex items-center gap-2">
                      <button
                        onClick={() => handleTextTurn(`हाँ, ${item.machine.brand} हार्वेस्टर बुक कर दो`)}
                        className="btn-primary text-xs py-2 px-3 flex-1 flex items-center justify-center gap-1 shadow-2xs font-bold"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>बोलकर बुक करें</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Explicit Booking Draft Confirmation Summary */}
          {bookingDraft && (
            <div className="p-4 bg-emerald-50/80 border border-emerald-300/80 rounded-2xl space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <span className="font-extrabold text-xs text-emerald-950 uppercase">
                    बुकिंग सारांश (Booking Verification)
                  </span>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                  AgriCredit पात्र
                </span>
              </div>

              <div className="text-xs space-y-1 text-slate-800 font-medium">
                <div className="flex justify-between">
                  <span>मशीन:</span>
                  <span className="font-bold">{bookingDraft.machine_model}</span>
                </div>
                <div className="flex justify-between">
                  <span>तारीख व समय:</span>
                  <span className="font-bold">{bookingDraft.target_date} (6 घंटे)</span>
                </div>
                <div className="flex justify-between">
                  <span>प्रति घंटा दर:</span>
                  <span className="font-mono font-bold">₹{bookingDraft.hourly_rate}/hr</span>
                </div>
                <div className="flex justify-between border-t border-emerald-200 pt-1 text-sm font-extrabold text-slate-900">
                  <span>कुल अनुमानित भुगतान:</span>
                  <span className="font-mono text-emerald-800">
                    ₹{bookingDraft.estimated_total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleTextTurn('हाँ, पक्की कर दो')}
                  className="btn-primary text-xs py-2.5 px-4 flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>हाँ, बुकिंग पक्की करें</span>
                </button>
                <button
                  onClick={() => setShowRazorpayModal(true)}
                  className="btn-secondary text-xs py-2.5 px-3 flex items-center gap-1 font-bold"
                >
                  <span>Pay with Razorpay</span>
                </button>
                <button
                  onClick={() => handleTextTurn('नहीं, रद्द करो')}
                  className="btn-secondary text-xs py-2.5 px-3 text-rose-700 hover:bg-rose-50 border-rose-200 font-bold"
                >
                  <span>रद्द करें</span>
                </button>
              </div>
            </div>
          )}

          {/* Status Indicator Bar */}
          {uiState === 'LISTENING' && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-900 animate-pulse">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600 animate-ping" />
                <span className="font-bold">सुन रहा हूँ... अपनी आवाज़ में बोलिए</span>
              </div>
              <span className="font-mono font-bold text-emerald-700">{recordingSeconds}s / 30s</span>
            </div>
          )}

          {uiState === 'PROCESSING' && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2 text-xs text-amber-900">
              <RotateCw className="w-4 h-4 text-amber-600 animate-spin" />
              <span>समझ रहा हूँ...</span>
            </div>
          )}

          {uiState === 'SEARCHING' && (
            <div className="p-3 bg-sky-50 border border-sky-200 rounded-2xl flex items-center gap-2 text-xs text-sky-900">
              <Tractor className="w-4 h-4 text-sky-600 animate-bounce" />
              <span>आपके लिए मशीन ढूंढ रहा हूँ...</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Footer Voice & Input Controls */}
        <div className="border-t border-slate-100 pt-4 space-y-3 shrink-0">
          {/* Main Large Voice Microphone Button */}
          <div className="flex items-center justify-center gap-4">
            {uiState === 'LISTENING' ? (
              <button
                onClick={stopRecording}
                className="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all ring-8 ring-rose-100 animate-pulse cursor-pointer"
                title="Stop Recording"
              >
                <MicOff className="w-8 h-8" />
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-agri-800 text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all ring-8 ring-emerald-100/80 cursor-pointer"
                title="Tap to Speak"
              >
                <Mic className="w-8 h-8" />
              </button>
            )}
          </div>

          <div className="text-center">
            <span className="text-[11px] font-bold text-slate-500">
              {uiState === 'LISTENING' ? 'रोकने के लिए टैप करें' : 'बोलने के लिए माइक दबाएं (Tap Mic to Speak)'}
            </span>
          </div>

          {/* Quick 1-Click Demo Shortcut & Text Fallback */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleDemoScenario}
              className="text-[11px] bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl px-2.5 py-2 font-bold flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>⚡ Ramesh Demo (Sehore Wheat)</span>
            </button>

            {/* Typed Text Input Fallback */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleTextTurn(typedText);
                setTypedText('');
              }}
              className="flex-1 flex items-center gap-1"
            >
              <input
                type="text"
                placeholder="या यहाँ लिखें... (e.g. कल हार्वेस्टर चाहिए)"
                value={typedText}
                onChange={(e) => setTypedText(e.target.value)}
                className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!typedText.trim()}
                className="p-2 rounded-xl bg-agri-800 text-white hover:bg-agri-900 disabled:opacity-40 transition-colors shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Razorpay Online Checkout Integration */}
        {showRazorpayModal && bookingDraft && (
          <RazorpayCheckoutModal
            amountRupees={bookingDraft.estimated_total}
            customerName={currentUser.fullName}
            customerPhone={currentUser.phoneNumber}
            bookingDescription={`Voice Booking: ${bookingDraft.machine_model}`}
            onSuccess={(paymentId) => {
              setShowRazorpayModal(false);
              const b = handleExecuteBooking(bookingDraft);
              handleTextTurn('हाँ, भुगतान सफल रहा!');
            }}
            onClose={() => setShowRazorpayModal(false)}
          />
        )}

        {/* Branded Receipt Modal on Successful Booking */}
        {completedInvoice && (
          <BrandedReceiptModal
            invoice={completedInvoice}
            onClose={() => setCompletedInvoice(null)}
          />
        )}
      </div>
    </div>
  );
};
