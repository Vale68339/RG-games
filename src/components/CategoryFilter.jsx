import {
  Flame,
  Sparkles,
  Star,
  ArrowUpDown
} from 'lucide-react';

const CATEGORY_ITEMS = [
  { id: 'all', label: 'All Games', icon: Flame },
  { id: 'featured', label: 'Featured', icon: Sparkles },
  { id: 'favorites', label: 'Favorites', icon: Star }
];

export function CategoryFilter({
  selectedCategory,
  onSelectCategory,
  categoriesWithCounts,
  sortBy,
  onSortChange
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
        {CATEGORY_ITEMS.map(cat => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          const count = categoriesWithCounts[cat.id] ?? 0;

          return (
            <button
              key={cat.id}
              id={`cat-filter-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/5 hover:border-white/10'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-indigo-400'}`} />
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-indigo-500/20 text-indigo-300'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sort Select */}
      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
        <select
          id="sort-games-select"
          value={sortBy}
          onChange={e => onSortChange(e.target.value)}
          className="bg-[#161920] border border-white/10 text-gray-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          <option value="popular">Most Popular</option>
          <option value="rating">Highest Rated</option>
          <option value="title">Alphabetical (A-Z)</option>
          <option value="newest">Recently Added</option>
        </select>
      </div>
    </div>
  );
}

