/**
 * FRONTEND INTEGRATION TESTS
 *
 * Integration tests render the full App component and verify it works with
 * the API layer. The API module is mocked with vi.mock() so no real HTTP
 * requests go out — but the real App code (state, event handlers, rendering
 * logic) all runs untouched.
 *
 * Tools: Vitest + React Testing Library + vi.mock()
 *   - vi.mock() replaces the entire notesApi module with auto-mocked vi.fn()s
 *   - mockResolvedValue() sets what each mock returns for a given test
 *   - waitFor() waits for async state updates to appear in the DOM
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App.jsx';
import * as notesApi from '../../api/notesApi.js';

// Replace every export of notesApi with a vi.fn() spy
vi.mock('../../api/notesApi.js');

describe('App', () => {
  beforeEach(() => {
    // Default: empty list on load, create returns a new note
    notesApi.getNotes.mockResolvedValue([]);
    notesApi.createNote.mockResolvedValue({ id: 1, title: 'My Note', content: 'Body' });
    notesApi.deleteNote.mockResolvedValue();
  });

  it('renders the page heading', async () => {
    render(<App />);
    // waitFor lets the initial getNotes() useEffect settle before asserting
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Notes' })).toBeInTheDocument();
    });
  });

  it('fetches and displays notes when the page loads', async () => {
    notesApi.getNotes.mockResolvedValue([
      { id: 1, title: 'Loaded Note', content: 'From the API' },
    ]);
    render(<App />);
    // getNotes is async, so we wait for the DOM to update
    await waitFor(() => {
      expect(screen.getByText('Loaded Note')).toBeInTheDocument();
    });
  });

  it('shows a validation error when the form is submitted empty', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /add note/i }));
    expect(screen.getByRole('alert')).toHaveTextContent('Both fields are required');
    expect(notesApi.createNote).not.toHaveBeenCalled();
  });

  it('calls createNote and shows the new note after a successful submit', async () => {
    render(<App />);
    await userEvent.type(screen.getByLabelText('Title'), 'My Note');
    await userEvent.type(screen.getByLabelText('Content'), 'Body');
    await userEvent.click(screen.getByRole('button', { name: /add note/i }));

    expect(notesApi.createNote).toHaveBeenCalledWith({ title: 'My Note', content: 'Body' });
    await waitFor(() => {
      expect(screen.getByText('My Note')).toBeInTheDocument();
    });
  });

  it('clears the form inputs after a successful submit', async () => {
    render(<App />);
    await userEvent.type(screen.getByLabelText('Title'), 'My Note');
    await userEvent.type(screen.getByLabelText('Content'), 'Body');
    await userEvent.click(screen.getByRole('button', { name: /add note/i }));

    await waitFor(() => {
      expect(screen.getByLabelText('Title')).toHaveValue('');
      expect(screen.getByLabelText('Content')).toHaveValue('');
    });
  });

  it('calls deleteNote and removes the note from the list', async () => {
    notesApi.getNotes.mockResolvedValue([
      { id: 5, title: 'Note to Remove', content: 'Bye' },
    ]);
    render(<App />);

    await waitFor(() => screen.getByText('Note to Remove'));
    await userEvent.click(screen.getByRole('button', { name: /delete note to remove/i }));

    expect(notesApi.deleteNote).toHaveBeenCalledWith(5);
    await waitFor(() => {
      expect(screen.queryByText('Note to Remove')).not.toBeInTheDocument();
    });
  });
});
