import { getAuthFlow } from './login-flows/index.js';

const LOGIN_METHOD = process.env.LOGIN_METHOD;

const onConnect = (req, res, next) => {
  console.log(req?.body);
  const { action, data } = req.body;
  const authFlow = getAuthFlow(LOGIN_METHOD);
  const response = authFlow.handleAction(action, data);
  res.json(response);
};

export default onConnect;
