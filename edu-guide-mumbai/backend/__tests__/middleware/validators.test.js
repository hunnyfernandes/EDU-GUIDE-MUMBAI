const { body, validationResult } = require('express-validator');
const {
  validateRegister,
  validateLogin,
  validateChangePassword,
} = require('../../middleware/validators');

// Helper to run validators
const runValidators = async (validators, data) => {
  const req = { body: data };
  // Provide a minimal `res` implementation that validation middleware
  // uses in case of validation errors (res.status().json()). Tests previously
  // passed an empty object which caused TypeError during .status.
  const res = { status: () => res, json: () => {} };
  for (const validator of validators) {
    if (typeof validator === 'function') {
      await validator(req, res, () => {});
    }
  }
  return validationResult(req);
};

describe('Validation Middleware', () => {
  describe('validateRegister', () => {
    it('should pass with valid data', async () => {
      const validData = {
        full_name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        phone: '1234567890',
      };
      const errors = await runValidators(validateRegister, validData);
      expect(errors.isEmpty()).toBe(true);
    });

    it('should fail with missing required fields', async () => {
      const invalidData = {
        full_name: 'John Doe',
        // Missing email and password
      };
      const errors = await runValidators(validateRegister, invalidData);
      expect(errors.isEmpty()).toBe(false);
      expect(errors.array().length).toBeGreaterThan(0);
    });

    it('should fail with invalid email', async () => {
      const invalidData = {
        full_name: 'John Doe',
        email: 'invalid-email',
        password: 'Password123',
      };
      const errors = await runValidators(validateRegister, invalidData);
      expect(errors.isEmpty()).toBe(false);
      const emailError = errors.array().find((e) => e.path === 'email');
      expect(emailError).toBeDefined();
    });

    it('should fail with weak password', async () => {
      const invalidData = {
        full_name: 'John Doe',
        email: 'john@example.com',
        password: 'weak', // Too short, no uppercase, no number
      };
      const errors = await runValidators(validateRegister, invalidData);
      expect(errors.isEmpty()).toBe(false);
      const passwordError = errors.array().find((e) => e.path === 'password');
      expect(passwordError).toBeDefined();
    });

    it('should fail with invalid phone number', async () => {
      const invalidData = {
        full_name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        phone: '123', // Invalid phone format
      };
      const errors = await runValidators(validateRegister, invalidData);
      expect(errors.isEmpty()).toBe(false);
      const phoneError = errors.array().find((e) => e.path === 'phone');
      expect(phoneError).toBeDefined();
    });
  });

  describe('validateLogin', () => {
    it('should pass with valid data', async () => {
      const validData = {
        email: 'john@example.com',
        password: 'Password123',
      };
      const errors = await runValidators(validateLogin, validData);
      expect(errors.isEmpty()).toBe(true);
    });

    it('should fail with missing email', async () => {
      const invalidData = {
        password: 'Password123',
      };
      const errors = await runValidators(validateLogin, invalidData);
      expect(errors.isEmpty()).toBe(false);
    });

    it('should fail with missing password', async () => {
      const invalidData = {
        email: 'john@example.com',
      };
      const errors = await runValidators(validateLogin, invalidData);
      expect(errors.isEmpty()).toBe(false);
    });
  });

  describe('validateChangePassword', () => {
    it('should pass with valid data', async () => {
      const validData = {
        currentPassword: 'OldPassword123',
        newPassword: 'NewPassword123',
      };
      const errors = await runValidators(validateChangePassword, validData);
      expect(errors.isEmpty()).toBe(true);
    });

    it('should fail with weak new password', async () => {
      const invalidData = {
        currentPassword: 'OldPassword123',
        newPassword: 'weak', // Too weak
      };
      const errors = await runValidators(validateChangePassword, invalidData);
      expect(errors.isEmpty()).toBe(false);
      const passwordError = errors.array().find((e) => e.path === 'newPassword');
      expect(passwordError).toBeDefined();
    });
  });
});











