const { test, expect } = require('@playwright/test');

test.describe('mobile toolbar and scaling controls', () => {
  test('renders touch actions and scale controls with stable snapshot', async ({ page }) => {
    await page.goto('/plantuml/form');
    await page.waitForFunction(() => Boolean(document.editor));

    await expect(page.getByRole('button', { name: 'Clear' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Paste + Render' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Paste + Render + Copy SVG' })).toBeVisible();
    await expect(page.locator('#diagram-scale-select')).toBeVisible();
    await expect(page.locator('#btn-scale-up')).toBeVisible();

    await page.locator('#btn-scale-up').click();
    await expect(page.locator('#diagram-scale-select')).toHaveValue('1.25');

    await expect(page).toHaveScreenshot('mobile-toolbar-and-scale-controls.png', {
      fullPage: true
    });
  });
});
