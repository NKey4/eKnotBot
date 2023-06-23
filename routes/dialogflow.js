const express = require("express");
const dialogFlowrouter = express.Router();
require("dotenv").config();

const getApplications = require("../intents/getApplications");
const checkuser = require("../intents/checkuser");
const createApplications = require("../intents/createApplications");
const correctnumber = require("../intents/correctnumber");

dialogFlowrouter.post("/", async (req, res) => {
  const { queryResult } = req.body;
  const { session } = req.body;
  const user_id = session.split("/").pop();

  const intentName = queryResult.intent.displayName;
  console.log(intentName);
  if (intentName === "get_applications") {
    await getApplications(res, user_id);
  }
  if (intentName === "correctnumber") {
    await correctnumber(res, queryResult, user_id);
  }
  if (intentName === "checkuser") {
    checkuser(res, queryResult);
  }
  if (intentName === "checkagain") {
    checkuser(res, queryResult);
  }
  if (intentName === "create_applications1") {
    await createApplications(res, queryResult, user_id);
  }
});

module.exports = dialogFlowrouter;
