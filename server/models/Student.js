const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // 🔑 เชื่อมโยงกับ Model User
    required: true
  },
  studentId: {
    type: String,
    required: [true, 'กรุณากรอกรหัสนักศึกษา'],
    unique: true,
    trim: true
  },
  fullName: {
    type: String,
    required: [true, 'กรุณากรอกชื่อ-นามสกุล'],
    trim: true
  },
  faculty: {
    type: String,
    required: [true, 'กรุณากรอกคณะที่เรียน'],
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'กรุณากรอกวันเดือนปีเกิด']
  },
  province: {
    type: String,
    required: [true, 'กรุณากรอกจังหวัดที่มา'],
    trim: true
  }
}, {
  timestamps: true // สร้างฟิลด์ createdAt และ updatedAt ให้เราอัตโนมัติ
});

module.exports = mongoose.model('Student', StudentSchema);
