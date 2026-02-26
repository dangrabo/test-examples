import { useState, useEffect } from 'react';
import NoteCard from './components/NoteCard.jsx';
import { getNotes, createNote, deleteNote } from './api/notesApi.js';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getNotes().then(setNotes);
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setError('Both fields are required');
      return;
    }
    const note = await createNote({ title, content });
    setNotes((prev) => [note, ...prev]);
    setTitle('');
    setContent('');
    setError('');
  };

  const handleDelete = async (id) => {
    await deleteNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <main>
      <h1>Notes</h1>

      <form onSubmit={handleCreate}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Title"
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          aria-label="Content"
        />
        {error && <p role="alert">{error}</p>}
        <button type="submit">Add Note</button>
      </form>

      <section aria-label="notes list">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} onDelete={handleDelete} />
        ))}
      </section>
    </main>
  );
}
