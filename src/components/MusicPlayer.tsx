import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Stadium Pulse',
    artist: 'Cyber Beats AI',
    albumArt: 'https://picsum.photos/seed/neon1/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: '2',
    title: 'Midnight Drive',
    artist: 'Lo-Fi Synthetics',
    albumArt: 'https://picsum.photos/seed/cyber/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    title: 'Boundary Blast',
    artist: 'Hardcore Bass',
    albumArt: 'https://picsum.photos/seed/galaxy/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />

      <div className="relative group w-full aspect-square mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTrack.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative"
          >
            <img
              src={currentTrack.albumArt}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </motion.div>
        </AnimatePresence>
        
        {isPlaying && (
          <div className="absolute -bottom-2 inset-x-0 flex items-center justify-center pointer-events-none">
            <div className="flex gap-1 items-end h-6">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [4, 16, 6, 20, 8] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.4 + i * 0.1,
                    ease: "easeInOut"
                  }}
                  className="w-1 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="text-center mb-8 w-full">
        <h3 className="text-lg font-bold text-white mb-1 uppercase tracking-tight">{currentTrack.title}</h3>
        <p className="text-xs text-slate-400 font-medium italic">{currentTrack.artist}</p>
      </div>

      <div className="w-full mb-8">
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mb-2">
          <motion.div
            className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
            animate={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 font-mono font-bold tracking-tighter">
          <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}</span>
          <span>{audioRef.current ? formatTime(audioRef.current.duration) : '0:00'}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-8 w-full">
        <button
          onClick={handlePrev}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <SkipBack size={24} />
        </button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-xl transition-all"
        >
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
        </motion.button>
        <button
          onClick={handleNext}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <SkipForward size={24} />
        </button>
      </div>
    </div>
  );
}

function formatTime(seconds: number) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
