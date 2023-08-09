require("dotenv").config();
const {db} = require("../firebase");
const {format_number_app} = require("../intents/format_number");
const { STATUS } = require("../constants/constants");

const get_specific_application = async (res, queryResult, user_id) => {
    let number = queryResult.outputContexts[0].parameters["number"];
    const appRef = db.collection("applications").doc(user_id);
    const resultAll = await appRef.get();
    if(!resultAll.exists){
        return res.sendStatus(400);
    }

    if(Number.isInteger(number)){
        number = format_number_app(number);
    }else{
        const data = Object.keys(resultAll.data());
        if(number === "last"){
            number = format_number_app(data.length);
        }else if(number === "penultimate"){
            number = format_number_app(data.length-1);
        }
    }
    const appResult = resultAll.data()[`${number}`];
    const statusValue = STATUS.find(
        (status_id) => status_id.key === appResult.status
      ).value;
    res.send({fulfillmentText: `Статус заявки: ${statusValue}`});
}
module.exports = get_specific_application;