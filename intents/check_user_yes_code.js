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
    const context = {
      name: 'projects/eknot-ktdq/agent/sessions/2CF3B4D976AD447DDAE6BB2C6034CCA533252650FF31791390F00F0DD1D5D821/contexts/logincheck',
      lifespanCount: 100,
      parameters: {
        flag: 'true',
      }
    };
  res.send({fulfillmentText: `Приветствую Вас, ${user.data().name}.\n Для того чтобы ознакомиться с функциями бота произнесите или напишите \"Помощь\".`, outputContexts: [context] });
  } else {
    res.send({
      fulfillmentText: `Вы ввели неправильный номер телефона или код, введите всё заново`,
    });
  }
};

module.exports = check_user_yes_code;
