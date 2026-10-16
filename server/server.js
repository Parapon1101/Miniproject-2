const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// 1. โหลดค่าคอนฟิกจากไฟล์ .env
dotenv.config();

// 2. เปิดใช้งาน Express Server
const app = express();

// 3. เชื่อมต่อฐานข้อมูล MongoDB
connectDB();

// 4. เปิดใช้งาน Middleware ต่างๆ
app.use(cors()); // อนุญาตให้ Frontend ส่งข้อมูลข้ามมาได้
app.use(express.json()); // อนุญาตให้เซิร์ฟเวอร์อ่านข้อมูลรูปแบบ JSON ได้

// 5. เชื่อมต่อป้ายบอกทาง (API Routes) เข้ากับระบบ
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));

// 6. ตั้งค่าให้ Server รอรับคำขอที่ Port ที่กำหนด
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running smoothly on port ${PORT}`);
});
