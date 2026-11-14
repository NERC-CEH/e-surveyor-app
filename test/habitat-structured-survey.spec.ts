import { expect, test } from './fixtures';
import { openSurvey, selectSite, waitForStoredData } from './utils';

test('requires a site and protocol before creating quadrats', async ({
  homePage,
}) => {
  await openSurvey(homePage, 'habitat', 'Structured Sampling');
  await homePage.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(homePage.getByRole('alertdialog')).toContainText(
    'Location is missing'
  );
  await expect(homePage.getByRole('alertdialog')).toContainText(
    'Survey protocol'
  );
});

test('creates protocol quadrats and preserves a quadrat draft', async ({
  homePage,
}) => {
  await openSurvey(homePage, 'habitat', 'Structured Sampling');
  await selectSite(homePage);
  await homePage.getByRole('button', { name: 'Protocol', exact: true }).click();
  await homePage
    .getByRole('option', { name: 'Agri-environment', exact: true })
    .click();
  await homePage.getByRole('button', { name: 'Next', exact: true }).click();
  const quadrats = homePage.locator('#transect-transects');
  await expect(quadrats.getByRole('link', { name: /Quadrat/ })).toHaveCount(10);
  await quadrats.getByRole('link', { name: 'Quadrat #1', exact: true }).click();
  const quadrat = homePage.locator('#transect-quadrat');
  await quadrat
    .getByRole('textbox', { name: 'Comment' })
    .fill('First quadrat draft');
  await quadrat.getByRole('button', { name: 'Finish', exact: true }).click();
  await expect(homePage.getByRole('alertdialog')).toContainText(
    'Photo required'
  );
  await homePage.getByRole('button', { name: 'OK', exact: true }).click();
  await quadrat.getByRole('button', { name: 'Back', exact: true }).click();
  const surveyId = homePage.url().split('/quadrats')[0].split('/').pop() ?? '';
  await waitForStoredData(homePage, 'samplesStore', surveyId, {
    samples: expect.arrayContaining([
      expect.objectContaining({
        data: expect.objectContaining({ comment: 'First quadrat draft' }),
      }),
    ]),
  });
  await homePage.reload();
  await homePage
    .locator('#transect-transects')
    .getByRole('link', { name: 'Quadrat #1', exact: true })
    .click();
  await expect(quadrat.getByRole('textbox', { name: 'Comment' })).toHaveValue(
    'First quadrat draft'
  );
});
