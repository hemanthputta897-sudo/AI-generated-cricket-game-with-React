import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Play } from 'lucide-react';

interface Ball {
  x: number;
  y: number;
  radius: number;
  speed: number;
  active: boolean;
  type: 'spin' | 'fast';
}

export default function CricketGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameOver'>('menu');
  const [feedback, setFeedback] = useState<string | null>(null);
  
  const ballRef = useRef<Ball>({ x: 0, y: 0, radius: 8, speed: 0, active: false, type: 'fast' });
  const animationRef = useRef<number>(0);
  const pitchY = 400; // Batsman position
  const hitZoneStart = pitchY - 40;
  const hitZoneEnd = pitchY + 20;

  const startNewBall = useCallback(() => {
    const isSpin = Math.random() > 0.7;
    ballRef.current = {
      x: 200, // Center of 400px canvas
      y: 50,
      radius: 8,
      speed: isSpin ? 4 + Math.random() * 2 : 7 + Math.random() * 3,
      active: true,
      type: isSpin ? 'spin' : 'fast'
    };
    setFeedback(null);
  }, []);

  const handleHit = useCallback(() => {
    if (!ballRef.current.active || gameState !== 'playing') return;

    const ballY = ballRef.current.y;
    
    if (ballY >= hitZoneStart && ballY <= hitZoneEnd) {
      const center = (hitZoneStart + hitZoneEnd) / 2;
      const precision = 1 - Math.abs(ballY - center) / (hitZoneEnd - hitZoneStart);
      
      let runs = 1;
      if (precision > 0.9) runs = 6;
      else if (precision > 0.75) runs = 4;
      else if (precision > 0.5) runs = 2;
      
      setScore(s => s + runs);
      setFeedback(`${runs} RUN${runs > 1 ? 'S' : ''}!`);
      ballRef.current.active = false;
      setTimeout(startNewBall, 1000);
    } else {
      setFeedback('OUT!');
      setWickets(w => w + 1);
      ballRef.current.active = false;
      if (wickets >= 2) {
        setGameState('gameOver');
        if (score > highScore) setHighScore(score);
      } else {
        setTimeout(startNewBall, 1000);
      }
    }
  }, [gameState, startNewBall, wickets, score, highScore, hitZoneEnd, hitZoneStart]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Pitch (Design HTML inspired)
      const gradient = ctx.createLinearGradient(120, 0, 280, 0);
      gradient.addColorStop(0, 'rgba(30, 41, 59, 0.4)');
      gradient.addColorStop(0.5, 'rgba(51, 65, 85, 0.6)');
      gradient.addColorStop(1, 'rgba(30, 41, 59, 0.4)');
      ctx.fillStyle = gradient;
      ctx.fillRect(110, 0, 180, canvas.height);

      // Draw Crease (Cyan 400 shadow)
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#22d3ee';
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(110, pitchY);
      ctx.lineTo(290, pitchY);
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      // Draw Hit Zone (Refined Purple)
      ctx.fillStyle = 'rgba(168, 85, 247, 0.1)';
      ctx.fillRect(110, hitZoneStart, 180, hitZoneEnd - hitZoneStart);

      // Draw Stumps (Cyan 400)
      ctx.fillStyle = '#22d3ee';
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(175 + i * 21, pitchY + 30, 6, 40);
      }

      // Update and Draw Ball (Pink 500 shadow)
      if (ballRef.current.active && gameState === 'playing') {
        ballRef.current.y += ballRef.current.speed;
        
        ctx.shadowBlur = 20;
        ctx.shadowColor = ballRef.current.type === 'fast' ? '#ec4899' : '#a855f7';
        
        const ballGrad = ctx.createRadialGradient(
          ballRef.current.x, ballRef.current.y, 1,
          ballRef.current.x, ballRef.current.y, ballRef.current.radius
        );
        ballGrad.addColorStop(0, '#fff');
        ballGrad.addColorStop(1, ballRef.current.type === 'fast' ? '#ec4899' : '#a855f7');
        
        ctx.beginPath();
        ctx.arc(ballRef.current.x, ballRef.current.y, ballRef.current.radius, 0, Math.PI * 2);
        ctx.fillStyle = ballGrad;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (ballRef.current.y > canvas.height) {
          setFeedback('OUT!');
          setWickets(w => w + 1);
          ballRef.current.active = false;
          if (wickets >= 2) {
            setGameState('gameOver');
            if (score > highScore) setHighScore(score);
          } else {
            setTimeout(startNewBall, 1000);
          }
        }
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [gameState, wickets, score, highScore, hitZoneEnd, hitZoneStart, startNewBall]);

  const startGame = () => {
    setScore(0);
    setWickets(0);
    setGameState('playing');
    startNewBall();
  };

  return (
    <div className="flex flex-col items-center h-full w-full relative overflow-hidden bg-transparent">
      {/* Top HUD (Design HTML inspired) */}
      <div className="absolute top-6 left-6 right-6 flex justify-between z-10">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 min-w-[120px]">
          <p className="text-[10px] uppercase text-slate-500 font-bold mb-1 tracking-widest">Score</p>
          <p className="text-2xl font-mono font-bold text-cyan-400">
            {score} <span className="text-sm text-slate-500">/ {wickets}</span>
          </p>
        </div>

        <div className="bg-black/40 border border-white/10 backdrop-blur-md p-4 rounded-2xl min-w-[150px] text-right">
          <p className="text-[10px] uppercase text-slate-500 font-bold mb-1 tracking-widest">Personal Best</p>
          <div className="flex items-center justify-end gap-2">
            <Trophy size={14} className="text-yellow-500" />
            <p className="text-2xl font-mono font-bold text-white tracking-tighter">{highScore}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full flex items-center justify-center relative touch-none" onClick={handleHit}>
        <canvas
          ref={canvasRef}
          width={400}
          height={600}
          className="max-h-[90%] w-auto"
        />

        {/* Feedback Overlay */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 0 }}
              animate={{ scale: 1.2, opacity: 1, y: -50 }}
              exit={{ opacity: 0 }}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-black italic tracking-tighter drop-shadow-[0_0_20px_rgba(0,0,0,1)] ${
                feedback === 'OUT!' ? 'text-pink-500' : 'text-cyan-400'
              }`}
            >
              {feedback}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Menu/GameOver Overlay */}
        {(gameState === 'menu' || gameState === 'gameOver') && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center z-20">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="max-w-xs frosted-glass p-8 rounded-3xl"
            >
              <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">
                {gameState === 'menu' ? 'NEON STADIUM' : 'MATCH END'}
              </h2>
              <p className="text-slate-400 text-xs mb-8 leading-relaxed">
                {gameState === 'menu' 
                  ? 'Time your swing when the ball enters the purple zone.' 
                  : `Innings concluded with ${score} runs.`}
              </p>
              
              <button
                onClick={(e) => { e.stopPropagation(); startGame(); }}
                className="w-full relative inline-flex items-center justify-center px-8 py-4 font-bold text-black transition-all duration-200 bg-white rounded-xl focus:outline-none hover:scale-105 active:scale-95"
              >
                <span className="relative flex items-center gap-2 uppercase tracking-widest text-xs">
                  {gameState === 'menu' ? <Play size={16} fill="currentColor" /> : <RotateCcw size={16} />}
                  {gameState === 'menu' ? 'Enter Arena' : 'New Innings'}
                </span>
              </button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Control Info Overlay (Design HTML inspired) */}
      <div className="absolute bottom-10 left-10 hidden lg:flex gap-4 z-10 pointer-events-none opacity-50 transition-opacity group-hover:opacity-100">
        <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-xl font-bold">W</div>
            <span className="text-[10px] mt-1 text-slate-400 uppercase font-bold tracking-widest">Swing</span>
        </div>
        <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-xl font-bold">S</div>
            <span className="text-[10px] mt-1 text-slate-400 uppercase font-bold tracking-widest">Drive</span>
        </div>
      </div>
    </div>
  );
}
