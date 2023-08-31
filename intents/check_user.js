const { format_number } = require("../intents/format_number");
const { db } = require("../firebase");

const check_user = async (res, queryResult, user_id) => {

  const number = queryResult.outputContexts[0].parameters["phoneNumber"];
  const digitsOnly = format_number(number);

  const collectionRef = db.collection("users");
  let result = await collectionRef.doc(user_id).get();
  console.log(user_id);
  if(!result.exists){
    result = collectionRef.doc(user_id);
    result.set({phoneNumber: ""})
    .then(() => {
      console.log('Документ успешно создан.');
    })
    .catch((error) => {
      console.error('Ошибка при создании документа:', error);
    });
  }

  if (digitsOnly === null) {
    res.send({ fulfillmentText: "Некорректный номер телефона." });
    return;
  }else{
    res.send({ fulfillmentText: `Вы ввели номер ${digitsOnly}, верно?` });
  }
};

module.exports = check_user;
