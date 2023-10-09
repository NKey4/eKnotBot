require("dotenv").config();

const create_applications_Confirm = async(res, queryResult, user_id) =>{
    let {
        "worktype.original": reason,
        location,
        worktype,
        description = "",
      } = queryResult.outputContexts[1].parameters;
      let {                                           
        city,
        address,
        flat,
      } = queryResult.outputContexts.find(
        (context) => context.name === contextToFind
      ).parameters;
      location = location.toLowerCase();
    if(description === ""){
        res.send({fulfillmentText:`Вы желаете подать заявку, что у Вас ${location} ${reason}. По адресу: город ${city}, ${address}, ${flat}. Подтвердите, пожалуйста.\nЕсли возникла какая-то неточность в заявке, то попробуйте заново описать проблему.`})  
    }else{
        res.send({fulfillmentText:`Вы желаете подать заявку, что у Вас ${location} ${reason}.Подробности: ${description}. По адресу: город ${city}, ${address}, ${flat}. Подтвердите, пожалуйста.\nЕсли возникла какая-то неточность в заявке, то попробуйте заново описать проблему.`})  
    };
}

module.exports = create_applications_Confirm;