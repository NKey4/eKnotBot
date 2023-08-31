const { db } = require("../firebase");
const { format_number } = require("../intents/format_number");

const check_user_yes_code = async (res, queryResult, user_id) => {
  const { phoneNumber, code } = queryResult.outputContexts[1].parameters;

  const digitsOnlyPhoneNum = format_number(phoneNumber);
  const digitsOnlyCode = format_code(code);
  const userRef = db.collection("users").doc(user_id);
  const user = await userRef.get();
  let eknotdata = "";
  try{
    const data = {
      yandexId: user_id,
      code: digitsOnlyCode,
      phoneNumber: digitsOnlyPhoneNum
  };
    eknotdata = await axios.post(`${process.env.CONFIRM_CODE_URL}`,data);
  } catch(error){
    console.log("Ошибка сервера (check_user_yes)");
    return res.sendStatus(500);
  }
  console.log(user.data()["entryDate"]);
  /*if (
    user.exists &&
    user.data().phoneNumber === digitsOnlyPhoneNum &&
    digitsOnlyCode === "7777"
  ) */
  const updateData = {};
  const currentDate = new Date();
  console.log(currentDate.getTime());
  updateData['entryDate'] = currentDate;
  await userRef.update(updateData);

  const context = {
    name: 'projects/eknot-ktdq/agent/sessions/2CF3B4D976AD447DDAE6BB2C6034CCA533252650FF31791390F00F0DD1D5D821/contexts/logincheck',
    lifespanCount: 100,
    parameters: {
      flag: 'true',
    }
    };
  res.send({fulfillmentText: `Приветствую Вас, ${displayName}.\n Для того чтобы ознакомиться с функциями бота произнесите или напишите \"Помощь\".`, outputContexts: [context] });
};

const format_code = (number) => {
  let digitsOnly = number.replace(/\D/g, "");
  console.log(digitsOnly);
  if (digitsOnly.length !== 4) {
    return null;
  } else{
    return digitsOnly;
  }
};

module.exports = check_user_yes_code;
