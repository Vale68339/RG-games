import { useState, useEffect } from 'react';
import {
  Gamepad2,
  Search,
  AlertOctagon,
  Shield,
  Plus,
  X,
  Users,
  Menu
} from 'lucide-react';

export function Header({
  searchQuery,
  onSearchChange,
  onOpenAddModal,
  onOpenCloakModal,
  onTriggerPanic,
  panicKey,
  totalGamesCount,
  onToggleSidebar
}) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0F1115]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 shrink-0">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-lg text-white shadow-lg shadow-indigo-600/30">
            RG
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white">
                RG <span className="text-indigo-400">GAMES</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {totalGamesCount} Games
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden sm:block">
              HTML5 Iframe Game Catalog
            </p>
          </div>
        </div>

        {/* Search Bar - Sleek Pill */}
        <div className="flex-1 max-w-md mx-2 relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
            <input
              id="game-search-input"
              type="text"
              placeholder="Search games, categories, tags..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-10 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            {searchQuery ? (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 p-1 text-gray-400 hover:text-white rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>
        </div>

        {/* Header Action Buttons & Stats */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Active Players Stat */}
          <div className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#161920] border border-white/10 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-right">
              <span className="text-[10px] text-gray-400 block leading-tight">Players Online</span>
              <span className="font-mono font-bold text-indigo-400 leading-tight">14,802</span>
            </div>
          </div>

          {/* Panic Button */}
          <button
            id="panic-button"
            onClick={onTriggerPanic}
            title={`Panic stealth mode (Press '${panicKey}' key)`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 font-bold text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <AlertOctagon className="w-4 h-4 text-red-400 animate-pulse" />
            <span className="hidden sm:inline">PANIC</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.2 bg-red-950/60 rounded text-[10px] text-red-300 border border-red-500/30 font-mono">
              {panicKey}
            </kbd>
          </button>

          {/* Tab Cloaker Button */}
          <button
            id="cloak-modal-button"
            onClick={onOpenCloakModal}
            title="Disguise Tab Title & Favicon"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all cursor-pointer"
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Cloak</span>
          </button>

          {/* Add Game Button */}
          <button
            id="add-game-modal-button"
            onClick={onOpenAddModal}
            title="Add Custom Iframe Game"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/30 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Add Game</span>
          </button>
        </div>
      </div>
    </header>
  );
}

