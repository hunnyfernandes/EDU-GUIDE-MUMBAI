/**
 * Utility functions for validating and sanitizing query parameters
 * Prevents SQL injection attacks by whitelisting allowed values
 */

/**
 * Validates a sort field against a whitelist of allowed fields
 * @param {string} field - The field to validate
 * @param {string[]} allowedFields - Array of allowed field names
 * @param {string} defaultField - Default field to use if validation fails
 * @returns {string} - Validated field name
 */
const validateSortField = (field, allowedFields, defaultField = null) => {
  if (!field || typeof field !== "string") {
    return defaultField || allowedFields[0];
  }

  // Remove any table prefix (e.g., "r.created_at" -> "created_at")
  const cleanField = field.includes(".") ? field.split(".")[1] : field;

  // Check if field is in whitelist
  if (allowedFields.includes(cleanField)) {
    return cleanField;
  }

  return defaultField || allowedFields[0];
};

/**
 * Validates sort order (ASC or DESC)
 * @param {string} order - The order to validate
 * @param {string} defaultOrder - Default order if validation fails
 * @returns {string} - Validated order ('ASC' or 'DESC')
 */
const validateSortOrder = (order, defaultOrder = "ASC") => {
  if (!order || typeof order !== "string") {
    return defaultOrder;
  }

  const upperOrder = order.toUpperCase();
  return upperOrder === "ASC" || upperOrder === "DESC"
    ? upperOrder
    : defaultOrder;
};

/**
 * Validates pagination parameters
 * @param {string|number} page - Page number
 * @param {string|number} limit - Items per page
 * @param {number} maxLimit - Maximum allowed limit
 * @returns {Object} - Validated page and limit
 */
const validatePagination = (page, limit, maxLimit = 100) => {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(maxLimit, Math.max(1, parseInt(limit) || 10));

  return {
    page: pageNum,
    limit: limitNum,
    offset: (pageNum - 1) * limitNum,
  };
};

module.exports = {
  validateSortField,
  validateSortOrder,
  validatePagination,
};










