import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/live",
  outputDir: "test-results-live",
  workers: 1,
  use: {
    baseURL: "http://localhost:3102",
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
    trace: "retain-on-failure",
  },
  webServer: {
    command:
      "node --import ./tests/support/sanity-transport.mjs node_modules/next/dist/bin/next start --port 3102",
    url: "http://localhost:3102/cms",
    timeout: 120000,
    reuseExistingServer: false,
    env: {
      CONTENT_SOURCE: "sanity",
      NEXT_PUBLIC_SANITY_PROJECT_ID: "testproject",
      // Isolate Next's persistent fetch cache between test runs.
      NEXT_PUBLIC_SANITY_DATASET: "testing_" + Date.now(),
    },
  },
});
