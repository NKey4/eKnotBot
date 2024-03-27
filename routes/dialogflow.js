import express from "express";
const dialogFlowRouter = express.Router();
import dotenv from "dotenv";
dotenv.config();

import * as intentMappings from "../intents/index.js";

dialogFlowRouter.post("/", async (req, res) => {
  const { queryResult, session } = req.body;
  const user_id = session.split("/").pop();
  const intentName = queryResult.intent.displayName;
  console.log(intentName);
  if (intentName.startsWith("create_applications")) {
    const createIntentName =
      intentName === "create_applications_no" ||
      intentName === "create_applications_yes_desc"
        ? "create_applications_Confirm"
        : "create_applications";

    await intentMappings[createIntentName](res, queryResult, user_id);
  } else if (intentMappings[intentName]) {
    await intentMappings[intentName](res, queryResult, user_id);
  }
});

export default dialogFlowRouter;
