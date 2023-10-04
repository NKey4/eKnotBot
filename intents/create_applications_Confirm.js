require("dotenv").config();

const create_applications_Confirm = async(res, queryResult, user_id) =>{
    let {
        "worktype.original": reason,
        location,
        worktype,
        description = "",
      } = queryResult.outputContexts[1].parameters;
        //Нахождение контекста
    const contextToFind = `projects/eknot-ktdq/agent/sessions/${user_id}/contexts/logincheck`;
    const foundContext = queryResult.outputContexts.find(context => context.name === contextToFind)
    console.log(foundContext);
      location = location.toLowerCase();
    if(description === ""){
        res.send({fulfillmentText:`Вы желаете подать заявку, что у Вас ${location} ${reason}. Подтвердите, пожалуйста.\nЕсли же в заявке допущена ошибка, то придётся заново формировать заявку.`})  
    }else{
        res.send({fulfillmentText:`Вы желаете подать заявку, что у Вас ${location} ${reason}.Подробности: ${description}. Подтвердите, пожалуйста.\nЕсли же в заявке допущена ошибка, то придётся заново формировать заявку.`})  
    };
}

module.exports = create_applications_Confirm;