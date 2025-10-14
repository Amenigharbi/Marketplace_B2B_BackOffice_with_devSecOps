import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "fny8q3",
  e2e: {
    setupNodeEvents(on, config) {
      return config;
    },
    baseUrl: "https://oms-backend-six.vercel.app",
  },
});
