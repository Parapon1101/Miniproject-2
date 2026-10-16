const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const auth = require('../middleware/authMiddleware');

router.post('/profile', auth, studentController.createProfile);
router.get('/profile', auth, studentController.getProfile);
router.put('/profile', auth, studentController.updateProfile);
router.delete('/profile', auth, studentController.deleteProfile);

// 🔑 ต้องเป็น module.exports (มี s ด้านหลัง) และส่ง router ออกไปเช่นกันครับ
module.exports = router;
