const { db } = require("../firebase");
const { format_number } = require("../intents/format_number");

const check_user_yes = async (res, queryResult, user_id) => {
    const { phoneNumber} = queryResult.outputContexts[1].parameters;

    const digitsOnlyPhoneNum = format_number(phoneNumber);

    const collectionRef = db.collection("users").doc(user_id);
    const updateData = {};
    updateData['phoneNumber'] = digitsOnlyPhoneNum;
    await collectionRef.update(updateData);
    res.send({fulfillmentText: "Введите код, который был сформирован в приложении E-knot (Енот)."})
}

module.exports = check_user_yes;