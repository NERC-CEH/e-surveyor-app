import { expect, test } from './fixtures';
import { openSurvey, waitForStoredData } from './utils';

test('requires a site name and coordinates', async ({ homePage }) => {
  await openSurvey(homePage, 'habitat', 'Habitat Type');
  await homePage.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(homePage.locator('#location-location')).toBeVisible();
  await expect(homePage.locator('#location-details')).not.toBeVisible();
});

test('sets up a habitat site and preserves its draft without confirming an upload', async ({
  homePage,
}) => {
  await openSurvey(homePage, 'habitat', 'Habitat Type');
  await homePage
    .getByRole('textbox', { name: 'Site name' })
    .fill('North meadow');
  await homePage.locator('label').filter({ hasText: 'Drop a pin' }).click();
  await homePage.getByRole('button', { name: 'Next', exact: true }).click();
  const details = homePage.locator('#location-details');
  await details.getByPlaceholder('Length', { exact: true }).fill('100');
  await details.getByPlaceholder('Width', { exact: true }).fill('20');
  await details
    .locator('label')
    .filter({ hasText: 'No known management' })
    .click();
  await details.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(homePage.locator('#location-habitat')).toBeVisible();
  const habitatURL = homePage.url();
  const locationId = habitatURL.split('/').at(-2)!;
  await waitForStoredData(homePage, 'locationsStore', locationId, {
    data: {
      name: 'North meadow',
      'locAttr:439': '100',
      'locAttr:440': '20',
      'locAttr:442': ['24811'],
    },
  });
  await homePage.goto(habitatURL.replace(/\/habitat$/, '/details'));
  await expect(details.getByPlaceholder('Length', { exact: true })).toHaveValue(
    '100'
  );
  await expect(details.getByPlaceholder('Width', { exact: true })).toHaveValue(
    '20'
  );
  await expect(
    details.getByRole('checkbox', { name: 'No known management' })
  ).toBeChecked();
});
