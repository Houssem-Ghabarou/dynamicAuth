const LOGIIN_METHOD = process.env.LOGIN_METHOD;
import { OTP, STANDARD } from './login-flows/index.js';
const onConnect = (req, res, next) => {
  let response;

  switch (LOGIIN_METHOD) {
    case 'OTP':
      response = OTP;
      break;

    case 'STANDARD':
      response = STANDARD;
      break;
    default:
      return res.status(500).json({ message: 'Invalid login method' });
  }

  res.json(response);
};

export default onConnect;
