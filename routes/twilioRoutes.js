import express from 'express';
import twilio from 'twilio';

const router = express.Router();

// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SID;

const client = twilio(accountSid, authToken);

// Confirm verification code
router.post('/confirm-code', async (req, res) => {
  const { phoneNumber, code } = req.body;

  if (!phoneNumber || !code) {
    return res
      .status(400)
      .json({ success: false, message: 'Phone number and code are required' });
  }
  try {
    const verificationCheck = await client.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: phoneNumber, code: code });

    if (verificationCheck.status === 'approved') {
      res.json({ success: true, message: 'Verification successful' });
    } else {
      res.json({ success: false, message: 'Invalid verification code' });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: 'Error confirming verification code' });
  }
});

export default router;
