const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

// 🔑 ต้องเป็น module.exports (มี s ด้านหลัง) และส่ง router ออกไปแบบนี้ครับ
module.exports = router;
