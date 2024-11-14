import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'https://wlsf82-hacker-stories.web.app',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
