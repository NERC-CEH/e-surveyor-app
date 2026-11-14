import { expect, test } from './fixtures';
import { expectPending, openSurvey } from './utils';

test('requires a date before finishing moth recording', async ({
  homePage,
}) => {
  await openSurvey(homePage, 'ecosystem', 'Moths');
  await homePage.getByRole('button', { name: 'Make records' }).click();
  await homePage.getByRole('button', { name: 'Finish', exact: true }).click();
  await expect(homePage.getByRole('alertdialog')).toContainText(
    'Date is missing'
  );
});

test('finishes a moth survey locally and retains its habitat', async ({
  homePage,
}) => {
  await openSurvey(homePage, 'ecosystem', 'Moths');
  await homePage.getByRole('button', { name: 'Make records' }).click();
  await homePage.getByRole('button', { name: /^\d{2}\/\d{2}\/\d{2}$/ }).click();
  await homePage.keyboard.press('Escape');
  await homePage.getByRole('button', { name: 'Habitat', exact: true }).click();
  await homePage.getByRole('option', { name: 'Meadow', exact: true }).click();
  const surveyURL = homePage.url();
  await homePage.getByRole('button', { name: 'Finish', exact: true }).click();
  await expect(homePage).toHaveURL(/\/report$/);
  await expectPending(homePage, 'Moth recording');
  await homePage.goto(surveyURL);
  await homePage.getByRole('button', { name: 'Make records' }).click();
  await expect(
    homePage.getByRole('button', { name: 'Meadow Habitat', exact: true })
  ).toBeVisible();
});

test('keeps a moth photo offline and requires identification before finishing', async ({
  homePage,
}) => {
  await openSurvey(homePage, 'ecosystem', 'Moths');
  await homePage.getByRole('button', { name: 'Make records' }).click();
  await homePage.getByRole('button', { name: /^\d{2}\/\d{2}\/\d{2}$/ }).click();
  await homePage.keyboard.press('Escape');

  await homePage.context().setOffline(true);
  await expect
    .poll(() => homePage.evaluate(() => navigator.onLine))
    .toBe(false);

  const chooser = homePage.waitForEvent('filechooser');
  await homePage.getByRole('button', { name: 'Add', exact: true }).click();
  await (
    await chooser
  ).setFiles('src/Info/OnboardingScreensRequired/Components/images/first.jpg');

  await expect(
    homePage.getByText('Unidentified', { exact: true })
  ).toBeVisible();
  await homePage.getByRole('button', { name: 'Finish', exact: true }).click();
  await expect(homePage.getByRole('alertdialog')).toContainText(
    'Moth has not been identified'
  );
  await homePage.getByRole('button', { name: 'Got it', exact: true }).click();
  await expect(homePage.getByRole('alertdialog')).not.toBeVisible();

  await expect(
    homePage.locator('#survey-moth-home .list-avatar img')
  ).toBeVisible();
});
