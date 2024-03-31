import express from "express";
const dialogFlowRouter = express.Router();
import UserModel from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

import * as intentMappings from "../intents/index.js";

dialogFlowRouter.post("/", async (req, res) => {
  const { queryResult, session } = req.body;
  const yandex_id = session.split("/").pop();
  const user = await UserModel.findOne({ yandex_id });
  const user_id = user?._id;
  const intentName = queryResult.intent.displayName;
  console.log(intentName);
  if (
    intentName === "create_applications_choiceflat_no" ||
    intentName === "create_applications_choiceflat_yes_desc"
  ) {
    const createIntentName = "create_applications_confirm";
    console.log(createIntentName);
    await intentMappings[createIntentName](
      res,
      queryResult,
      yandex_id,
      user_id
    );
  } else if (
    intentName === "create_applications_choiceflat_no_yes" ||
    intentName === "create_applications_choiceflat_yes_desc_yes"
  ) {
    const createIntentName = "create_applications_accept";

    await intentMappings[createIntentName](
      res,
      queryResult,
      yandex_id,
      user_id
    );
  } else if (intentMappings[intentName]) {
    await intentMappings[intentName](res, queryResult, yandex_id, user_id);
  }
});

export default dialogFlowRouter;
