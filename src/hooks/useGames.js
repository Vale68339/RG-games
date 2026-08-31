import { useState, useEffect, useMemo } from 'react';
import { defaultGamesList } from '../data/defaultGames.js';

const STORAGE_KEY = 'unblocked_games_data_v2';
const FAVORITES_KEY = 'unblocked_games_favs_v2';
const RECENTS_KEY = 'unblocked_games_recents_v2';
const RATINGS_KEY = 'unblocked_games_ratings_v2';

export function useGames() {
  const [games, setGames] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return defaultGamesList;
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentIds, setRecentIds] = useState(() => {
    try {
      const saved = localStorage.getItem(RECENTS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [userRatings, setUserRatings] = useState(() => {
    try {
      const saved = localStorage.getItem(RATINGS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeGameId, setActiveGameId] = useState(null);
  const [sortBy, setSortBy] = useState('popular');

  // Save games whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
    } catch (e) {
      console.error('Failed to save games to localStorage', e);
    }
  }, [games]);

  // Save favorites
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites', e);
    }
  }, [favorites]);

  // Save recents
  useEffect(() => {
    try {
      localStorage.setItem(RECENTS_KEY, JSON.stringify(recentIds));
    } catch (e) {
      console.error('Failed to save recents', e);
    }
  }, [recentIds]);

  // Save user ratings
  useEffect(() => {
    try {
      localStorage.setItem(RATINGS_KEY, JSON.stringify(userRatings));
    } catch (e) {
      console.error('Failed to save ratings', e);
    }
  }, [userRatings]);

  const toggleFavorite = (gameId) => {
    setFavorites(prev =>
      prev.includes(gameId) ? prev.filter(id => id !== gameId) : [...prev, gameId]
    );
  };

  const rateGame = (gameId, rating) => {
    setUserRatings(prev => ({ ...prev, [gameId]: rating }));
    setGames(prev =>
      prev.map(g => {
        if (g.id === gameId) {
          const newRating = Number(((g.rating * 10 + rating) / 11).toFixed(1));
          return { ...g, rating: newRating };
        }
        return g;
      })
    );
  };

  const recordPlay = (gameId) => {
    setRecentIds(prev => [gameId, ...prev.filter(id => id !== gameId)].slice(0, 15));
    setGames(prev =>
      prev.map(g => (g.id === gameId ? { ...g, plays: g.plays + 1 } : g))
    );
  };

  const addGame = (newGame) => {
    const id = 'custom-' + Date.now();
    const game = {
      ...newGame,
      id,
      plays: 1,
      rating: 5.0,
      isCustom: true,
      releaseDate: new Date().toISOString().split('T')[0]
    };
    setGames(prev => [game, ...prev]);
    return game;
  };

  const updateGame = (updated) => {
    setGames(prev => prev.map(g => (g.id === updated.id ? updated : g)));
  };

  const deleteGame = (gameId) => {
    setGames(prev => prev.filter(g => g.id !== gameId));
    if (activeGameId === gameId) {
      setActiveGameId(null);
    }
  };

  const importGamesJson = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) {
        return { success: false, message: 'JSON root must be an array of game objects.' };
      }
      if (parsed.length === 0) {
        return { success: false, message: 'The JSON array is empty.' };
      }
      // Basic validation
      const validGames = parsed.map((item, idx) => ({
        id: item.id || `game-${Date.now()}-${idx}`,
        title: item.title || 'Untitled Game',
        category: item.category || 'arcade',
        description: item.description || '',
        thumbnail: item.thumbnail || '🎮',
        thumbnailBg: item.thumbnailBg || 'bg-slate-800 text-slate-200 border-slate-700',
        iframeType: item.iframeType === 'url' ? 'url' : 'srcdoc',
        iframeSource: item.iframeSource || '',
        author: item.author || 'Custom',
        controls: Array.isArray(item.controls) ? item.controls : ['Click / Arrow keys to play'],
        aspectRatio: item.aspectRatio || '4:3',
        rating: typeof item.rating === 'number' ? item.rating : 4.8,
        plays: typeof item.plays === 'number' ? item.plays : 100,
        featured: Boolean(item.featured),
        tags: Array.isArray(item.tags) ? item.tags : ['Unblocked', 'Web'],
        isCustom: true
      }));

      setGames(validGames);
      return { success: true, message: `Successfully imported ${validGames.length} games!`, count: validGames.length };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Invalid JSON format';
      return { success: false, message: `Error parsing JSON: ${errorMsg}` };
    }
  };

  const exportGamesJson = () => {
    return JSON.stringify(games, null, 2);
  };

  const resetToDefaults = () => {
    setGames(defaultGamesList);
    localStorage.removeItem(STORAGE_KEY);
  };

  const activeGame = useMemo(() => {
    return games.find(g => g.id === activeGameId) || null;
  }, [games, activeGameId]);

  // Helper to check if game is featured
  const isGameFeatured = (game) => {
    return (
      game.featured === true ||
      (Array.isArray(game.tags) && game.tags.some(t => t.toLowerCase() === 'featured')) ||
      ['snake-retro', 'game-2048', 'flappy-pixel', 'space-invaders', 'block-master-tetris', 'cyber-drift-2d', 'asteroids-1979', 'dino-runner'].includes(game.id)
    );
  };

  // Filtered & Sorted list
  const filteredGames = useMemo(() => {
    return games
      .filter(game => {
        // Category filter
        if (selectedCategory === 'favorites') {
          if (!favorites.includes(game.id)) return false;
        } else if (selectedCategory === 'featured') {
          if (!isGameFeatured(game)) return false;
        } else if (selectedCategory !== 'all') {
          if (game.category !== selectedCategory) return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = game.title.toLowerCase().includes(q);
          const matchDesc = game.description.toLowerCase().includes(q);
          const matchTags = game.tags.some(t => t.toLowerCase().includes(q));
          const matchCat = game.category.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchTags && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.plays - a.plays;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return (b.id > a.id ? 1 : -1);
      });
  }, [games, selectedCategory, favorites, searchQuery, sortBy]);

  const recentGames = useMemo(() => {
    return recentIds
      .map(id => games.find(g => g.id === id))
      .filter(Boolean);
  }, [games, recentIds]);

  const categoriesWithCounts = useMemo(() => {
    const counts = {
      all: games.length,
      featured: games.filter(g => isGameFeatured(g)).length,
      favorites: favorites.filter(id => games.some(g => g.id === id)).length,
      arcade: 0,
      action: 0,
      puzzle: 0,
      retro: 0,
      sports: 0,
      casual: 0
    };
    games.forEach(g => {
      if (counts[g.category] !== undefined) {
        counts[g.category]++;
      }
    });
    return counts;
  }, [games, favorites]);

  return {
    games,
    filteredGames,
    recentGames,
    activeGame,
    activeGameId,
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
    updateGame,
    deleteGame,
    importGamesJson,
    exportGamesJson,
    resetToDefaults,
    categoriesWithCounts
  };
}
