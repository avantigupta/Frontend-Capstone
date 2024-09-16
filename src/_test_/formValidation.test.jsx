const { validateForm } = require('../utils/formValidation'); // Adjust the import path as needed

describe('validateForm', () => {
  describe('username validation', () => {
    test('should return error if username is empty', () => {
      const result = validateForm({ username: '' });
      expect(result.username).toBe('Username is required');
    });

    test('should not return error if username is provided', () => {
      const result = validateForm({ username: 'testuser' });
      expect(result.username).toBeUndefined();
    });

    test('should return error if admin email is invalid', () => {
      const result = validateForm({ username: 'invalid@email', role: 'admin' });
      expect(result.username).toBe('Enter a valid email address with .com domain');
    });

    test('should not return error if admin email is valid', () => {
      const result = validateForm({ username: 'valid@email.com', role: 'admin' });
      expect(result.username).toBeUndefined();
    });

    test('should return error if user phone number is not 10 digits', () => {
      const result = validateForm({ username: '12345', role: 'user' });
      expect(result.username).toBe('Phone number must be exactly 10 digits');
    });

    test('should not return error if user phone number is 10 digits', () => {
      const result = validateForm({ username: '1234567890', role: 'user' });
      expect(result.username).toBeUndefined();
    });
  });

  describe('password validation', () => {
    test('should return error if password is empty', () => {
      const result = validateForm({ password: '' });
      expect(result.password).toBe('Password is required');
    });

    test('should not return error if password is provided', () => {
      const result = validateForm({ password: 'password123' });
      expect(result.password).toBeUndefined();
    });
  });

  describe('category name validation', () => {
    test('should return error if category name is empty', () => {
      const result = validateForm({ categoryName: '' });
      expect(result.categoryName).toBe('Category name is required');
    });

    test('should return error if category name contains special characters', () => {
      const result = validateForm({ categoryName: 'Invalid@Category' });
      expect(result.categoryName).toBe('Category name cannot contain special characters');
    });

    test('should not return error if category name is valid', () => {
      const result = validateForm({ categoryName: 'Valid Category 123' });
      expect(result.categoryName).toBeUndefined();
    });
  });

  describe('combined field validation', () => {
    test('should validate multiple fields correctly', () => {
      const result = validateForm({
        username: 'invalid@email',
        password: '',
        role: 'admin',
        categoryName: 'Valid Category'
      });
      expect(result.username).toBe('Enter a valid email address with .com domain');
      expect(result.password).toBe('Password is required');
      expect(result.categoryName).toBeUndefined();
    });

    test('should return no errors for valid inputs', () => {
      const result = validateForm({
        username: 'valid@email.com',
        password: 'password123',
        role: 'admin',
        categoryName: 'Valid Category 123'
      });
      expect(Object.keys(result).length).toBe(0);
    });
  });
});