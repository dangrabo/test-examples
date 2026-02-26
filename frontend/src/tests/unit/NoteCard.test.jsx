/**
 * FRONTEND UNIT TESTS
 *
 * Unit tests render a single component in isolation.
 * Props are passed directly — no API calls, no routing, no global state.
 *
 * Tools: Vitest + React Testing Library
 *   - render()    mounts the component into jsdom
 *   - screen      queries the rendered output by role/label/text (like a user would)
 *   - userEvent   simulates realistic user interactions (click, type, etc.)
 *   - vi.fn()     creates a spy to assert a callback was called correctly
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NoteCard from '../../components/NoteCard.jsx';

const sampleNote = { id: 7, title: 'Test Note', content: 'Some content here' };

describe('NoteCard', () => {
  it('renders the note title', () => {
    render(<NoteCard note={sampleNote} onDelete={() => {}} />);
    expect(screen.getByText('Test Note')).toBeInTheDocument();
  });

  it('renders the note content', () => {
    render(<NoteCard note={sampleNote} onDelete={() => {}} />);
    expect(screen.getByText('Some content here')).toBeInTheDocument();
  });

  it('renders a delete button', () => {
    render(<NoteCard note={sampleNote} onDelete={() => {}} />);
    expect(screen.getByRole('button', { name: /delete test note/i })).toBeInTheDocument();
  });

  it('calls onDelete with the correct note id when Delete is clicked', async () => {
    const onDelete = vi.fn();
    render(<NoteCard note={sampleNote} onDelete={onDelete} />);

    await userEvent.click(screen.getByRole('button', { name: /delete test note/i }));

    expect(onDelete).toHaveBeenCalledOnce();
    expect(onDelete).toHaveBeenCalledWith(7);
  });

  it('does not call onDelete when the card itself is clicked', async () => {
    const onDelete = vi.fn();
    render(<NoteCard note={sampleNote} onDelete={onDelete} />);

    await userEvent.click(screen.getByText('Test Note'));

    expect(onDelete).not.toHaveBeenCalled();
  });
});
