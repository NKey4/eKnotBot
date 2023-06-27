const { db } = require("../firebase");

const correctnumber = async (res, queryResult, user_id) => {
  const number = queryResult.outputContexts[2].parameters["phone-number"];
  let digitsOnly = number.replace(/\D/g, "");

  if (digitsOnly.length === 10) {
    digitsOnly = `+7 ${digitsOnly.slice(0, 3)} ${digitsOnly.slice(
      3,
      6
    )} ${digitsOnly.slice(6, 8)} ${digitsOnly.slice(8)}`;
  } else if (digitsOnly.length === 11 && /^[78]/.test(digitsOnly)) {
    digitsOnly = `+7 ${digitsOnly.slice(1, 4)} ${digitsOnly.slice(4,7)} ${digitsOnly.slice(7, 9)} ${digitsOnly.slice(9)}`;
  }

  const userRef = db.collection("users").doc(user_id);
  const result = await userRef.get();
  if (result.exists && result.data().phoneNumber === digitsOnly) {
    res.send({ fulfillmentText: `С возвращением, ${result.data().name}` });
  } else {
    res.sendStatus(408);
  }
};

module.exports = correctnumber;
