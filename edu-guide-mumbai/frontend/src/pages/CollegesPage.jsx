import React, { useState, useEffect, useCallback } from "react";
import { collegeAPI, userAPI } from "../services/api";
import CollegeCard from "../components/CollegeCard";
import PopularSearches from "../components/PopularSearches";
import { useFilterStore } from "../context/store";
import { useAuthStore } from "../context/store";
import toast from "react-hot-toast";
// import { COLLEGE_HERO_IMAGE } from "../assets/images"; // Removed unused import to fix lint warning
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { getTypeIcon } from "../utils/collegeTypeColors";

const CollegesPage = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [streams, setStreams] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const { filters, setFilter, resetFilters } = useFilterStore();
  const { isAuthenticated } = useAuthStore();

  const fetchStreams = async () => {
    try {
      const response = await collegeAPI.getStreams();
      setStreams(response.data.data);
    } catch (error) {
      console.error("Failed to load streams");
    }
  };

  const fetchSearchSuggestions = async (query) => {
    setLoadingSuggestions(true);
    try {
      const response = await collegeAPI.autocomplete(query);
      setSearchSuggestions(response.data.data || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Failed to fetch suggestions");
      setSearchSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const fetchColleges = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await collegeAPI.getColleges({ ...filters, page });
      setColleges(response.data.data);
      setPagination(response.data.pagination);

      // Log search history only on first page
      if (filters.search && isAuthenticated && page === 1) {
        // Non-blocking search logging - don't let errors affect college loading
        userAPI.logSearch({
          search_query: filters.search,
          filters_applied: {
            stream: filters.stream,
            college_type: filters.college_type,
            min_rating: filters.min_rating,
            state: filters.state,
          },
          results_count: response.data.pagination?.total_items || 0,
        }).catch(err => {
          // Silently fail - this shouldn't interrupt user experience
          console.warn("Failed to log search:", err.message);
        });
      }
    } catch (error) {
      console.error("Error loading colleges:", error);
      toast.error("Failed to load colleges");
    } finally {
      setLoading(false);
    }
  }, [filters, isAuthenticated]);

  useEffect(() => {
    fetchStreams();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.length >= 2) {
        fetchSearchSuggestions(searchInput);
      } else {
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setFilter("search", searchInput.trim());
      setShowSuggestions(false);

      // Non-blocking search history logging
      if (isAuthenticated) {
        userAPI.logSearch({
          search_query: searchInput.trim(),
          filters_applied: {
            stream: filters.stream,
            college_type: filters.college_type,
            min_rating: filters.min_rating,
            state: filters.state,
          },
          results_count: 0,
        }).catch(err => {
          console.warn("Failed to log search:", err.message);
        });
      }
    }
  };

  const handleSuggestionClick = (collegeName) => {
    setSearchInput(collegeName);
    setFilter("search", collegeName);
    setShowSuggestions(false);

    // Non-blocking search history logging
    if (isAuthenticated) {
      userAPI.logSearch({
        search_query: collegeName,
        filters_applied: {
          stream: filters.stream,
          college_type: filters.college_type,
          min_rating: filters.min_rating,
          state: filters.state,
        },
        results_count: 0,
      }).catch(err => {
        console.warn("Failed to log search:", err.message);
      });
    }
  };

  const handlePageChange = (newPage) => {
    fetchColleges(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const collegeTypes = ["Government", "Private", "Aided", "Autonomous"];
  // Mock states for directory - in a real app this would come from API
  const states = ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat", "Rajasthan"];

  const sortOptions = [
    { value: "college_name", label: "Name" },
    { value: "average_rating", label: "Rating" },
    { value: "established_year", label: "Established Year" },
    { value: "total_reviews", label: "Reviews" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 overflow-x-hidden animate-fade-in">
      {/* Hero Section */}
      <div
        className="relative h-64 md:h-80 bg-neutral-900 flex items-center justify-center mb-8"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&h=600&fit=crop&q=80)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            India's College Directory
          </h1>
          <p className="text-lg text-neutral-200 max-w-2xl mx-auto drop-shadow-md">
            Find the best colleges across states, filter by stream, and compare your options.
          </p>
        </div>
      </div>

      <div className="container-main py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            {filters.state ? `Colleges in ${filters.state}` : 'All Colleges'}
          </h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center gap-2 md:hidden"
          >
            <FunnelIcon className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search colleges by name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => searchInput.length >= 2 && setShowSuggestions(true)}
              className="w-full pl-12 pr-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-800 dark:text-neutral-200"
            />
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary px-6"
            >
              Search
            </button>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg z-50">
                {loadingSuggestions ? (
                  <div className="p-4 text-center text-neutral-500 dark:text-neutral-400">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
                    <p className="text-sm mt-2">Searching...</p>
                  </div>
                ) : searchSuggestions.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto">
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion.college_name)}
                        className="w-full text-left px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 border-b border-neutral-100 dark:border-neutral-700 last:border-b-0 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">{suggestion.college_name}</p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">{suggestion.city}</p>
                          </div>
                          {suggestion.average_rating && (
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                                {parseFloat(suggestion.average_rating).toFixed(1)}
                              </span>
                              <span className="text-xs text-neutral-400">⭐</span>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : searchInput.length >= 2 ? (
                  <div className="p-4 text-center text-neutral-500 dark:text-neutral-400">
                    <p className="text-sm">No colleges found matching "{searchInput}"</p>
                  </div>
                ) : (
                  <div className="p-4 text-center text-neutral-500 dark:text-neutral-400">
                    <p className="text-sm">Type at least 2 characters to search</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </form>

        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <aside
            className={`${showFilters ? "block" : "hidden"
              } md:block w-full md:w-64 flex-shrink-0`}
          >
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 sticky top-24 border border-neutral-200 dark:border-neutral-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-h3 dark:text-white">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="md:hidden p-1"
                >
                  <XMarkIcon className="w-5 h-5 dark:text-neutral-400" />
                </button>
              </div>

              {/* State Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 dark:text-neutral-300">State</label>
                <select
                  value={filters.state}
                  onChange={(e) => setFilter("state", e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-neutral-200"
                >
                  <option value="">All States</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stream Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 dark:text-neutral-300">Stream</label>
                <select
                  value={filters.stream}
                  onChange={(e) => setFilter("stream", e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-neutral-200"
                >
                  <option value="">All Streams</option>
                  {streams.map((stream) => (
                    <option key={stream.stream_id} value={stream.stream_name}>
                      {stream.stream_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* College Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 dark:text-neutral-300">
                  College Type
                </label>
                <select
                  value={filters.college_type}
                  onChange={(e) => setFilter("college_type", e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-neutral-200"
                >
                  <option value="">All Types</option>
                  {collegeTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 dark:text-neutral-300">
                  Minimum Rating: {filters.min_rating || "0"}
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={filters.min_rating || 0}
                  onChange={(e) => setFilter("min_rating", e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Reset Filters */}
              <button
                onClick={() => {
                  resetFilters();
                  setSearchInput("");
                }}
                className="w-full btn-secondary"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Options */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-neutral-400 dark:text-neutral-500">
                {colleges.length} colleges shown
              </p>
              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold dark:text-neutral-300">Sort by:</label>
                <select
                  value={filters.sort_by}
                  onChange={(e) => setFilter("sort_by", e.target.value)}
                  className="px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-800 dark:text-neutral-200"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() =>
                    setFilter("order", filters.order === "ASC" ? "DESC" : "ASC")
                  }
                  className="px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 dark:text-neutral-200"
                >
                  {filters.order === "ASC" ? "↑" : "↓"}
                </button>
              </div>
            </div>

            {/* Active Search Info */}
            {filters.search && (
              <div className="mb-6 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    Searching for: <span className="font-semibold text-primary-700 dark:text-primary-300">"{filters.search}"</span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchInput("");
                    setFilter("search", "");
                  }}
                  className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                >
                  Clear search
                </button>
              </div>
            )}

            {/* Available Streams Section */}
            {streams.length > 0 && (
              <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">📚 Available Programs & Streams</h3>
                <div className="flex flex-wrap gap-3">
                  {streams.map((stream) => (
                    <button
                      key={stream.stream_id}
                      onClick={() => setFilter("stream", stream.stream_name)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filters.stream === stream.stream_name
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white dark:bg-neutral-800 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-neutral-700'
                        }`}
                    >
                      {stream.stream_name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colleges Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                <p className="mt-4 text-neutral-400">Loading colleges...</p>
              </div>
            ) : colleges.length === 0 ? (
              <div>
                <div className="text-center py-12">
                  <p className="text-neutral-400 text-lg">No colleges found</p>
                  <button
                    onClick={() => {
                      resetFilters();
                      setSearchInput("");
                    }}
                    className="mt-4 btn-primary"
                  >
                    Clear Filters
                  </button>
                </div>
                {/* Show popular searches when no results */}
                <div className="mt-8 bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700">
                  <PopularSearches limit={5} />
                </div>
              </div>
            ) : (
              <>
                {/* Mumbai Colleges Section - Horizontal Scroll */}
                {colleges.some(c => c.city === 'Mumbai' && c.state === 'Maharashtra') && (
                  <div className="mb-10 animate-fade-in-up">
                    <div
                      className="mb-4 pb-4 rounded-xl overflow-hidden relative shadow-lg group"
                      style={{
                        backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 100%), url(https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=1200&h=400&fit=crop&q=80)`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center 30%',
                        minHeight: '140px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <div className="pl-8 relative z-10 w-full">
                        <div className="text-left border-l-4 border-amber-500 pl-4">
                          <h2 className="text-3xl font-bold text-white mb-1">
                            Top Colleges in Mumbai
                          </h2>
                          <p className="text-gray-200 font-medium text-sm tracking-wide uppercase">
                            Excellence in the Financial Capital
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Grid Container - arranging below when exceeding */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
                      {colleges
                        .filter(c => c.city === 'Mumbai' && c.state === 'Maharashtra')
                        .map((college) => (
                          <CollegeCard key={college.college_id} college={college} />
                        ))}
                    </div>
                  </div>
                )}

                {/* Other Colleges - Categorized Grids */}
                {collegeTypes.map((type) => {
                  // Filter for non-Mumbai colleges of this type
                  const typeColleges = colleges.filter(c =>
                    c.college_type === type &&
                    !(c.city === 'Mumbai' && c.state === 'Maharashtra')
                  );

                  if (typeColleges.length === 0) return null;

                  const typeIcon = getTypeIcon(type);

                  // Different background images for each type
                  const typeBackgrounds = {
                    'Government': 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1000&h=300&fit=crop&q=85',
                    'Private': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1000&h=300&fit=crop&q=85',
                    'Aided': 'https://images.unsplash.com/photo-1516321318423-f06f70674ce0?w=1000&h=300&fit=crop&q=85',
                    'Autonomous': 'https://images.unsplash.com/photo-1571260899db-ab967c9e1c13?w=1000&h=300&fit=crop&q=85'
                  };

                  return (
                    <div key={type} className="mb-12">
                      {/* Type Section Header with Background Image */}
                      <div
                        className="mb-6 pb-6 rounded-lg overflow-hidden relative"
                        style={{
                          backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.5) 100%), url(${typeBackgrounds[type]})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          minHeight: '180px',
                          display: 'flex',
                          alignItems: 'flex-end'
                        }}
                      >
                        <div className="pl-6 pb-4 relative z-10 w-full">
                          <div className="flex items-center gap-3">
                            <span className="text-5xl drop-shadow-lg">{typeIcon}</span>
                            <div className="text-left">
                              <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                                {type} Colleges (Rest of India)
                              </h2>
                              <p className="text-white/90 drop-shadow-md font-medium">
                                {typeColleges.length} college{typeColleges.length !== 1 ? 's' : ''} available
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Colleges Grid (Standard Layout for Non-Mumbai) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                        {typeColleges.map((college) => (
                          <CollegeCard key={college.college_id} college={college} />
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Pagination */}
                {pagination.total_pages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                      onClick={() =>
                        handlePageChange(pagination.current_page - 1)
                      }
                      disabled={pagination.current_page === 1}
                      className="p-2 border border-neutral-300 dark:border-neutral-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                    >
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <span className="text-neutral-700 dark:text-neutral-300">
                      Page {pagination.current_page} of {pagination.total_pages}
                    </span>
                    <button
                      onClick={() =>
                        handlePageChange(pagination.current_page + 1)
                      }
                      disabled={
                        pagination.current_page === pagination.total_pages
                      }
                      className="p-2 border border-neutral-300 dark:border-neutral-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                    >
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default CollegesPage;
