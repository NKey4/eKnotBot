const axios = require("axios");
require("dotenv").config();

const comeback_intent= async (res, queryResult, user_id) => {
    const {"fullName.original": fullName} = queryResult.outputContexts[0].parameters;
    try{
      const response = await axios.get(process.env.GET_ADDRESS_URL + "?YandexId=1111");
        const context = {
            name: `projects/eknot-ktdq/agent/sessions/${user_id}/contexts/logincheck`,
            lifespanCount: 100,
            parameters: {
              city: response.data.city,
              apartmentId:response.data.houses[0].apartmentRoles[0].apartmentId,
              address:response.data.houses[0].address,
              flat:response.data.houses[0].apartmentRoles[0].name,
            },
          };
          /*const context = {
            name: `projects/eknot-ktdq/agent/sessions/${user_id}/contexts/logincheck`,
            lifespanCount: 100,
            parameters: {
              city: "Астана",
              apartmentId:"dssfsdfsdf",
              address:"dds4f1sdf4",
              flat:"response.data.houses.apartmentRoles.name",
            },
          };*/
          res.send({
            fulfillmentText: `Приветствую Вас, ${fullName}.\n Для того чтобы ознакомиться с функциями бота произнесите или напишите "Помощь".`,
            outputContexts: [context],
          });
    }catch (error) {
    console.error("Ошибка сервера (check_user_yes_code):", error);
    return res.sendStatus(500);
  }
    
}

module.exports = comeback_intent;