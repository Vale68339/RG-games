import { Play, Star, Users } from 'lucide-react';

export function GameCard({
  game,
  isFavorite,
  onToggleFavorite,
  onSelectGame
}) {
  return (
    <div
      id={`game-card-${game.id}`}
      className="group relative bg-[#161920] hover:bg-[#1D2129] border border-white/5 hover:border-indigo-500/50 rounded-2xl p-3.5 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between overflow-hidden"
    >
      {/* Top Banner / Favorite */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/5 text-indigo-300 border border-white/10">
          {game.category}
        </span>
        <button
          id={`favorite-btn-${game.id}`}
          onClick={e => {
            e.stopPropagation();
            onToggleFavorite(game.id);
          }}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
            isFavorite
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
              : 'bg-white/5 border-white/5 text-gray-500 hover:text-amber-400 hover:border-white/10'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400' : ''}`} />
        </button>
      </div>

      {/* Thumbnail Area */}
      <div
        onClick={() => onSelectGame(game)}
        className="relative aspect-video w-full rounded-xl bg-gradient-to-b from-[#1D2129] to-[#0F1115] border border-white/5 group-hover:border-indigo-500/30 flex items-center justify-center cursor-pointer overflow-hidden transition-all group-hover:scale-[1.02]"
      >
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-radial from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Emoji / Icon Display */}
        <div className="text-5xl filter drop-shadow-lg transform transition-transform group-hover:scale-115">
          {game.thumbnail}
        </div>

        {/* Play Overlay */}
        <div className="absolute inset-0 bg-[#0F1115]/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/50 transform scale-75 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>

        {/* Iframe type badge */}
        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-[#0F1115]/90 text-[9px] font-mono font-bold text-gray-400 border border-white/10">
          {game.iframeType === 'url' ? 'WEB EMBED' : 'HTML5 CANVAS'}
        </div>
      </div>

      {/* Game Details */}
      <div className="mt-3">
        <h3
          onClick={() => onSelectGame(game)}
          className="font-bold text-white text-sm tracking-tight hover:text-indigo-400 cursor-pointer transition-colors line-clamp-1"
        >
          {game.title}
        </h3>
        <p className="text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed min-h-[32px]">
          {game.description}
        </p>

        {/* Meta Stats & Play CTA */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5 text-[11px] text-gray-400">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 font-semibold text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{game.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 text-gray-500" />
              <span>{game.plays.toLocaleString()}</span>
            </div>
          </div>

          <button
            id={`play-now-${game.id}`}
            onClick={() => onSelectGame(game)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/20 active:scale-95 cursor-pointer"
          >
            <span>Play</span>
            <Play className="w-2.5 h-2.5 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
}
