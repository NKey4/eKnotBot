require("dotenv").config();
const {db} = require("../firebase");

const delete_applications = async (res, queryResult, user_id) => {
    const appRef = db.collection("applications").doc(user_id);
    const result = await appRef.get();
    console.log(queryResult.outputContexts);
    const numberApp = queryResult.outputContexts[0].parameters["number"];
    console.log(numberApp);
    if(!result.exists){
        return res.sendStatus(400);
    }
    let digitsOnly = numberApp.replace(/\D/g, "");
    if (digitsOnly.length === 4) {
    digitsOnly = digitsOnly.replace(
      /(\d{2})(\d{2})/,
      "$1-$2"
    );
    } else {
        return null;
    }
    console.log(digitsOnly);
    const updateData = {};
    updateData[`${digitsOnly}.status`] = "6";
    appRef.update(updateData)
    .then(() => {
        res.send({fulfillmentText:`Заявка под №${numberApp} отменена`});
      })
      .catch((error) => {
        console.error('Ошибка при удалении поля из документа:', error);
        res.send({fulfillmentText: "Приношу извинения. Ошибка сервера."})
      });
};
module.exports = delete_applications;