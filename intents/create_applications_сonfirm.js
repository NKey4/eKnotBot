import dotenv from "dotenv";
dotenv.config();

export const create_applications_confirm = async (
  res,
  queryResult,
  yandex_id
) => {
  const contextToFind = `projects/eknot-ktdq/agent/sessions/${yandex_id}/contexts/logincheck`;
  let {
    "worktype.original": reason,
    location,
    worktype,
    description = "",
    addresses,
    number,
  } = queryResult.outputContexts[5].parameters;
  console.log(queryResult.outputContexts);
  console.log(addresses);
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
      fulfillmentText: `Желаете подать заявку, что у Вас ${location} ${reason}. Подробности: ${description}. Адрес: город ${
        addresses[number - 1].city
      }, ${
        addresses[number - 1].street
      }. Подтвердите, пожалуйста.\nПри неточностях, опишите заново.`,
    });
  }
};
