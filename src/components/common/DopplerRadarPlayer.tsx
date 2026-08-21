import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CloudRain, Layers, Eye, EyeOff } from 'lucide-react';
import { fetchRainViewerRadarFrames, RainViewerRadarFrame } from '../../lib/weatherEngine';
import clsx from 'clsx';

interface DopplerRadarPlayerProps {
  onFrameChange: (tileUrl: string | null) => void;
  radarVisible: boolean;
  onToggleRadar: (visible: boolean) => void;
}

export const DopplerRadarPlayer: React.FC<DopplerRadarPlayerProps> = ({
  onFrameChange,
  radarVisible,
  onToggleRadar,
}) => {
  const [frames, setFrames] = useState<RainViewerRadarFrame[]>([]);
  const [host, setHost] = useState<string>('https://tilecache.rainviewer.com');
  const [currentFrameIdx, setCurrentFrameIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    fetchRainViewerRadarFrames().then(res => {
      setHost(res.host);
      setFrames(res.frames);
      if (res.frames.length > 0) {
        setCurrentFrameIdx(res.frames.length - 1);
      }
    });
  }, []);

  // Update tile URL when frame changes or radar toggles
  useEffect(() => {
    if (!radarVisible || frames.length === 0) {
      onFrameChange(null);
      return;
    }
    const frame = frames[currentFrameIdx];
    if (frame) {
      const tileUrl = `${host}${frame.path}/256/{z}/{x}/{y}/2/1_1.png`;
      onFrameChange(tileUrl);
    }
  }, [currentFrameIdx, radarVisible, frames, host]);

  // Animation loop
  useEffect(() => {
    let interval: any;
    if (isPlaying && radarVisible && frames.length > 0) {
      interval = setInterval(() => {
        setCurrentFrameIdx(prev => (prev + 1) % frames.length);
      }, 750);
    }
    return () => clearInterval(interval);
  }, [isPlaying, radarVisible, frames]);

  const currentTimestampStr = frames[currentFrameIdx]
    ? new Date(frames[currentFrameIdx].time * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Live';

  return (
    <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-elevated p-2.5 flex items-center gap-2 text-xs font-semibold">
      {/* Radar Toggle */}
      <button
        onClick={() => onToggleRadar(!radarVisible)}
        className={clsx(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all font-bold',
          radarVisible
            ? 'bg-sky-600 text-white shadow-sm'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        )}
      >
        <CloudRain className="w-3.5 h-3.5" />
        <span>{radarVisible ? 'Doppler Radar ON' : 'Show Doppler Radar'}</span>
      </button>

      {radarVisible && frames.length > 0 && (
        <>
          <div className="h-4 w-px bg-slate-200 mx-0.5" />

          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            title={isPlaying ? 'Pause radar animation' : 'Play radar animation'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* Timeline Range Slider */}
          <input
            type="range"
            min={0}
            max={frames.length - 1}
            value={currentFrameIdx}
            onChange={e => {
              setIsPlaying(false);
              setCurrentFrameIdx(parseInt(e.target.value, 10));
            }}
            className="w-20 sm:w-28 accent-sky-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />

          <span className="font-mono text-[11px] text-slate-600 shrink-0">
            {currentTimestampStr}
          </span>
        </>
      )}
    </div>
  );
};
