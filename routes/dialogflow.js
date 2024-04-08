import express from "express";
const dialogFlowRouter = express.Router();
import dotenv from "dotenv";
import User from "../models/User.js";
dotenv.config();

import * as intentMappings from "../intents/index.js";

dialogFlowRouter.post("/", async (req, res) => {
  const { queryResult, session } = req.body;
  const yandex_id = session.split("/").pop();
  const user = await User.findOne({ yandex_id });
  const intentName = queryResult.intent.displayName;
  console.log(intentName);
  if (
    intentName === "create_applications_init_no" ||
    intentName === "create_applications_init_yes_desc" ||
    intentName === "create_applications_init_choiceFlat_no" ||
    intentName === "create_applications_init_choiceFlat_yes_desc"
  ) {
    const createIntentName = "create_applications_Confirm";
    console.log(createIntentName);
    await intentMappings[createIntentName](
      res,
      queryResult,
      yandex_id,
      user._id
    );
  } else if (
    intentName === "create_applications_init_choiceFlat_no_yes" ||
    intentName === "create_applications_init_choiceFlat_yes_desc_yes" ||
    intentName === "create_applications_init_yes_desc_yes" ||
    intentName === "create_applications_init_no_yes"
  ) {
    const createIntentName = "create_applications_accept";
    console.log(createIntentName);
    await intentMappings[createIntentName](
      res,
      queryResult,
      yandex_id,
      user._id
    );
  } else if (intentMappings[intentName]) {
    await intentMappings[intentName](res, queryResult, yandex_id, user._id);
  }
});

export default dialogFlowRouter;
