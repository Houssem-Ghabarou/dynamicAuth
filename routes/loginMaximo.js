import express from 'express';
import axios from 'axios';
import twilio from 'twilio';

const router = express.Router();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SID;

const client = twilio(accountSid, authToken);

router.post('/', async (req, res) => {
  try {
    // const { username, password } = req.body;
    // if (!username || !password) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Username and password are required',
    //   });
    // }
    const url = `http://142.112.52.234:30501/maximo/api/script/API__IMXAPPS__auth?imxauth=bWVkYW1pbjppbWF4ZWFt&samlCookies=false&maxappsAdmin=MAXAPPS_ADMIN&login=medamin&userid=medamin&_lid=medamin&timeout=false&userIdentifier=%7B%7D&action=CONNECT&laborattributes=&laborTrackingAttributes=&apikey=cq8jr6bicb84511u17i046bq1tdn02urei3hujhb`;

    const response = await axios.get(url);

    if (response?.data) {
      const phoneNumber = response?.data?.result?.userProfile?.PRIMARYPHONE;
      if (!phoneNumber) {
        //user has to change his profile and enter his phone number
        return res.json({
          success: false,
          message:
            'You need to update your profile and enter your phone number',
        });
      }
      const verification = await client.verify.v2
        .services(verifySid)
        .verifications.create({ to: phoneNumber, channel: 'sms' });
      return res.json({
        success: true,
        phoneNumber,
        message: 'Verification code sent',
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Error connecting to Maximo',
    });
  }
});

export default router;
