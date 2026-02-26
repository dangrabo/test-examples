# Notes App — Testing Example

A minimal CRUD app (create/read/delete notes) that demonstrates all four testing layers using the same stack as the main project.

## Stack

| Layer | Tech |
|---|---|
| Backend | Express 5, Sequelize 6, SQLite (dev/test), MySQL (prod) |
| Frontend | React 19, Vite, Axios |
| Backend tests | Vitest + Supertest |
| Frontend tests | Vitest + React Testing Library |
| E2E tests | Playwright |

---

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── app.js              Express app (exported for Supertest)
│   │   ├── server.js           Entry point (starts the HTTP server)
│   │   ├── database.js         Sequelize instance (SQLite or MySQL)
│   │   ├── models/Note.js      Sequelize model
│   │   ├── routes/notes.js     CRUD route handlers
│   │   └── utils/formatNote.js Pure utility function
│   └── tests/
│       ├── unit/formatNote.test.js        ← Backend unit tests
│       └── integration/notes.test.js      ← Integration tests
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api/notesApi.js     Axios wrapper
│   │   └── components/NoteCard.jsx
│   └── src/tests/
│       ├── unit/NoteCard.test.jsx          ← Frontend unit tests
│       └── integration/App.test.jsx        ← Frontend integration tests
│
├── e2e/
│   └── notes.spec.js                       ← End-to-end tests
│
└── playwright.config.js
```

---

## Setup

```bash
# Install root dependencies (Playwright)
npm install
npx playwright install chromium

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

---

## Running Tests

### Backend unit + integration tests
```bash
npm run test:backend
# or, from inside backend/:
npm test
```

### Frontend unit + integration tests
```bash
npm run test:frontend
# or, from inside frontend/:
npm test
```

### End-to-end tests
```bash
npm run test:e2e
```
Playwright will automatically start the backend and Vite dev server.

### Run everything
```bash
npm run test:all
```

---

## The Four Testing Layers

### 1. Backend Unit Tests
**File:** `backend/tests/unit/formatNote.test.js`  
**Tool:** Vitest

Tests the `formatNote()` utility function in complete isolation — no database, no HTTP. The function takes a raw Sequelize object and returns a clean API-safe shape. Tests verify trimming, field inclusion/exclusion, and output structure.

**Why:** Unit tests are fast and pinpoint exactly which function broke. They give you confidence to refactor internals without fear.

---

### 2. Frontend Unit Tests
**File:** `frontend/src/tests/unit/NoteCard.test.jsx`  
**Tools:** Vitest + React Testing Library

Tests the `NoteCard` component in isolation. Props are passed directly — no API, no router, no parent state. Tests assert what the user would see (rendered text, a delete button) and what happens on interaction (`onDelete` is called with the right id).

RTL encourages querying by role and label (like a screen reader would), not by CSS class, making tests resilient to style changes.

**Why:** Component unit tests verify the building blocks of the UI behave correctly before you assemble them into screens.

---

### 3. Integration Tests

**Backend:** `backend/tests/integration/notes.test.js`  
**Tools:** Vitest + Supertest

Fires real HTTP requests (`GET /notes`, `POST /notes`, `DELETE /notes/:id`) against the Express app. Uses a real Sequelize connection — but to SQLite in-memory instead of MySQL, so no database server is required.

Vitest automatically sets `NODE_ENV=test`, which `database.js` uses to switch dialects. Each test gets a clean database via `afterEach`.

**Frontend:** `frontend/src/tests/integration/App.test.jsx`  
**Tools:** Vitest + React Testing Library + `vi.mock()`

Renders the full `App` component with the `notesApi` module replaced by `vi.fn()` spies. The real component logic (state, event handlers, conditional rendering) runs — only the network layer is mocked. Tests verify full user flows: loading notes, submitting the form, deleting a note.

**Why:** Integration tests verify that the pieces connect correctly. Backend integration catches SQL bugs and HTTP contract issues. Frontend integration catches wiring bugs between components and the API layer.

---

### 4. End-to-End Tests
**File:** `e2e/notes.spec.js`  
**Tool:** Playwright

Drives a real Chromium browser against both servers running simultaneously. Tests cover the full user journey: loading the page, submitting the form, seeing the new note appear, reloading to confirm persistence, and deleting.

A `/notes/reset` endpoint (disabled in production) wipes the database before each test so they don't interfere.

**Why:** E2E tests are the highest-confidence check — they prove the whole system works together exactly as a user would experience it. They catch issues no lower-level test can: CORS misconfigurations, env variable mistakes, Vite proxy issues, etc.

---

## Database Strategy

| Environment | Database | How |
|---|---|---|
| `npm test` (Vitest) | SQLite in-memory | `NODE_ENV=test` auto-set by Vitest |
| `npm run dev` / E2E | SQLite file (`notes.db`) | Default when `DB_HOST` not set |
| Production | MySQL | Set `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS` env vars |

Copy `backend/.env.example` to `backend/.env` and fill in values for MySQL.
