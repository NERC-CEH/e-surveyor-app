import { test as base, expect, type Page } from '@playwright/test';
import { waitForStoredData } from './utils';

const EMAIL = 'recorder@example.invalid';
const token = [
  Buffer.from(JSON.stringify({ alg: 'none' })).toString('base64url'),
  Buffer.from(
    JSON.stringify({
      sub: '1',
      email: EMAIL,
      email_verified: true,
      exp: 4102444800,
      'http://indicia.org.uk/user:id': 1,
    })
  ).toString('base64url'),
  '',
].join('.');

export const test = base.extend<{ homePage: Page }>({
  // Install before any page opens, including popups; never forward remote writes.
  context: async ({ context }, use) => {
    const blockedWrites: string[] = [];

    await context.route('**/*', async route => {
      const request = route.request();
      const url = new URL(request.url());
      const method = request.method();

      if (url.pathname === '/oauth/token' && method === 'POST') {
        await route.fulfill({
          json: { access_token: token, refresh_token: 'e2e-only' },
        });
        return;
      }

      if (url.pathname === '/user/1' && method === 'GET') {
        await route.fulfill({ json: { mail: [{ value: EMAIL }] } });
        return;
      }

      if (url.hostname === 'events.mapbox.com') {
        await route.fulfill({ status: 204 });
        return;
      }

      if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
        blockedWrites.push(`${method} ${url.origin}${url.pathname}`);
        await route.abort('blockedbyclient');
        return;
      }

      if (url.pathname.endsWith('/services/rest/locations')) {
        await route.fulfill({
          json: [
            {
              values: {
                id: '1',
                external_key: 'e2e-site',
                name: 'E2E meadow',
                location_type_id: '14',
                lat: '51.5074',
                lon: '-0.1278',
                centroid_sref: '51.5074, -0.1278',
                centroid_sref_system: '4326',
                created_on: '2026-01-01',
                updated_on: '2026-01-01',
              },
            },
          ],
        });
        return;
      }

      if (url.pathname.endsWith('/services/rest/location-media')) {
        await route.fulfill({ json: [] });
        return;
      }

      await route.continue();
    });

    await use(context);

    expect(blockedWrites, 'Unexpected remote writes were blocked').toEqual([]);
  },

  homePage: async ({ page }, use) => {
    await page.goto('/');
    await page.locator('#welcome-page ion-header ion-button').click();
    await expect(page.locator('#home-landing')).toBeVisible();

    await page.locator('ion-tab-button[tab="home/menu"]').click();
    await page.getByRole('link', { name: 'Login', exact: true }).click();
    await page.getByPlaceholder('Email', { exact: true }).fill(EMAIL);
    await page.getByPlaceholder('Password', { exact: true }).fill('e2e-only');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(page.locator('#home-landing')).toBeVisible();
    await waitForStoredData(page, 'mainStore', 'app', { showedWelcome: true });

    await use(page);
  },
});

export { expect } from '@playwright/test';
