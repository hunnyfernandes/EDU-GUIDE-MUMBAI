import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuthStore } from '../context/store';
import { useFilterStore } from '../context/store';
import toast from 'react-hot-toast';
import {
  ClockIcon,
  TrashIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

const SearchHistory = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { setFilter } = useFilterStore();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'searches', 'views'

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchCombinedHistory();
    }
  }, [isOpen, isAuthenticated]);

  const fetchCombinedHistory = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getCombinedHistory(50);
      setHistory(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch history:', error);
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClick = (query) => {
    setFilter('search', query);
    navigate('/colleges');
    onClose();
  };

  const handleViewClick = (collegeId) => {
    navigate(`/colleges/${collegeId}`);
    onClose();
  };

  const handleClearAllHistory = async () => {
    if (window.confirm('Are you sure you want to clear all your history?')) {
      try {
        await Promise.all([
          userAPI.clearSearchHistory(),
          userAPI.clearViewHistory()
        ]);
        setHistory([]);
        toast.success('All history cleared');
      } catch (error) {
        toast.error('Failed to clear history');
      }
    }
  };

  const filteredHistory = history.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'searches') return item.type === 'search';
    if (activeTab === 'views') return item.type === 'view';
    return true;
  });

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-primary-500" />
            <h2 className="text-lg font-semibold dark:text-white">History</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg"
          >
            <XMarkIcon className="w-5 h-5 dark:text-neutral-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-700">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'text-primary-500 border-b-2 border-primary-500'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('searches')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'searches'
                ? 'text-primary-500 border-b-2 border-primary-500'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            Searches
          </button>
          <button
            onClick={() => setActiveTab('views')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'views'
                ? 'text-primary-500 border-b-2 border-primary-500'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            Views
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">Loading...</p>
            </div>
          ) : filteredHistory.length > 0 ? (
            <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {filteredHistory.map((item) => (
                <button
                  key={`${item.type}-${item.id}`}
                  onClick={() => {
                    if (item.type === 'search') {
                      handleSearchClick(item.title);
                    } else {
                      handleViewClick(item.college_id);
                    }
                  }}
                  className="w-full text-left p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {item.type === 'search' ? (
                        <MagnifyingGlassIcon className="w-5 h-5 text-primary-500" />
                      ) : (
                        <EyeIcon className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-neutral-900 dark:text-white truncate">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {item.type === 'search' && item.results_count !== null && (
                          <span className="text-sm text-neutral-500 dark:text-neutral-400">
                            {item.results_count} results
                          </span>
                        )}
                        {item.type === 'view' && (
                          <span className="text-sm text-blue-500 dark:text-blue-400">
                            College View
                          </span>
                        )}
                        <span className="text-sm text-neutral-400 dark:text-neutral-500">
                          • {formatDate(item.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <ClockIcon className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-2" />
              <p className="text-neutral-500 dark:text-neutral-400">
                No {activeTab === 'all' ? 'history' : activeTab} yet
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="border-t border-neutral-200 dark:border-neutral-700 p-4">
            <button
              onClick={handleClearAllHistory}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
              Clear All History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchHistory;
