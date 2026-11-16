import { expect, test } from './fixtures';

test('closes full-screen video with the Close button and pauses playback', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('#welcome-page ion-header ion-button').click();

  const watchButton = page.getByRole('button', {
    name: 'Watch the 90-second video',
  });
  const video = page.locator('video');
  await watchButton.click();

  await expect
    .poll(() =>
      video.evaluate(
        element => document.fullscreenElement === element.parentElement
      )
    )
    .toBe(true);
  await expect(video).toBeVisible();
  await expect(video).toHaveAttribute('src', /\/videos\/CAPTIONED_01_.*\.mp4$/);
  await expect(video).toHaveAttribute('controls', '');
  await expect(page.getByRole('dialog')).not.toBeVisible();

  const videoURL = await video.evaluate(
    (element: HTMLVideoElement) => element.currentSrc
  );
  const response = await page.request.head(videoURL);
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain('video/mp4');

  await page.getByRole('button', { name: 'Close video', exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => document.fullscreenElement === null))
    .toBe(true);
  await expect
    .poll(() => video.evaluate((element: HTMLVideoElement) => element.paused))
    .toBe(true);
  await expect(watchButton).toBeVisible();

  await watchButton.click();
  await expect
    .poll(() =>
      video.evaluate(
        element => document.fullscreenElement === element.parentElement
      )
    )
    .toBe(true);

  await page.evaluate(() => document.exitFullscreen());
  await expect
    .poll(() => video.evaluate((element: HTMLVideoElement) => element.paused))
    .toBe(true);
  await expect(
    page.getByRole('button', { name: 'Close video', exact: true })
  ).toBeHidden();
});

test('uses the iPhone native player and pauses when it closes', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('#welcome-page ion-header ion-button').click();

  const video = page.locator('video');
  await video.evaluate(element => {
    // Chromium has no iPhone video fullscreen API; simulate its entry and exit.
    Object.defineProperty(element, 'webkitEnterFullscreen', {
      value: () => element.setAttribute('data-native-fullscreen', 'true'),
    });
  });

  await page.getByRole('button', { name: 'Watch the 90-second video' }).click();
  await expect(video).toHaveAttribute('data-native-fullscreen', 'true');
  await video.dispatchEvent('webkitendfullscreen');
  await expect
    .poll(() => video.evaluate((element: HTMLVideoElement) => element.paused))
    .toBe(true);
});
