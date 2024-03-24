// Импортируем необходимые зависимости
import express from 'express';
import dotenv from 'dotenv';

// Инициализируем переменные окружения
dotenv.config();

// Импортируем интенты как ES Modules
import application from '../intents/application.js';
import check_user from '../intents/check_user.js';
import create_applications from '../intents/create_applications.js';
import create_applications_Confirm from '../intents/create_applications_Confirm.js';
import check_user_yes_code from '../intents/check_user_yes_code.js';
import comeback_intent from '../intents/comeback_intent.js';
import delete_applications from '../intents/delete_applications.js';
import get_debt from '../intents/get_debt.js';
import get_applications from '../intents/get_applications.js';
import get_one_application from '../intents/get_one_application.js';
import get_specific_application from '../intents/get_specific_application.js';
import get_last_application from '../intents/get_specific_application.js';

// Объединяем интенты в объект
const intents = {
  application,
  check_user,
  create_applications,
  create_applications_Confirm,
  check_user_yes_code,
  comeback_intent,
  delete_applications_select_number_yes: delete_applications,
  get_debt,
  get_applications,
  get_one_application,
  get_specific_application,
  get_last_application: get_specific_application,
};

const dialogFlowrouter = express.Router();

dialogFlowrouter.post('/', async (req, res) => {
  const { queryResult, session } = req.body;
  const user_id = session.split('/').pop();
  const intentName = queryResult.intent.displayName;

  if (intentName.startsWith('create_applications')) {
    const createIntentName =
      intentName === 'create_applications_no' || intentName === 'create_applications_yes_desc'
        ? 'create_applications_Confirm'
        : 'create_applications';

    await intents[createIntentName](res, queryResult, user_id);
  } else if (intents[intentName]) {
    await intents[intentName](res, queryResult, user_id);
  }
});

// Экспортируем роутер
export default dialogFlowrouter;
