import React from 'react';
import MusicPlayer from './components/MusicPlayer';
import CricketGame from './components/CricketGame';
import { Music, LayoutGrid, Trophy, Headphones } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-sans relative flex flex-col overflow-hidden select-none">
      {/* Background Mesh Gradients */}
      <div className="mesh-gradients">
        <div />
        <div />
        <div />
      </div>

      {/* Top Navigation & Global Score (Refined Header) */}
      <header className="h-20 flex items-center justify-between px-8 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Headphones className="text-black" size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tighter text-white uppercase italic">
            Neon<span className="text-cyan-400">Stadium</span>
          </h1>
        </div>

        <div className="hidden md:flex bg-white/5 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full flex items-center gap-8 shadow-xl">
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Arena Status</span>
            <span className="text-lg font-mono font-bold text-cyan-400">ACTIVE</span>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <nav className="flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
            <a href="#" className="hover:text-cyan-400 transition-colors">Play</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Tracks</a>
            <a href="#" className="hover:text-pink-500 transition-colors">Stats</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Player</p>
            <p className="text-xs font-mono font-bold text-cyan-400">@NEON_PRO</p>
          </div>
          <div className="w-10 h-10 rounded-full border border-white/10 p-0.5 bg-white/5 backdrop-blur-sm">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-[10px] font-bold">NP</div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex gap-6 px-8 pb-8 overflow-hidden z-10">
        {/* Left Sidebar: Stats & Objectives (Frosted Look) */}
        <aside className="hidden xl:flex w-72 flex-col gap-4 overflow-hidden">
          <div className="frosted-glass rounded-3xl p-6 flex-grow flex flex-col overflow-y-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-white/5 pb-2">Objectives</h2>
            <div className="space-y-4">
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
                  <p className="text-xs font-bold text-white mb-2">Power Play</p>
                  <p className="text-[10px] text-slate-400 leading-relaxed mb-3 italic">Reach 50 runs to unlock the "Cyan Surge" visual pack.</p>
                  <div className="h-1 w-full bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full w-2/5 bg-purple-500 shadow-[0_0_10px_#a855f7]" />
                  </div>
                </div>

                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl opacity-60">
                   <p className="text-xs font-bold text-slate-400 mb-1 italic">High Tempo Beats</p>
                   <p className="text-[10px] text-slate-500">Play for 15 minutes straight.</p>
                </div>
            </div>

            <div className="mt-auto pt-6">
              <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl">
                 <p className="text-[10px] uppercase tracking-widest text-cyan-500 font-bold mb-1">Tip of the Game</p>
                 <p className="text-[10px] text-slate-400 italic">Watch for the red ball - it's a fast one!</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Center: Cricket Game Window (Matched with rounded-[40px]) */}
        <section className="flex-grow flex flex-col gap-6">
          <div className="flex-grow bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-[40px] relative overflow-hidden group shadow-2xl">
            <CricketGame />
          </div>

          <div className="lg:hidden flex-shrink-0">
             <MusicPlayer />
          </div>
        </section>

        {/* Right Sidebar: Music Player (Card style but frosted) */}
        <aside className="hidden lg:flex w-96 flex-col justify-center">
          <div className="frosted-glass rounded-[32px] p-8 shadow-2xl shadow-black/50">
             <h2 className="text-[10px] text-purple-400 uppercase tracking-[0.3em] font-black mb-6 text-center">System Audio</h2>
             <MusicPlayer />
             <div className="mt-6 flex justify-center gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/10" />
                ))}
             </div>
          </div>
        </aside>
      </main>

      {/* Floating Footer Branding */}
      <footer className="absolute bottom-6 right-8 text-[10px] text-white/10 uppercase tracking-[0.2em] font-medium pointer-events-none">
        Arena Sim v1.2.4 • NeonEngine Core
      </footer>
    </div>
  );
}

