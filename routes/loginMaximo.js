import express from 'express';
import axios from 'axios';
import twilio from 'twilio';
import axiosInstance from '../axios/index.js';
const router = express.Router();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SID;

const authApi = process.env.AUTH_API;
const client = twilio(accountSid, authToken);

router.post('/', async (req, res) => {
  try {
    console.log(req?.body, 'req.body');

    //attach the reqbody deviceUniqueId and login =to req?.body?.userName

    const deviceUniqueId = '8457475';
    const login = req?.body?.userName;

    const payload = {
      deviceUniqueId,
      login,
      ...req?.body,
    };
    console.log(payload, 'payload');

    // const { username, password } = req.body;
    // if (!username || !password) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Username and password are required',
    //   });
    // }
    // const url = `http://142.112.52.234:30501/maximo/api/script/API__IMXAPPS__auth?imxauth=bWVkYW1pbjppbWF4ZWFt&samlCookies=false&maxappsAdmin=MAXAPPS_ADMIN&login=medamin&userid=medamin&_lid=medamin&timeout=false&userIdentifier=%7B%7D&action=CONNECT&laborattributes=&laborTrackingAttributes=&apikey=cq8jr6bicb84511u17i046bq1tdn02urei3hujhb`;

    //post request with authApi and req.body
    const response = await axiosInstance.post(authApi, payload);

    if (response?.data) {
      if (response?.data?.content?.status === 'failure') {
        //also sned it as errror message
        return res.json({
          status: 'error',
          success: false,
          message: response?.data?.content?.message,
        });
      }

      if (response?.data?.success === false) {
        return res.json({
          status: 'error',
          success: false,
          message: response?.data?.message,
        });
      }

      const phoneNumber =
        response?.data?.content?.authentication?.userProfile?.PRIMARYPHONE;

      if (!phoneNumber) {
        //user has to change his profile and enter his phone number
        return res.json({
          status: 'error',

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
    console.error(err?.response?.data);

    if (err?.response?.data) {
      return res.status(err?.response?.status).json({
        success: false,
        status: 'error',

        message: err?.response?.data?.message,
      });
    }

    let errorMessage = 'Error connecting to Maximo';
    let statusCode = 500;

    if (err.code === 60203) {
      errorMessage = 'Max send attempts reached. Please try again later.';
      statusCode = 429;
    } else if (err.message) {
      errorMessage = err.message;
    }

    return res.status(statusCode).json({
      success: false,
      status: 'error',

      message: errorMessage,
      errorCode: err.code || 'UNKNOWN_ERROR',
    });
  }
});

export default router;
