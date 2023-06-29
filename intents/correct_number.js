const { db } = require("../firebase");

const correct_number = async (res, queryResult, user_id) => {
  const number = queryResult.outputContexts[2].parameters["phone-number"];
  let digitsOnly = number.replace(/\D/g, "");

  if (digitsOnly.length === 10) {
    digitsOnly = digitsOnly.replace(
      /(\d{3})(\d{3})(\d{2})(\d{2})/,
      "+7 $1 $2 $3 $4"
    );
  } else if (digitsOnly.length === 11 && /^[78]/.test(digitsOnly)) {
    digitsOnly = digitsOnly.replace(
      /(\d)(\d{3})(\d{3})(\d{2})(\d{2})/,
      "+7 $2 $3 $4 $5"
    );
  } else {
    res.send({ fulfillmentText: "Некорректный номер телефона." });
    return;
  }

  const userRef = db.collection("users").doc(user_id);
  const result = await userRef.get();
  if (result.exists && result.data().phoneNumber === digitsOnly) {
    res.send({ fulfillmentText: `С возвращением, ${result.data().name}` });
  } else {
    res.sendStatus(408);
  }
};

module.exports = correct_number;
