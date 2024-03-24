import { format_number } from '../../utils/format_number.js';

const check_user = async (res, queryResult, user_id) => {
  const number = format_number(queryResult.outputContexts[0].parameters["phoneNumber"]);
  const response = { fulfillmentText: `Вы ввели номер ${number}, верно?` };
  res.send(response);
};

export default check_user;