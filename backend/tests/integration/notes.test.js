/**
 * INTEGRATION TESTS
 *
 * Integration tests verify that multiple layers work correctly together:
 * the HTTP layer (Express routes), the business logic, and the database.
 *
 * Tools: Vitest + Supertest
 *   - Supertest fires real HTTP requests against the Express app in-process
 *   - Vitest sets NODE_ENV=test automatically, so database.js uses SQLite
 *     in-memory — no MySQL server required
 */
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import sequelize from '../../src/database.js';
import Note from '../../src/models/Note.js';

beforeAll(async () => {
  // Create tables in the in-memory SQLite database
  await sequelize.sync({ force: true });
});

afterEach(async () => {
  // Wipe all rows between tests so each test gets a clean slate
  await Note.destroy({ truncate: true });
});

afterAll(async () => {
  await sequelize.close();
});

// ---------------------------------------------------------------------------

describe('GET /notes', () => {
  it('returns 200 and an empty array when no notes exist', async () => {
    const res = await request(app).get('/notes');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns all notes with formatted fields', async () => {
    await Note.create({ title: '  Padded  ', content: 'Body' });
    const res = await request(app).get('/notes');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe('Padded');   // formatNote trimmed it
    expect(res.body[0]).not.toHaveProperty('updatedAt');
  });
});

// ---------------------------------------------------------------------------

describe('POST /notes', () => {
  it('creates a note and returns 201 with the new resource', async () => {
    const res = await request(app)
      .post('/notes')
      .send({ title: 'New Note', content: 'Some content' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('New Note');
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('createdAt');
  });

  it('returns 400 when title is missing', async () => {
    const res = await request(app)
      .post('/notes')
      .send({ content: 'No title here' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Title and content are required');
  });

  it('returns 400 when content is missing', async () => {
    const res = await request(app)
      .post('/notes')
      .send({ title: 'No content here' });
    expect(res.status).toBe(400);
  });

  it('actually persists the note to the database', async () => {
    await request(app).post('/notes').send({ title: 'Persisted', content: 'Yes' });
    const count = await Note.count();
    expect(count).toBe(1);
  });
});

// ---------------------------------------------------------------------------

describe('DELETE /notes/:id', () => {
  it('deletes a note and returns 204 No Content', async () => {
    const note = await Note.create({ title: 'To Delete', content: 'Bye' });
    const res = await request(app).delete(`/notes/${note.id}`);
    expect(res.status).toBe(204);
    expect(await Note.findByPk(note.id)).toBeNull();
  });

  it('returns 404 for a note that does not exist', async () => {
    const res = await request(app).delete('/notes/9999');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Note not found');
  });
});
