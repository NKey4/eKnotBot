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

const format_number_app = (number)=>{
  return appNumber = number.toString().padStart(4,"0").replace(/(\d{2})(\d{2})/, "$1-$2");
}

const usual_number = (number)=>{
  let digitsOnly = number.replace(/\D/g, "");
  return digitsOnly = digitsOnly.replace(/^0+/, '');
}
module.exports = { format_number, format_number_app, usual_number };
