import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './test',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: 'http://localhost:8100',
    trace: 'on-first-retry',
    serviceWorkers: 'block',
    geolocation: { latitude: 51.5074, longitude: -0.1278, accuracy: 5 },
    permissions: ['geolocation'],
  },
  projects: [
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'APP_BUILD=test npx webpack serve --port 8100',
    url: 'http://localhost:8100',
    reuseExistingServer: !process.env.CI,
  },
});
