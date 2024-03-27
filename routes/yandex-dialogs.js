import express from "express";
import { ContextsClient } from "@google-cloud/dialogflow";
import detectIntent from "../df.js";
import dotenv from "dotenv";
dotenv.config();

const aliceRouter = express.Router();
const dialogflowClient = new ContextsClient({
  credentials: JSON.parse(process.env.CREDENTIALS),
});

aliceRouter.post("/", async (req, res) => {
  try {
    const { request, session, state, version, meta } = req.body;
    const { user_id } = session.user;
    const jsonAnswer = { version, session };
    let intentResponse;

    const userAgent = meta && meta.client_id;
    let link;

    if (userAgent.includes("Apple")) {
      link =
        "https://apps.apple.com/kz/app/eknot-%D1%86%D0%B8%D1%84%D1%80%D0%BE%D0%B2%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F-%D0%BE%D1%81%D0%B8-%D0%B8-%D0%BF%D1%82/id1516986646";
    } else {
      link = "https://play.google.com/store/apps/details?id=me.eknot";
    }

    if (!request.command) {
      if (Object.keys(state.user).length) {
        intentResponse = await detectIntent(
          `fullName ${state.user.fullName}`,
          user_id
        );
        jsonAnswer.response = {
          text: intentResponse.fulfillmentText,
        };
      } else {
        jsonAnswer.response = {
          text: (await detectIntent("Привет", user_id)).fulfillmentText,
          card: {
            type: "BigImage",
            image_id: "1533899/4ac3620447eeaa50946a",
            title: "Клик",
            button: {
              title: "e-Knot",
              url: link,
            },
          },
        };
      }
    } else {
      intentResponse = await detectIntent(request.command, user_id);
      jsonAnswer.response = { text: intentResponse.fulfillmentText };
      if (intentResponse.intentDisplayName === "Exit") {
        jsonAnswer.response.end_session = true;
      } else if (
        intentResponse.intentDisplayName === "check_user_yes_code" &&
        intentResponse.webhookStatus.code === 0
      ) {
        const contextToFind = `projects/eknot-ktdq/agent/sessions/${user_id}/contexts/logincheck`;
        const request = {
          name: contextToFind,
        };
        const response = await dialogflowClient.getContext(request);
        jsonAnswer.user_state_update = {
          fullName: response[0].parameters.fields.fullName.stringValue,
        };
      }
    }

    res.json(jsonAnswer);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

export default aliceRouter;
