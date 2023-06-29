const { format_number } = require("../intents/format_number");

const check_user = async (res, queryResult, user_id) => {
  const number = queryResult.outputContexts[0].parameters["phoneNumber"];
  const digitsOnly = format_number(number);

  if (digitsOnly === null) {
    res.send({ fulfillmentText: "Некорректный номер телефона." });
    return;
  }

  res.send({ fulfillmentText: `Вы ввели номер ${digitsOnly}, верно?` });
};

module.exports = check_user;
