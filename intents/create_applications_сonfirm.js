import dotenv from "dotenv";
dotenv.config();

export const create_applications_confirm = async (
  res,
  queryResult,
  user_id
) => {
  const contextToFind = `projects/eknot-ktdq/agent/sessions/${user_id}/contexts/logincheck`;
  let {
    "worktype.original": reason,
    location,
    worktype,
    description = "",
    addresses,
    number,
  } = queryResult.outputContexts[3].parameters;

  console.log(queryResult.outputContexts);
  location = location.toLowerCase();
  if (description === "") {
    res.send({
      fulfillmentText: `Желаете подать заявку, что у Вас ${location} ${reason}. Адрес: город ${
        addresses[number - 1].city
      }, ${
        addresses[number - 1].street
      }. Подтвердите, пожалуйста.\nПри неточностях, опишите заново.`,
    });
  } else {
    res.send({
      fulfillmentText: `Желаете подать заявку, что у Вас ${location} ${reason}. Подробности: ${description}. Адрес: город ${city}, ${address}. Подтвердите, пожалуйста.\nПри неточностях, опишите заново.`,
    });
  }
};
