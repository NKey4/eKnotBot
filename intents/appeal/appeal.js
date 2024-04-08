import OpenAI from "openai";
import AppealsModel from "../../models/Appeal.js";
import dotenv from "dotenv";
dotenv.config();

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
        'Ответ юридического консультанта обработается в течении минуты. Ответ вы можете отследить на сайте Sensata-service или сказав "Последнее обращение"',
    });
    let messages;
    let answer;
    let question;
    do {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      messages = await openai.beta.threads.messages.list(run.thread_id);
      console.log(messages.data);
      const userMessage = messages.data.find(
        (msg) => msg.role === "user" && msg.content && msg.content.length > 0
      );
      if (
        userMessage &&
        userMessage.content &&
        userMessage.content[0] &&
        userMessage.content[0].text
      ) {
        question = userMessage.content[0].text.value;
      }

      const assistantMessage = messages.data.find(
        (msg) =>
          msg.role === "assistant" && msg.content && msg.content.length > 0
      );
      if (
        assistantMessage &&
        assistantMessage.content &&
        assistantMessage.content[0] &&
        assistantMessage.content[0].text
      ) {
        answer = assistantMessage.content[0].text.value;
      }
    } while (!answer || !question);

    const newAppeal = new AppealsModel({
      question,
      answer: removeLinks(answer),
      user: user_id,
    });
    await newAppeal.save();
  } catch (error) {
    console.error("Ошибка сервера (appeal):", error);
    res.send({
      fulfillmentText: "Ошибка сервера",
    });
  }
};
