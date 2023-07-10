require("dotenv").config();
const { db } = require("../firebase");

const application = async(res, queryResult, user_id) =>
{
    const adRef = db.collection("users").doc(user_id);
    const result = await adRef.get();

    if(!result.exists){
        return res.sendStatus(400);
    }


    const userAddress = result.data().address;
    if(Array.isArray(userAddress) && userAddress.length > 1){
        let message = "Выберите адрес:\n";
        for (let i = 0; i < userAddress.length; i++) {
            if((i+1) === userAddress.length){
                message += `${i + 1}. ${userAddress[i]}.`;
            } else{
                message += `${i + 1}. ${userAddress[i]};\n`;
            }
            
        }
        res.send({fulfillmentText: message})
    }
    else{
        res.send({ fulfillmentText: "Пожалуйста, опишите причину подачи заявки" });
    }
}

module.exports = application;