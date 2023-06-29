const { db } = require("../firebase");
const { format_number } = require("../intents/format_number");

const check_user_yes_code = async (res, queryResult, user_id) => {
  const { phoneNumber, code } = queryResult.outputContexts[1].parameters;

  const digitsOnly = format_number(phoneNumber);

  if (digitsOnly === null) {
    res.send({ fulfillmentText: "Некорректный номер телефона." });
    return;
  }

  const user = await db.collection("users").doc(user_id).get();
  if (
    user.exists &&
    user.data().phoneNumber === digitsOnly &&
    code === "7777"
  ) {
    res.send({ fulfillmentText: `С возвращением, ${user.data().name}` });
  } else {
    res.send({
      fulfillmentText: `Вы ввели неправильный номер телефона или код, введите всё заново`,
    });
  }
};

module.exports = check_user_yes_code;
