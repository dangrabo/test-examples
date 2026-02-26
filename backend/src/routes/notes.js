import { Router } from 'express';
import Note from '../models/Note.js';
import { formatNote } from '../utils/formatNote.js';

const router = Router();

router.get('/', async (req, res) => {
  const notes = await Note.findAll({ order: [['createdAt', 'DESC']] });
  res.json(notes.map(formatNote));
});

router.post('/', async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  const note = await Note.create({ title, content });
  res.status(201).json(formatNote(note));
});

router.delete('/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  await note.destroy();
  res.status(204).send();
});

// Test-utility route: wipe all notes so each E2E test starts clean.
// Not exposed in production.
if (process.env.NODE_ENV !== 'production') {
  router.delete('/reset', async (req, res) => {
    await Note.destroy({ truncate: true });
    res.status(204).send();
  });
}

export default router;
