import dotenv from 'dotenv';

dotenv.config();

const create_applications_Confirm = async (res, queryResult, user_id) => {
  const contextToFind = `projects/eknot-ktdq/agent/sessions/${user_id}/contexts/logincheck`;
  let {
    "worktype.original": reason,
    location,
    worktype,
    description = "",
  } = queryResult.outputContexts[1].parameters;
  
  let { city, address, flat } = queryResult.outputContexts.find(
    (context) => context.name.endsWith('logincheck')
  ).parameters;
  
  location = location.toLowerCase();
  if (description === "") {
    res.send({
      fulfillmentText: `Желаете подать заявку, что у Вас ${location} ${reason}. Адрес: город ${city}, ${address}, квартира ${flat}. Подтвердите, пожалуйста.\nПри неточностях, опишите заново.`,
    });
  } else {
    res.send({
      fulfillmentText: `Желаете подать заявку, что у Вас ${location} ${reason}. Подробности: ${description}. Адрес: город ${city}, ${address}, квартира ${flat}. Подтвердите, пожалуйста.\nПри неточностях, опишите заново.`,
    });
  }
};

export default create_applications_Confirm;
