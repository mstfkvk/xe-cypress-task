const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl:'https://www.xe.com',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    excludeSpecPattern: '*.fetch', 
    experimentalNetworkStubbing: true,
    chromeWebSecurity: false,
  },
});
