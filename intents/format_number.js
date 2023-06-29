const format_number = (number) => {
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
    return null;
  }

  return digitsOnly;
};

module.exports = { format_number };
