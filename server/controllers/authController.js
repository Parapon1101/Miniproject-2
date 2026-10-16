const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. ระบบสมัครสมาชิก (Register)
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // ตรวจสอบว่ามีชื่อผู้ใช้นี้ในระบบหรือยัง
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว' });
    }

    // เข้ารหัสรหัสผ่าน (Hashing) เพื่อความปลอดภัย ไม่เก็บรหัสจริงลง DB
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // สร้างผู้ใช้ใหม่
    user = new User({
      username,
      password: hashedPassword
    });

    await user.save();
    res.status(201).json({ message: 'สมัครสมาชิกสำเร็จแล้ว' });
  } catch (error) {
    res.status(500).json({ message: 'เซิร์ฟเวอร์เกิดข้อผิดพลาด', error: error.message });
  }
};

// 2. ระบบล็อกอิน (Login)
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // ค้นหาผู้ใช้จาก username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    // ตรวจสอบรหัสผ่านว่าตรงกับที่เข้ารหัสไว้ไหม
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    // สร้าง Token (JWT) เพื่อให้หน้าเว็บใช้เป็นบัตรผ่านในการเข้าถึงข้อมูล
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' } // บัตรผ่านมีอายุ 1 วัน
    );

    res.status(200).json({
      message: 'เข้าสู่ระบบสำเร็จ',
      token,
      username: user.username
    });
  } catch (error) {
    res.status(500).json({ message: 'เซิร์ฟเวอร์เกิดข้อผิดพลาด', error: error.message });
  }
};
