/**
 * Google Search Service
 * Handles integration with Google Search for college-related queries
 */

const GOOGLE_SEARCH_BASE_URL = 'https://www.google.com/search';

/**
 * Generate a Google search URL for colleges
 * @param {string} searchQuery - The search query
 * @param {object} filters - Optional filters (stream, location, etc.)
 * @returns {string} - The Google search URL
 */
export const generateGoogleSearchUrl = (searchQuery, filters = {}) => {
  let googleQuery = searchQuery;

  // Add context-specific keywords for better results
  const keywords = ['college', 'mumbai', 'india'];
  
  // Add stream if available
  if (filters.stream) {
    keywords.unshift(filters.stream);
  }

  // Add location context if not already in query
  if (!searchQuery.toLowerCase().includes('mumbai')) {
    keywords.push('mumbai');
  }

  // Combine search terms
  googleQuery = `${searchQuery} ${keywords.join(' ')}`;

  // Build the search URL with proper encoding
  const params = new URLSearchParams({
    q: googleQuery
  });

  return `${GOOGLE_SEARCH_BASE_URL}?${params.toString()}`;
};

/**
 * Open Google search in a new tab
 * @param {string} searchQuery - The search query
 * @param {object} filters - Optional filters
 */
export const openGoogleSearch = (searchQuery, filters = {}) => {
  if (!searchQuery.trim()) {
    return false;
  }

  try {
    const googleUrl = generateGoogleSearchUrl(searchQuery, filters);
    console.log('Opening Google Search:', googleUrl);
    
    // Use noopener for security and ensure it opens in new tab
    const newTab = window.open(googleUrl, '_blank');
    
    if (newTab === null) {
      console.warn('Google search tab may have been blocked by pop-up blocker');
      return false;
    }
    
    if (newTab.opener) {
      newTab.opener = null;
    }
    
    return true;
  } catch (error) {
    console.error('Error opening Google search:', error);
    return false;
  }
};

/**
 * Get a descriptive message for Google search
 * @returns {string} - Toast message
 */
export const getGoogleSearchMessage = () => {
  return 'Searching Google for more colleges...';
};

const googleSearchService = {
  generateGoogleSearchUrl,
  openGoogleSearch,
  getGoogleSearchMessage,
};

export default googleSearchService;
