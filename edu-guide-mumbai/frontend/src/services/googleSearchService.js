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
    
    // Detect if on mobile device
    const isMobile = /iPhone|iPad|iPod|Android|Windows Phone|Opera Mini/i.test(navigator.userAgent);
    
    let newTab;
    
    if (isMobile) {
      // On mobile, use target="_blank" behavior by creating a link and clicking it
      const link = document.createElement('a');
      link.href = googleUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      newTab = true;
    } else {
      // On desktop, use window.open
      newTab = window.open(googleUrl, '_blank');
      
      if (newTab === null) {
        console.warn('Google search tab may have been blocked by pop-up blocker');
        // Fallback: create a link and click it
        const link = document.createElement('a');
        link.href = googleUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.click();
        return true;
      }
      
      if (newTab && newTab.opener) {
        newTab.opener = null;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error opening Google search:', error);
    // Fallback: create a link and click it
    try {
      const link = document.createElement('a');
      link.href = generateGoogleSearchUrl(searchQuery, filters);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
      return true;
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      return false;
    }
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
