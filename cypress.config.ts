import { defineConfig } from "cypress";

export default defineConfig({
  video: true,
  screenshotsFolder: "cypress/screenshots",
  videosFolder: "cypress/videos",
  fixturesFolder: "cypress/fixtures",

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
