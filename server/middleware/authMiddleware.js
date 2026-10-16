const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // ดึง Token จาก Header ของคำขอที่ส่งมาจากหน้าเว็บ
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'ปฏิเสธการเข้าถึง: กรุณาเข้าสู่ระบบก่อน' });
  }

  try {
    // ตรวจสอบความถูกต้องของ Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // แนบข้อมูลผู้ใช้เข้าไปในตัวแปร req เพื่อให้ฟังก์ชันถัดไปเอาไปใช้งานต่อได้
    req.user = decoded;
    next(); // ผ่านทางได้ ไปทำงานในขั้นตอนถัดไป
  } catch (error) {
    res.status(401).json({ message: 'Token ไม่ถูกต้องหรือหมดอายุ' });
  }
};
