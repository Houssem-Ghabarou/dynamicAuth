import express from 'express';
import onConnect from '../controllers/LoginV2/onConnect.js';
const router = express.Router();

router.post('/', onConnect);

export default router;
