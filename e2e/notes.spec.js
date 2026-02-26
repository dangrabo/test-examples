/**
 * END-TO-END TESTS
 *
 * E2E tests drive a real browser against the fully running application.
 * Both the backend server and Vite dev server are started automatically
 * by Playwright (configured in playwright.config.js).
 *
 * Tool: Playwright
 *   - page.goto()              navigate to a URL
 *   - page.getByLabel()        find an input by its accessible label
 *   - page.getByRole()         find elements by ARIA role + name
 *   - page.getByText()         find elements by visible text
 *   - expect(...).toBeVisible() assert an element is on screen
 *
 * The /notes/reset endpoint (only active outside production) wipes the
 * database before each test so tests don't interfere with one another.
 */
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page, request }) => {
  // Reset DB so every test starts with zero notes
  await request.delete('http://localhost:3000/notes/reset');
  await page.goto('/');
});

// ---------------------------------------------------------------------------

test('shows the page heading', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Notes' })).toBeVisible();
});

test('shows a validation error when the form is submitted empty', async ({ page }) => {
  await page.getByRole('button', { name: 'Add Note' }).click();
  await expect(page.getByRole('alert')).toContainText('Both fields are required');
});

test('creates a new note and displays it on the page', async ({ page }) => {
  await page.getByLabel('Title').fill('E2E Test Note');
  await page.getByLabel('Content').fill('Written by Playwright');
  await page.getByRole('button', { name: 'Add Note' }).click();

  await expect(page.getByText('E2E Test Note')).toBeVisible();
  await expect(page.getByText('Written by Playwright')).toBeVisible();
});

test('clears the form after a note is created', async ({ page }) => {
  await page.getByLabel('Title').fill('Clear Me');
  await page.getByLabel('Content').fill('After submit');
  await page.getByRole('button', { name: 'Add Note' }).click();

  await expect(page.getByLabel('Title')).toHaveValue('');
  await expect(page.getByLabel('Content')).toHaveValue('');
});

test('deletes a note and removes it from the page', async ({ page }) => {
  // Create a note first
  await page.getByLabel('Title').fill('To Be Deleted');
  await page.getByLabel('Content').fill('Delete me');
  await page.getByRole('button', { name: 'Add Note' }).click();
  await expect(page.getByText('To Be Deleted')).toBeVisible();

  // Delete it
  await page.getByRole('button', { name: /delete to be deleted/i }).click();

  await expect(page.getByText('To Be Deleted')).not.toBeVisible();
});

test('persists notes across page reloads', async ({ page }) => {
  await page.getByLabel('Title').fill('Persistent Note');
  await page.getByLabel('Content').fill('Still here after reload');
  await page.getByRole('button', { name: 'Add Note' }).click();
  await expect(page.getByText('Persistent Note')).toBeVisible();

  await page.reload();

  await expect(page.getByText('Persistent Note')).toBeVisible();
});
