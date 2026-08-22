import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CloudRain, Layers, Eye, EyeOff, Info } from 'lucide-react';
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
  const [showInfo, setShowInfo] = useState<boolean>(false);

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
    <div className="relative">
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-elevated p-2.5 flex flex-wrap items-center gap-2 text-xs font-semibold">
        {/* Radar Toggle */}
        <button
          onClick={() => onToggleRadar(!radarVisible)}
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all font-bold cursor-pointer',
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
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
              title={isPlaying ? 'Pause radar animation' : 'Play live cloud radar loop'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-sky-700" />}
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

            <span className="font-mono text-[11px] text-slate-700 font-bold shrink-0">
              {currentTimestampStr}
            </span>

            {/* Intensity Legend */}
            <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-500 font-normal pl-1 border-l border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="Light rain" />
              <span className="w-2 h-2 rounded-full bg-amber-400" title="Moderate rain" />
              <span className="w-2 h-2 rounded-full bg-rose-500" title="Heavy downpour" />
            </div>

            {/* Info toggle */}
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              title="What is Doppler Radar Play?"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>

      {showInfo && radarVisible && (
        <div className="absolute bottom-full left-0 mb-2 w-72 bg-slate-900 text-white text-[11px] p-3 rounded-2xl shadow-xl z-50 space-y-1 animate-in fade-in">
          <div className="font-bold flex items-center gap-1.5 text-sky-300">
            <CloudRain className="w-3.5 h-3.5" />
            <span>Doppler Satellite Cloud Radar</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[10px]">
            Animates live satellite precipitation reflectivity over the last 2 hours. Use Play to track moving rain fronts before dispatching harvesters or spraying crops.
          </p>
        </div>
      )}
    </div>
  );
};
