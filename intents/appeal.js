import dialogflow from "@google-cloud/dialogflow";
import OpenAI from "openai";
import AppealsModel from "../models/Appeals.js";
import dotenv from "dotenv";

dotenv.config();

const { ContextsClient } = dialogflow.v2beta1;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const ASSISTANT_ID = process.env.ASSISTANT_ID;

function removeLinks(text) {
  return text.replace(/【\d+:\d+†source】/g, "");
}

export const appeal = async (res, queryResult, yandex_id, user_id) => {
  try {
    const run = await openai.beta.threads.createAndRun({
      assistant_id: ASSISTANT_ID,
      thread: {
        messages: [
          {
            role: "user",
            content: queryResult.outputContexts[0].parameters.question,
          },
        ],
      },
    });
    res.send({
      fulfillmentText:
        "Ответ юридического консультанта обработается в течении минуты. Ответ вы можете отследить на сайте Sensata-service",
    });
    let messages;
    let answer;
    do {
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Check every 5 seconds
      messages = await openai.beta.threads.messages.list(run.thread_id);
      const message = messages.data.find(
        (msg) =>
          msg.role === "assistant" && msg.content && msg.content.length > 0
      );
      if (message) {
        answer = message.content[0].text.value;
      }
    } while (!answer);

    const newAppeal = new AppealsModel({
      answer: removeLinks(answer),
      user: user_id,
    });
    await newAppeal.save();
  } catch (error) {
    console.error("Server error (appeal):", error);
    res.sendStatus(500);
  }
};
