import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useFilterStore } from '../context/store';
import { useAuthStore } from '../context/store';
import { SparklesIcon } from '@heroicons/react/24/outline';

const PopularSearches = ({ limit = 5 }) => {
  const navigate = useNavigate();
  const { setFilter } = useFilterStore();
  const { isAuthenticated } = useAuthStore();
  const [popularSearches, setPopularSearches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPopularSearches = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userAPI.getPopularSearches(limit);
      setPopularSearches(response.data);
    } catch (error) {
      console.error('Failed to fetch popular searches:', error);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchPopularSearches();
  }, [fetchPopularSearches]);

  const handleSearchClick = (query) => {
    // Non-blocking search history logging
    if (isAuthenticated) {
      userAPI.logSearch({
        search_query: query,
        filters_applied: {},
        results_count: 0,
      }).catch(err => {
        console.warn("Failed to log search:", err.message);
      });
    }
    setFilter('search', query);
    navigate('/colleges');
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (popularSearches.length === 0) {
    return (
      <div className="p-6 text-center text-neutral-500 dark:text-neutral-400">
        No popular searches yet
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <SparklesIcon className="w-5 h-5 text-primary-500" />
        <h3 className="text-lg font-semibold dark:text-white">Popular Searches</h3>
      </div>
      <div className="space-y-2">
        {popularSearches.map((search, index) => (
          <button
            key={index}
            onClick={() => handleSearchClick(search.search_query)}
            className="w-full text-left p-3 bg-neutral-50 dark:bg-neutral-700/50 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {search.search_query}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {search.search_count} searches
                </p>
              </div>
              <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                {parseFloat(search.avg_results || 0).toFixed(0)} avg results
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularSearches;
