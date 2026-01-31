/**
 * Utility Functions Tests
 * 
 * Example unit tests for utility functions
 */

import {
  formatCurrency,
  truncate,
  capitalize,
  isEmpty,
  generateId,
} from '../index';

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('formats Turkish currency correctly', () => {
      const result = formatCurrency(1234.56, 'TRY', 'tr-TR');
      expect(result).toContain('1');
      expect(result).toContain('234');
    });

    it('formats US currency correctly', () => {
      const result = formatCurrency(1234.56, 'USD', 'en-US');
      expect(result).toContain('$');
      expect(result).toContain('1,234');
    });
  });

  describe('truncate', () => {
    it('does not truncate short text', () => {
      const text = 'Short text';
      const result = truncate(text, 100);
      expect(result).toBe('Short text');
    });

    it('truncates long text and adds ellipsis', () => {
      const text = 'This is a very long text that needs to be truncated';
      const result = truncate(text, 20);
      expect(result).toBe('This is a very long ...');
      expect(result.length).toBe(23); // 20 + '...'
    });

    it('uses default length of 100', () => {
      const text = 'a'.repeat(150);
      const result = truncate(text);
      expect(result.length).toBe(103); // 100 + '...'
    });
  });

  describe('capitalize', () => {
    it('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('handles already capitalized text', () => {
      expect(capitalize('Hello')).toBe('Hello');
    });

    it('handles empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('only capitalizes first letter', () => {
      expect(capitalize('hello world')).toBe('Hello world');
    });
  });

  describe('isEmpty', () => {
    it('returns true for null', () => {
      expect(isEmpty(null)).toBe(true);
    });

    it('returns true for undefined', () => {
      expect(isEmpty(undefined)).toBe(true);
    });

    it('returns true for empty string', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
    });

    it('returns true for empty array', () => {
      expect(isEmpty([])).toBe(true);
    });

    it('returns true for empty object', () => {
      expect(isEmpty({})).toBe(true);
    });

    it('returns false for non-empty string', () => {
      expect(isEmpty('hello')).toBe(false);
    });

    it('returns false for non-empty array', () => {
      expect(isEmpty([1, 2, 3])).toBe(false);
    });

    it('returns false for non-empty object', () => {
      expect(isEmpty({ key: 'value' })).toBe(false);
    });
  });

  describe('generateId', () => {
    it('generates a string', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
    });

    it('generates unique ids', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('generates ids of reasonable length', () => {
      const id = generateId();
      expect(id.length).toBeGreaterThan(0);
      expect(id.length).toBeLessThan(20);
    });
  });
});
