import express from 'express';
import onConnect from '../controllers/LoginV2/onConnect.js';
const router = express.Router();

router.post('/', onConnect);
router.get('/', onConnect);
export default router;
