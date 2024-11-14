import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost',
    env: {
      hideCredentials: true,
      requestMode: true
    },
    experimentalRunAllSpecs: true
  },
  fixturesFolder: false,
  video: false
});
