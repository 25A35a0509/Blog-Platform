import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';

/**
 * Debounced search input + category dropdown. Calls onChange with
 * { search, category } whenever either value settles.
 */
const SearchFilterBar = ({ search, category, categories, onSearchChange, onCategoryChange }) => {
  const [localSearch, setLocalSearch] = useState(search);

  // Debounce the search input so we don't fire a request on every keystroke.
  useEffect(() => {
    const handle = setTimeout(() => {
      if (localSearch !== search) onSearchChange(localSearch);
    }, 400);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch]);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
        <input
          type="search"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Search posts by title, content, or tag…"
          className="input-field pl-9 pr-9"
          aria-label="Search posts"
        />
        {localSearch && (
          <button
            onClick={() => setLocalSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="input-field sm:w-56"
        aria-label="Filter by category"
      >
        <option value="">All categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchFilterBar;
