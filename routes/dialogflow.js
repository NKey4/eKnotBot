const express = require("express");
const dialogFlowrouter = express.Router();
require("dotenv").config();

const intents = {
  get_applications: require("../intents/get_applications"),
  get_one_application: require("../intents/get_one_application"),
  check_user: require("../intents/check_user"),
  create_applications: require("../intents/create_applications"),
  check_user_yes_code: require("../intents/check_user_yes_code"),
  get_debt: require("../intents/get_debt"),
  application: require("../intents/application"),
};

dialogFlowrouter.post("/", async (req, res) => {
  const { queryResult, session } = req.body;
  const user_id = session.split("/").pop();
  const intentName = queryResult.intent.displayName;
  console.log(intentName);
  if (intentName.startsWith("create_applications")) {
    await intents.create_applications(res, queryResult, user_id);
  } else if (intents[intentName]) {
    await intents[intentName](res, queryResult, user_id);
  }
});

module.exports = dialogFlowrouter;
