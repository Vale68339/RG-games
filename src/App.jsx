import { useState } from 'react';
import { useGames } from './hooks/useGames';
import { useCloak } from './hooks/useCloak';
import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { GameCard } from './components/GameCard';
import { GamePlayer } from './components/GamePlayer';
import { AddGameModal } from './components/AddGameModal';
import { JsonManagerModal } from './components/JsonManagerModal';
import { TabCloakModal } from './components/TabCloakModal';
import { PanicScreen } from './components/PanicScreen';
import {
  Gamepad2,
  Shield,
  Search,
  Plus,
  Clock
} from 'lucide-react';

export default function App() {
  const {
    games,
    filteredGames,
    recentGames,
    activeGame,
    setActiveGameId,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    favorites,
    toggleFavorite,
    userRatings,
    rateGame,
    recordPlay,
    addGame,
    importGamesJson,
    exportGamesJson,
    resetToDefaults,
    categoriesWithCounts
  } = useGames();

  const {
    currentPresetId,
    setCloak,
    presets,
    isPanicActive,
    setIsPanicActive,
    triggerPanic,
    panicKey,
    updatePanicKey
  } = useCloak();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isCloakModalOpen, setIsCloakModalOpen] = useState(false);

  // If panic mode is active, render stealth disguise screen immediately
  if (isPanicActive) {
    return <PanicScreen onExitPanic={() => setIsPanicActive(false)} panicKey={panicKey} />;
  }

  const handleSelectGame = (game) => {
    recordPlay(game.id);
    setActiveGameId(game.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCatalog = () => {
    setActiveGameId(null);
  };

  return (
    <div className="min-h-screen bg-[#0F1115] text-white flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Global Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenCloakModal={() => setIsCloakModalOpen(true)}
        onTriggerPanic={triggerPanic}
        panicKey={panicKey}
        totalGamesCount={games.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {activeGame ? (
          /* Active Game Player View */
          <GamePlayer
            game={activeGame}
            onBack={handleBackToCatalog}
            isFavorite={favorites.includes(activeGame.id)}
            onToggleFavorite={toggleFavorite}
            userRating={userRatings[activeGame.id]}
            onRateGame={rateGame}
            onSelectGame={handleSelectGame}
            allGames={games}
          />
        ) : (
          /* Catalog View */
          <div className="space-y-6">
            {/* Recently Played Bar */}
            {!searchQuery && recentGames.length > 0 && selectedCategory === 'all' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    Recently Played
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  {recentGames.slice(0, 6).map(g => (
                    <div
                      key={g.id}
                      onClick={() => handleSelectGame(g)}
                      className="group bg-[#161920] hover:bg-[#1D2129] border border-white/5 hover:border-indigo-500/40 rounded-2xl p-3 cursor-pointer transition-all flex items-center gap-3 shadow-md"
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform">{g.thumbnail}</span>
                      <div className="overflow-hidden">
                        <h3 className="font-bold text-xs text-white group-hover:text-indigo-400 truncate">
                          {g.title}
                        </h3>
                        <span className="text-[10px] text-gray-400 capitalize">{g.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Category & Sorting Controls */}
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              categoriesWithCounts={categoriesWithCounts}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            {/* Games Grid */}
            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredGames.map(game => (
                  <GameCard
                    key={game.id}
                    game={game}
                    isFavorite={favorites.includes(game.id)}
                    onToggleFavorite={toggleFavorite}
                    onSelectGame={handleSelectGame}
                  />
                ))}
              </div>
            ) : (
              /* Empty Search / Filter State */
              <div className="text-center py-16 px-4 bg-[#161920] border border-white/10 rounded-2xl space-y-4 shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-gray-400 flex items-center justify-center mx-auto">
                  <Search className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">No games found</h3>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    {searchQuery
                      ? `No games matching "${searchQuery}". Try a different keyword or add your own custom game.`
                      : 'No games in this category yet.'}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-bold transition-all cursor-pointer"
                    >
                      Clear Search
                    </button>
                  )}
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Add Custom Game</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 bg-[#0F1115] mt-12 py-8 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-white">RG GAMES</span>
            <span className="text-gray-600">•</span>
            <span>Iframe JSON Architecture</span>
          </div>

          <div className="flex items-center gap-4 text-gray-400">
            <button
              onClick={() => setIsCloakModalOpen(true)}
              className="hover:text-indigo-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tab Cloak</span>
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="hover:text-indigo-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span>Add Game</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={addGame}
      />

      <JsonManagerModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        games={games}
        onImportJson={importGamesJson}
        onExportJson={exportGamesJson}
        onResetDefaults={resetToDefaults}
      />

      <TabCloakModal
        isOpen={isCloakModalOpen}
        onClose={() => setIsCloakModalOpen(false)}
        presets={presets}
        currentPresetId={currentPresetId}
        onSelectPreset={setCloak}
        panicKey={panicKey}
        onUpdatePanicKey={updatePanicKey}
      />
    </div>
  );
}
