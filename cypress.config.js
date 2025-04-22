const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://sweetshop.netlify.app/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // Jira integration configuration
    env: {
      jira: {
        url: 'https://darijusluza1.atlassian.net',
        projectKey: 'SCRUM',
        // These should be set as environment variables
        username: process.env.JIRA_USERNAME,
        password: process.env.JIRA_PASSWORD
      }
    }
  },
  // Add test case IDs to your tests
  testCaseId: {
    prefix: 'SCRUM-',
    separator: '-'
  }
});
