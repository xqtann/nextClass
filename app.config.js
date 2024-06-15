// app.config.js
import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    DIALOGFLOW_CLIENT_EMAIL: process.env.DIALOGFLOW_CLIENT_EMAIL,
    DIALOGFLOW_PRIVATE_KEY: process.env.DIALOGFLOW_PRIVATE_KEY,
    DIALOGFLOW_PROJECT_ID: process.env.DIALOGFLOW_PROJECT_ID,
  },
});
