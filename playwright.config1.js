// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config = ({
  testDir: './interviewTest',

  retries: 1,
  worker: 3,            //5 in parallel
  timeout: 40 * 1000,
  expect: { timeout: 10 * 1000 },

  reporter: 'html',

  project: [
    {
      name: 'chrome',
      use: {
        browserName: 'chromium',
        headless: false,
        video: 'retain-on-failure',
        screenshot: 'only-on-failure',
        ignoreHttpsErrors: true,
        permissions: ['geolocation'],
        trace: 'retain-on-failure',
        viewport: { width: 1080, height: 720 }
      },
    },
    {
      name: 'safari',
      use: {
        browserName: 'webkit',
        headless: true,
        screenshot: 'on',
        trace: 'off',
        ...devices['iPhone 13 Mini']
      },
    }

  ]

});
module.exports = config;

