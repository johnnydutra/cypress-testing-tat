import { defineConfig } from "cypress";

export default defineConfig({
  chromeWebSecurity: false,
  e2e: {
    baseUrl: 'https://notes-serverless-app.com',
    defaultCommandTimeout: 10000,
    env: {
      viewportWidthBreakpoint: 768,
    },
    requestTimeout: 10000
  },
});
