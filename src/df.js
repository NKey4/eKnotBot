// Импортируем зависимости
import dialogflow from "@google-cloud/dialogflow";
import dotenv from "dotenv";

dotenv.config();

const { SessionsClient } = dialogflow.v2;

// Деструктурируем переменные окружения
const { project_id, private_key, client_email } = JSON.parse(process.env.CREDENTIALS);

const sessionClient = new SessionsClient({
  credentials: { private_key, client_email },
});

const detectIntent = async (queryText, user_id) => {
  const sessionPath = sessionClient.projectAgentSessionPath(project_id, user_id);
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: queryText,
        languageCode: "ru",
      },
    },
  };

  const [response] = await sessionClient.detectIntent(request);
  return {
    fulfillmentText: response.queryResult.fulfillmentText,
    intentDisplayName: response.queryResult.intent.displayName,
    context: response.queryResult.outputContexts,
    webhookStatus: response.webhookStatus,
  };
};

export default detectIntent;
