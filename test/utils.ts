import { expect, type Locator, type Page } from '@playwright/test';

export async function openSurvey(
  page: Page,
  category: 'habitat' | 'ecosystem',
  name: string
) {
  await page
    .locator(`ion-router-link[router-link="/survey/${category}"]`)
    .click();
  await page
    .getByText(name, { exact: true })
    .locator('..')
    .getByRole('button', { name: 'Start Survey' })
    .click();
}

export async function selectSite(page: Page) {
  await page.getByText('Select location', { exact: true }).click();
  await page.getByRole('listitem').filter({ hasText: 'E2E meadow' }).click();
  await expect(
    page.locator('b').filter({ hasText: /^E2E meadow$/ })
  ).toBeVisible();
}

export async function selectSpecies(
  page: Page,
  search: string,
  result: RegExp
) {
  await page.getByRole('searchbox').fill(search);
  await page
    .locator('#suggestions ion-item')
    .filter({ hasText: result })
    .first()
    .click();
}

export async function longPress(button: Locator) {
  const LONG_PRESS_DURATION = 600; // React Aria's long-press threshold is 500ms.
  await button.click({ delay: LONG_PRESS_DURATION });
}

export async function waitForStoredData(
  page: Page,
  store: 'mainStore' | 'samplesStore' | 'locationsStore',
  cid: string,
  data: Record<string, unknown>
) {
  // Models debounce autosaves; wait for storage rather than sleeping before reload.
  await expect
    .poll(async () =>
      page.evaluate(
        async args => {
          const stores = window as typeof window &
            Record<
              typeof args.store,
              {
                find: (id: string) => Promise<{ data: unknown } | undefined>;
              }
            >;
          return (await stores[args.store].find(args.cid))?.data;
        },
        { store, cid }
      )
    )
    .toMatchObject(data);
}

export async function expectPending(page: Page, label: string) {
  await page.goto('/home/surveys');
  const list = page.locator('#surveys-list');
  await expect(list.getByText(label, { exact: true })).toBeVisible();
  await page.reload();
  await expect(list.getByText(label, { exact: true })).toBeVisible();
  await expect(
    list.getByRole('button', { name: 'Upload', exact: true })
  ).toBeVisible();
  await expect(list.getByText('Draft', { exact: true })).not.toBeVisible();
}
