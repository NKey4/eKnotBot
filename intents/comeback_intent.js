const axios = require("axios");
require("dotenv").config();

const comeback_intent= async (res, queryResult, user_id) => {
  console.log(queryResult.outputContexts);
    const {"fullName.original": fullName} = queryResult.outputContexts[0].parameters;
    try{
        /*const response = await axios.get(process.env.CONFIRM_CODE_URL, { YandexId: user_id });
        const context = {
            name: `projects/eknot-ktdq/agent/sessions/${user_id}/contexts/logincheck`,
            lifespanCount: 100,
            parameters: {
              city: response.data.city,
              apartmentId:response.data.houses.apartmentRoles.apartmentId,
              address:response.data.houses.address,
              flat:response.data.houses.apartmentRoles.name,
            },
          };*/
          res.send({
            fulfillmentText: `Приветствую Вас, ${fullName}.\n Для того чтобы ознакомиться с функциями бота произнесите или напишите "Помощь".`,
            /*outputContexts: [context],*/
          });
    }catch (error) {
    console.error("Ошибка сервера (check_user_yes_code):", error);
    return res.sendStatus(500);
  }
    
}

module.exports = comeback_intent;