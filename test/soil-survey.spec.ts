import { expect, test } from './fixtures';
import { expectPending } from './utils';

test('adds a soil sample and retains its measurements', async ({
  homePage,
}) => {
  // Soil cards are placeholders; the implemented generic survey still has a route.
  await homePage.goto('/survey/soil/soil');
  await homePage.getByRole('button', { name: 'OK', exact: true }).click();
  await homePage
    .getByRole('button', { name: 'Add Sample', exact: true })
    .click();
  const sample = homePage.locator('#survey-soil-sample-home');
  const sampleURL = homePage.url();
  await sample
    .getByRole('textbox', { name: 'Sample name' })
    .fill('North field');
  await sample.getByRole('link', { name: /Earthworm Survey/ }).click();
  await homePage.getByRole('textbox', { name: 'Worm count' }).fill('5');
  await homePage
    .locator('#survey-soil-worm')
    .getByRole('button', { name: 'Back', exact: true })
    .click();
  await sample.getByRole('button', { name: 'Back', exact: true }).click();
  await expect(
    homePage.locator('#survey-soil-home').getByRole('listitem')
  ).toHaveCount(1);
  await homePage.getByRole('button', { name: 'Finish', exact: true }).click();
  await expect(homePage).toHaveURL(/\/report$/);
  await expectPending(homePage, 'Soil survey');
  await homePage.goto(sampleURL);
  await expect(
    sample.getByRole('textbox', { name: 'Sample name' })
  ).toHaveValue('North field');
  await sample.getByRole('link', { name: /Earthworm Survey/ }).click();
  await expect(
    homePage.getByRole('textbox', { name: 'Worm count' })
  ).toHaveValue('5');
});
