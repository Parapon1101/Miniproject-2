const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`🔌 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// 🔑 เช็กบรรทัดนี้ให้ดี: ต้องพิมพ์ module.exports (มี s ด้านหลัง) ให้ถูกต้องแบบนี้ครับ
module.exports = connectDB;
