import { expect, test } from './fixtures';
import { expectPending, openSurvey } from './utils';

test('requires at least one trap', async ({ homePage }) => {
  await openSurvey(homePage, 'ecosystem', 'Ground Beetles (Carabids)');
  await expect(
    homePage.getByRole('link', { name: /Location/ })
  ).not.toContainText('No location');
  await homePage.getByRole('button', { name: 'Next', exact: true }).click();
  await homePage.getByRole('button', { name: 'Finish', exact: true }).click();
  await expect(homePage.getByRole('alertdialog')).toContainText(
    'Please add at least one trap'
  );
});

test('adds a trap and finishes locally', async ({ homePage }) => {
  await openSurvey(homePage, 'ecosystem', 'Ground Beetles (Carabids)');
  await expect(
    homePage.getByRole('link', { name: /Location/ })
  ).not.toContainText('No location');
  await homePage.getByRole('button', { name: 'Next', exact: true }).click();
  await homePage.getByRole('button', { name: /Add Trap/i }).click();
  const trap = homePage.locator('#transect-trap');
  const trapURL = homePage.url();
  await trap.getByRole('textbox', { name: 'Notes' }).fill('Edge trap');
  await expect(trap.getByRole('link', { name: /Location/ })).not.toContainText(
    'No location'
  );
  await trap.getByRole('button', { name: 'Back', exact: true }).click();
  await homePage.getByRole('button', { name: 'Finish', exact: true }).click();
  await expectPending(homePage, 'Beetle trap');
  await homePage.goto(trapURL);
  await expect(trap.getByRole('textbox', { name: 'Notes' })).toHaveValue(
    'Edge trap'
  );
});
