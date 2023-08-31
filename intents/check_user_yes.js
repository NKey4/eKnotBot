const { db } = require("../firebase");
const { format_number } = require("../intents/format_number");
const axios = require("axios");
require("dotenv").config();

const check_user_yes = async (res, queryResult, user_id) => {
    const { phoneNumber} = queryResult.outputContexts[1].parameters;
    const digitsOnlyPhoneNum = format_number(phoneNumber);

    const collectionRef = db.collection("users").doc(user_id);
    const updateData = {};
    updateData['phoneNumber'] = digitsOnlyPhoneNum;
    await collectionRef.update(updateData)
    .then(()=>{
        console.log("метод update (check_user_yes) выполнен")
    })
    .catch((error)=>{
        console.error('Ошибка в выполнении метода update (check_user_yes):', error);
    });
    try{
        const data = {
            phoneNumber: digitsOnlyPhoneNum
        };
        await axios.post(`${process.env.SEND_CODE_URL}`,data);
        res.send({fulfillmentText: "Введите код, который был сформирован в приложении E-knot (Енот)."})
    } catch (error){
        console.log("Ошибка сервера (check_user_yes)");
        return res.sendStatus(500);
    }
}

module.exports = check_user_yes;