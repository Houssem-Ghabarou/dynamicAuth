import express from 'express';
import onConnect from '../controllers/LoginV2/onConnect.js';
const router = express.Router();

router.get('/loginv2', onConnect);

export default router;
