const mongoose = require("mongoose");
const { format_number } = require("../intents/format_number");
const User = require("../models/user");

const check_user = async (res, queryResult, user_id) => {
  const number = format_number(
    queryResult.outputContexts[0].parameters["phoneNumber"]
  );

  const response = { fulfillmentText: `Вы ввели номер ${number}, верно?` };
  res.send(response);
};

module.exports = check_user;
