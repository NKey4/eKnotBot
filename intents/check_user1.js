const check_user = async (res, queryResult, user_id) => {
  const number = queryResult.outputContexts[0].parameters["phone-number"];
  const cod = queryResult.outputContexts[0].parameters["code"];
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

  res.send({ fulfillmentText: `Вы ввели номер ${digitsOnly}, верно?` });
};

module.exports = check_user;
