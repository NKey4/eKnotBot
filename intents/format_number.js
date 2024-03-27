export const format_number = (number) => {
  let digitsOnly = number.replace(/\D/g, "");

  if (digitsOnly.length === 10) {
    return digitsOnly.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, "+7 $1 $2 $3 $4");
  } else if (digitsOnly.length === 11 && /^[78]/.test(digitsOnly)) {
    return digitsOnly.replace(
      /(\d)(\d{3})(\d{3})(\d{2})(\d{2})/,
      "+7 $2 $3 $4 $5"
    );
  }
  return null;
};

export const format_number_to_770 = (number) => {
  let digitsOnly = number.replace(/\D/g, "");

  if (digitsOnly.length === 10) {
    return digitsOnly.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, "7$1$2$3$4");
  } else if (digitsOnly.length === 11 && /^[78]/.test(digitsOnly)) {
    return digitsOnly.replace(/(\d)(\d{3})(\d{3})(\d{2})(\d{2})/, "7$2$3$4$5");
  }
  return null;
};

export const format_number_app = (number) => {
  return (appNumber = number
    .toString()
    .padStart(4, "0")
    .replace(/(\d{2})(\d{2})/, "$1$2"));
};

export const format_code = (number) => {
  const digitsOnly = number.replace(/\D/g, "");
  return digitsOnly.length === 4 ? digitsOnly : null;
};

export const usual_number = (number) => {
  return number.replace(/\D/g, "").replace(/^0+/, "");
};
