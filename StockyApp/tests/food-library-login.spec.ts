import { test, expect } from '@playwright/test';

const EMAIL = process.env.STOCKY_TEST_EMAIL ?? 'mulesaurabh45@gmail.com';
const PASSWORD = process.env.STOCKY_TEST_PASSWORD ?? 'Saurabh@4501';

test('logs in and lands on the dashboard', async ({ page }) => {
  await page.goto('/login');

  await page.getByRole('textbox', { name: 'Email' }).fill(EMAIL);
  await page.getByRole('textbox', { name: 'Password' }).fill(PASSWORD);
  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { name: 'Today' })).toBeVisible();

  await page.screenshot({ path: 'logs/stocky-dashboard.png' });
});
