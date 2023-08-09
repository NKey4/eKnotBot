require("dotenv").config();

const create_applications_Confirm = async(res, queryResult, user_id) =>{
    let {
        "worktype.original": reason,
        location,
        worktype,
        description = "",
      } = queryResult.outputContexts[1].parameters;
      location = location.toLowerCase();
    if(description === ""){
        res.send({fulfillmentText:`Вы желаете подать заявку, что у Вас ${location} ${reason}. Подтвердите, пожалуйста.\nЕсли же в заявке допущена ошибка, то придётся заново формировать заявку.`})  
    }else{
        res.send({fulfillmentText:`Вы желаете подать заявку, что у Вас ${location} ${reason}.Подробности: ${description}. Подтвердите, пожалуйста.\nЕсли же в заявке допущена ошибка, то придётся заново формировать заявку.`})  
    };
}

module.exports = create_applications_Confirm;