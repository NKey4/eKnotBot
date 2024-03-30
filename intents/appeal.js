import dialogflow from "@google-cloud/dialogflow";
import OpenAI from "openai";
const { ContextsClient } = dialogflow.v2beta1;
import { struct } from "pb-util";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

function removeLinks(text) {
  const linkRegex = /【\d+:\d+†source】/g;
  return text.replace(linkRegex, "");
}

export const appeal = async (res, queryResult, user_id) => {
  const { project_id, private_key, client_email } = JSON.parse(
    process.env.CREDENTIALS
  );
  const openai = new OpenAI({
    apiKey: "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",
  });
  const contextsClient = new ContextsClient({
    credentials: { private_key, client_email },
  });

  try {
    const assistant_id = "asst_vEJ2dbY917ntshxsQXDAqEgq";
    const run = await openai.beta.threads.createAndRun({
      assistant_id: assistant_id,
      thread: {
        messages: [
          {
            role: "user",
            content: queryResult.outputContexts[0].parameters.question,
          },
        ],
      },
    });

    const runShow = await openai.beta.threads.runs.retrieve(
      run.thread_id,
      run.id
    );
    res.send({
      fulfillmentText:
        "Ответ юридического консультанта обработается в течении минуты. Ответ вы можете отследить на сайте Sensata-service",
    });
    setTimeout(async () => {
      const messages = await openai.beta.threads.messages.list(run.thread_id);
      messages.data.reverse().map((message) => {
        console.log(
          message.role + ": " + removeLinks(message.content[0].text.value)
        );
      });
    }, 10000);
  } catch (error) {
    console.error("Server error (appeal):", error);
    return res.sendStatus(500);
  }
};
