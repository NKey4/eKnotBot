const express = require("express");
const dialogFlowrouter = express.Router();
require("dotenv").config();

const intents = {
  application: require("../intents/application"),
  check_user: require("../intents/check_user"),
  create_applications: require("../intents/create_applications"),
  create_applications_Confirm: require("../intents/create_applications_Confirm"),
  check_user_yes_code: require("../intents/check_user_yes_code"),
  comeback_intent: require("../intents/comeback_intent"),
  delete_applications_select_number_yes: require("../intents/delete_applications"),
  get_debt: require("../intents/get_debt"),
  get_applications: require("../intents/get_applications"),
  get_one_application: require("../intents/get_one_application"),
  get_specific_application: require("../intents/get_specific_application"),
  get_last_application: require("../intents/get_specific_application"),
};

dialogFlowrouter.post("/", async (req, res) => {
  const { queryResult, session } = req.body;
  const user_id = session.split("/").pop();
  const intentName = queryResult.intent.displayName;

  if (intentName.startsWith("create_applications")) {
    const createIntentName =
      intentName === "create_applications_no" ||
      intentName === "create_applications_yes_desc"
        ? "create_applications_Confirm"
        : "create_applications";

    await intents[createIntentName](res, queryResult, user_id);
  } else if (intents[intentName]) {
    await intents[intentName](res, queryResult, user_id);
  }
});

module.exports = dialogFlowrouter;
