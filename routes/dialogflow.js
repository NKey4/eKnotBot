const express = require("express");
const dialogFlowrouter = express.Router();
require("dotenv").config();

const intents = {
  get_applications: require("../intents/get_applications"),
  check_user: require("../intents/check_user"),
  create_applications: require("../intents/create_applications"),
  correct_number: require("../intents/correct_number"),
  get_debt: require("../intents/get_debt"),
};

dialogFlowrouter.post("/", async (req, res) => {
  const { queryResult, session } = req.body;
  const user_id = session.split("/").pop();
  const intentName = queryResult.intent.displayName;

  if (intents[intentName]) {
    await intents[intentName](res, queryResult, user_id);
  } else if (["checkuser", "checkagain"].includes(intentName)) {
    intents.check_user(res, queryResult, user_id);
  }
});

module.exports = dialogFlowrouter;
