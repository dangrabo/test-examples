/**
 * BACKEND UNIT TESTS
 *
 * Unit tests target a single function in complete isolation.
 * No database, no HTTP server — just the function and its logic.
 *
 * Tool: Vitest
 */
import { describe, it, expect } from 'vitest';
import { formatNote } from '../../src/utils/formatNote.js';

describe('formatNote', () => {
  it('trims leading and trailing whitespace from title and content', () => {
    const raw = { id: 1, title: '  Hello  ', content: '  World  ', createdAt: new Date() };
    const result = formatNote(raw);
    expect(result.title).toBe('Hello');
    expect(result.content).toBe('World');
  });

  it('preserves id and createdAt', () => {
    const date = new Date('2024-01-15');
    const raw = { id: 42, title: 'Test', content: 'Body', createdAt: date };
    const result = formatNote(raw);
    expect(result.id).toBe(42);
    expect(result.createdAt).toBe(date);
  });

  it('omits updatedAt and any other Sequelize internal fields', () => {
    const raw = {
      id: 1,
      title: 'T',
      content: 'C',
      createdAt: new Date(),
      updatedAt: new Date(),
      dataValues: {},
    };
    const result = formatNote(raw);
    expect(result).not.toHaveProperty('updatedAt');
    expect(result).not.toHaveProperty('dataValues');
  });

  it('returns an object with exactly the four expected keys', () => {
    const raw = { id: 1, title: 'A', content: 'B', createdAt: new Date() };
    const result = formatNote(raw);
    expect(Object.keys(result)).toEqual(['id', 'title', 'content', 'createdAt']);
  });
});
