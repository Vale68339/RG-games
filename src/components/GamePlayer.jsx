import { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Maximize2,
  Minimize2,
  RotateCcw,
  ExternalLink,
  Star,
  Tv,
  Keyboard,
  Share2,
  Check,
  Tag
} from 'lucide-react';
import { GameThumbnail } from './GameThumbnail.jsx';

export function GamePlayer({
  game,
  onBack,
  isFavorite,
  onToggleFavorite,
  userRating,
  onRateGame,
  onSelectGame,
  allGames
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  // Reload iframe
  const handleReload = () => {
    setIframeKey(prev => prev + 1);
  };

  // Fullscreen toggle
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Open game in about:blank stealth window (classic unblocked games feature)
  const openInCloakedTab = () => {
    const win = window.open('about:blank', '_blank');
    if (!win) {
      alert('Popups may be blocked. Please allow popups to open game in a new tab.');
      return;
    }
    const doc = win.document;
    doc.title = game.title;
    const body = doc.body;
    body.style.margin = '0';
    body.style.height = '100vh';
    body.style.backgroundColor = '#020617';
    body.style.overflow = 'hidden';

    const iframe = doc.createElement('iframe');
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.margin = '0';
    iframe.setAttribute('allow', 'fullscreen; gamepad; autoplay');

    if (game.iframeType === 'srcdoc') {
      iframe.srcdoc = game.iframeSource;
    } else {
      iframe.src = game.iframeSource;
    }
    body.appendChild(iframe);
  };

  // Copy link
  const copyGameShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Related games
  const relatedGames = allGames
    .filter(g => g.id !== game.id && (g.category === game.category || g.tags.some(t => game.tags.includes(t))))
    .slice(0, 4);

  return (
    <div className="w-full space-y-6">
      {/* Top Breadcrumb & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#161920] border border-white/10 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            id="player-back-button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Games</span>
          </button>
          <div className="h-4 w-[1px] bg-white/10" />
          <div>
            <h1 className="font-extrabold text-white text-base flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-white/5 border border-white/10">
                <GameThumbnail
                  thumbnail={game.thumbnail}
                  alt={game.title}
                  className="w-full h-full object-cover"
                  emojiClassName="text-lg"
                />
              </div>
              <span>{game.title}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {game.category}
              </span>
            </h1>
          </div>
        </div>

        {/* Player Controls Bar */}
        <div className="flex items-center gap-2">
          {/* Favorite */}
          <button
            id="player-fav-button"
            onClick={() => onToggleFavorite(game.id)}
            title={isFavorite ? 'Favorited' : 'Add to Favorites'}
            className={`p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              isFavorite
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-amber-400 hover:bg-white/10'
            }`}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>

          {/* Reload Game */}
          <button
            id="player-reload-button"
            onClick={handleReload}
            title="Reload Game Frame"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Theater Mode */}
          <button
            id="player-theater-button"
            onClick={() => setIsTheaterMode(prev => !prev)}
            title={isTheaterMode ? 'Exit Theater Mode' : 'Theater / Cinema Mode'}
            className={`p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              isTheaterMode
                ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Tv className="w-4 h-4" />
          </button>

          {/* Open in New Window */}
          <button
            id="player-popout-button"
            onClick={openInCloakedTab}
            title="Open in Stealth Cloaked Window (About:Blank)"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Popout</span>
          </button>

          {/* Fullscreen Button */}
          <button
            id="player-fullscreen-button"
            onClick={toggleFullscreen}
            title="Fullscreen Mode"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/30 cursor-pointer active:scale-95"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit Full' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* Main Iframe Canvas Container */}
      <div
        ref={containerRef}
        className={`w-full mx-auto transition-all duration-300 ${
          isTheaterMode ? 'max-w-full' : 'max-w-5xl'
        }`}
      >
        <div
          className={`relative w-full rounded-2xl overflow-hidden bg-[#0F1115] border-2 border-white/10 shadow-2xl shadow-indigo-950/20 ${
            isFullscreen ? 'h-screen rounded-none border-none' : 'min-h-[480px] h-[68vh] max-h-[750px]'
          }`}
        >
          <iframe
            key={iframeKey}
            ref={iframeRef}
            id="game-iframe-container"
            title={game.title}
            src={game.iframeType === 'url' ? game.iframeSource : undefined}
            srcDoc={game.iframeType === 'srcdoc' ? game.iframeSource : undefined}
            className="w-full h-full border-0 block"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock"
            allow="fullscreen; gamepad; autoplay; clipboard-write; accelerometer; gyroscope"
          />
        </div>
      </div>

      {/* Game Details & Controls Cheatsheet Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Game Description & User Rating */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#161920] border border-white/10 rounded-2xl p-6 space-y-4 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-white">About {game.title}</h2>
              {/* Rating Widget */}
              <div className="flex items-center gap-1.5 bg-[#0F1115] px-3 py-1.5 rounded-xl border border-white/10 text-xs">
                <span className="text-gray-400 font-medium mr-1">Rate:</span>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => onRateGame(game.id, star)}
                    className="p-0.5 hover:scale-125 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        (userRating || 0) >= star || game.rating >= star
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="font-bold text-amber-400 ml-1.5">{game.rating.toFixed(1)}</span>
              </div>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed">{game.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/5">
              <Tag className="w-3.5 h-3.5 text-gray-500" />
              {game.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 text-gray-300 border border-white/5"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Controls Cheatsheet */}
        <div className="space-y-4">
          <div className="bg-[#161920] border border-white/10 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4 text-indigo-400">
              <Keyboard className="w-5 h-5" />
              <h3 className="font-bold text-white text-sm">How to Play & Controls</h3>
            </div>

            <div className="space-y-2.5">
              {game.controls.map((control, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 bg-[#0F1115] p-2.5 rounded-xl border border-white/5 text-xs text-gray-300"
                >
                  <span className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="leading-snug pt-0.5">{control}</span>
                </div>
              ))}
            </div>

            <button
              onClick={copyGameShare}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 text-xs font-bold transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-indigo-400" />
                  <span>Share Game Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Recommended More Games */}
      {relatedGames.length > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className="font-bold text-white text-sm">More Like This</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {relatedGames.map(rel => (
              <div
                key={rel.id}
                onClick={() => onSelectGame(rel)}
                className="bg-[#161920] hover:bg-[#1D2129] border border-white/5 hover:border-indigo-500/40 rounded-xl p-2.5 cursor-pointer transition-all flex items-center gap-3 shadow-md group"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-black/40 border border-white/10 flex items-center justify-center">
                  <GameThumbnail
                    thumbnail={rel.thumbnail}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    emojiClassName="text-xl"
                  />
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-bold text-xs text-white group-hover:text-indigo-400 truncate">{rel.title}</h4>
                  <span className="text-[10px] text-gray-400 capitalize">{rel.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
