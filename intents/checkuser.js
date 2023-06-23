const checkuser = async (res, queryResult) => {
  const number = queryResult.outputContexts[0].parameters["phone-number"];
  let digitsOnly = number.replace(/\D/g, "");

  if (
    digitsOnly.length === 10 ||
    (digitsOnly.length === 11 && /^[78]/.test(digitsOnly))
  ) {
    digitsOnly = digitsOnly.replace(
      /(\d)(\d{3})(\d{3})(\d{2})(\d{2})/,
      "+7 $2 $3 $4 $5"
    );
  }

  res.send({ fulfillmentText: `Вы ввели номер ${digitsOnly}, верно?` });
};

module.exports = checkuser;
