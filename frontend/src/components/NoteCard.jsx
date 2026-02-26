export default function NoteCard({ note, onDelete }) {
  return (
    <article data-testid="note-card">
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <button
        onClick={() => onDelete(note.id)}
        aria-label={`Delete ${note.title}`}
      >
        Delete
      </button>
    </article>
  );
}
