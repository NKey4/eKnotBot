import { format_number } from "../intents/format_number.js";

export const check_user = async (res, queryResult) => {
  const number = format_number(
    queryResult.outputContexts[0].parameters["phoneNumber"]
  );
  const response = { fulfillmentText: `Вы ввели номер ${number}, верно?` };
  res.send(response);
};
