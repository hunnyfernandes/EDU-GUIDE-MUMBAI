const {
  validateSortField,
  validateSortOrder,
  validatePagination,
} = require('../../utils/queryValidator');

describe('Query Validator Utilities', () => {
  describe('validateSortField', () => {
    it('should return valid field from whitelist', () => {
      const allowedFields = ['name', 'date', 'rating'];
      expect(validateSortField('name', allowedFields, 'date')).toBe('name');
      expect(validateSortField('rating', allowedFields, 'date')).toBe('rating');
    });

    it('should return default when field not in whitelist', () => {
      const allowedFields = ['name', 'date', 'rating'];
      expect(validateSortField('invalid_field', allowedFields, 'date')).toBe('date');
      expect(validateSortField('DROP TABLE', allowedFields, 'date')).toBe('date');
    });

    it('should handle SQL injection attempts', () => {
      const allowedFields = ['name', 'date'];
      expect(validateSortField("'; DROP TABLE users; --", allowedFields, 'date')).toBe('date');
      expect(validateSortField("name'; DELETE FROM users; --", allowedFields, 'date')).toBe('date');
    });
  });

  describe('validateSortOrder', () => {
    it('should return valid order (ASC)', () => {
      expect(validateSortOrder('ASC', 'DESC')).toBe('ASC');
      expect(validateSortOrder('asc', 'DESC')).toBe('ASC');
    });

    it('should return valid order (DESC)', () => {
      expect(validateSortOrder('DESC', 'ASC')).toBe('DESC');
      expect(validateSortOrder('desc', 'ASC')).toBe('DESC');
    });

    it('should return default for invalid order', () => {
      expect(validateSortOrder('INVALID', 'ASC')).toBe('ASC');
      expect(validateSortOrder('', 'DESC')).toBe('DESC');
    });
  });

  describe('validatePagination', () => {
    it('should return valid pagination values', () => {
      const result = validatePagination(2, 10);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(10);
      expect(result.offset).toBe(10);
    });

    it('should handle string numbers', () => {
      const result = validatePagination('3', '20');
      expect(result.page).toBe(3);
      expect(result.limit).toBe(20);
      expect(result.offset).toBe(40);
    });

    it('should enforce minimum values', () => {
      const result = validatePagination(0, -5);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(1);
      expect(result.offset).toBe(0);
    });

    it('should enforce maximum limit', () => {
      const result = validatePagination(1, 1000);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(100);
      expect(result.offset).toBe(0);
    });

    it('should handle invalid input', () => {
      const result = validatePagination('invalid', 'not-a-number');
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.offset).toBe(0);
    });
  });
});











