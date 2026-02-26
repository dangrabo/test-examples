/**
 * Shapes a raw Sequelize Note instance into the API response format.
 * Trims whitespace and omits internal Sequelize fields like updatedAt.
 */
export function formatNote(note) {
  return {
    id: note.id,
    title: note.title.trim(),
    content: note.content.trim(),
    createdAt: note.createdAt,
  };
}
