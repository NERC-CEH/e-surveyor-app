import { expect, test } from './fixtures';
import {
  expectPending,
  longPress,
  openSurvey,
  selectSite,
  selectSpecies,
} from './utils';

test('requires a site before finishing free sampling', async ({ homePage }) => {
  await openSurvey(homePage, 'habitat', 'Free Sampling');
  await homePage.getByRole('button', { name: 'OK, got it' }).click();
  await expect(
    homePage.getByRole('alertdialog', { name: 'Your first survey' })
  ).not.toBeVisible();
  await homePage.getByRole('button', { name: 'Finish', exact: true }).click();
  await expect(homePage.getByRole('alertdialog')).toContainText(
    'Location is missing'
  );
});

test('records plants and keeps the finished survey locally after reload', async ({
  homePage,
}) => {
  await openSurvey(homePage, 'habitat', 'Free Sampling');
  await homePage.getByRole('button', { name: 'OK, got it' }).click();
  await expect(
    homePage.getByRole('alertdialog', { name: 'Your first survey' })
  ).not.toBeVisible();
  await selectSite(homePage);
  await longPress(
    homePage.getByRole('button', { name: 'Plant Species', exact: true })
  );
  await selectSpecies(homePage, 'Daisy', /Daisy/);
  await expect(
    homePage.locator('#survey-default-edit').getByText('Daisy', { exact: true })
  ).toBeVisible();
  await homePage.getByRole('button', { name: 'Finish', exact: true }).click();
  await expect(homePage).toHaveURL(/\/report$/);
  await expectPending(homePage, 'Habitat Free');
});
