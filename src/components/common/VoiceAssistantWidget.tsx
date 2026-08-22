import React, { useState, useRef } from 'react';
import { Mic, MicOff, Loader2, Volume2, X } from 'lucide-react';

export const VoiceAssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [assistantReply, setAssistantReply] = useState('');
  const [error, setError] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      setError('');
      setTranscription('');
      setAssistantReply('');
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError('Microphone access denied or error occurred.');
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio_file', audioBlob, 'recording.webm');

      const response = await fetch('http://localhost:8000/api/voice/process-audio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process audio');
      }

      const data = await response.json();
      setTranscription(data.transcribed_text);
      setAssistantReply(data.assistant_response_text);
      
      if (data.audio_base64) {
        if (audioPlayerRef.current) {
          audioPlayerRef.current.src = data.audio_base64;
          audioPlayerRef.current.play();
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to connect to the Voice Assistant API. Ensure backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 mb-4 w-80 sm:w-96 border border-gray-200 dark:border-gray-700 transition-all">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              KisanOps Voice Assistant
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex flex-col gap-3 min-h-[100px] max-h-[300px] overflow-y-auto mb-4 p-2 bg-gray-50 dark:bg-gray-900 rounded-xl">
            {error ? (
              <div className="text-red-500 text-sm">{error}</div>
            ) : transcription || assistantReply ? (
              <>
                {transcription && (
                  <div className="self-end bg-emerald-100 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-100 p-3 rounded-l-xl rounded-tr-xl max-w-[85%] text-sm shadow-sm">
                    {transcription}
                  </div>
                )}
                {assistantReply && (
                  <div className="self-start bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-r-xl rounded-tl-xl max-w-[85%] text-sm shadow-sm mt-2">
                    {assistantReply}
                  </div>
                )}
              </>
            ) : (
              <div className="text-gray-500 text-center text-sm mt-8">
                Tap the microphone below and speak in Hindi or Hinglish.
                <br/><br/>
                <span className="italic">"मुझे कल 5 एकड़ खेत के लिए रोटावेटर चाहिए।"</span>
              </div>
            )}
            
            {isLoading && (
              <div className="self-start flex items-center gap-2 text-emerald-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Processing...</span>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`p-4 rounded-full shadow-lg transition-all transform active:scale-95 ${
                isRecording 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
          </div>
          <p className="text-xs text-center text-gray-400 mt-3">
            {isRecording ? 'Release to send' : 'Hold to speak'}
          </p>
          
          {/* Hidden audio player */}
          <audio ref={audioPlayerRef} className="hidden" />
        </div>
      )}

      {/* FAB Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <Mic className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};
