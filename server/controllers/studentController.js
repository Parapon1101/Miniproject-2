const Student = require('../models/Student');

// 1. เพิ่มข้อมูลประวัตินักศึกษา (Create)
exports.createProfile = async (req, res) => {
  try {
    const { studentId, fullName, faculty, dateOfBirth, province } = req.body;

    // เช็กว่ารหัสนักศึกษานี้เคยถูกลงทะเบียนไปหรือยัง
    const existingStudent = await Student.findOne({ studentId });
    if (existingStudent) {
      return res.status(400).json({ message: 'รหัสนักศึกษานี้มีอยู่ในระบบแล้ว' });
    }

    // สร้างข้อมูลโปรไฟล์ใหม่โดยผูกกับ userId ของคนที่ล็อกอินอยู่
    const newProfile = new Student({
      userId: req.user.userId,
      studentId,
      fullName,
      faculty,
      dateOfBirth,
      province
    });

    await newProfile.save();
    res.status(201).json({ message: 'บันทึกประวัตินักศึกษาสำเร็จแล้ว', data: newProfile });
  } catch (error) {
    res.status(500).json({ message: 'เซิร์ฟเวอร์เกิดข้อผิดพลาด', error: error.message });
  }
};

// 2. ดึงข้อมูลประวัตินักศึกษาของคนที่ล็อกอินอยู่ (Read)
exports.getProfile = async (req, res) => {
  try {
    // ค้นหาข้อมูลนักศึกษาที่ตรงกับ userId ของผู้ใช้ปัจจุบัน
    const profile = await Student.findOne({ userId: req.user.userId });
    
    if (!profile) {
      return res.status(404).json({ message: 'ยังไม่มีการเพิ่มข้อมูลประวัตินักศึกษา' });
    }
    
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'เซิร์ฟเวอร์เกิดข้อผิดพลาด', error: error.message });
  }
};

// 3. อัปเดต/แก้ไขข้อมูลประวัตินักศึกษา (Update)
exports.updateProfile = async (req, res) => {
  try {
    const { studentId, fullName, faculty, dateOfBirth, province } = req.body;

    // หาประวัตินักศึกษาของ user นี้แล้วอัปเดตข้อมูลใหม่เข้าไป
    const updatedProfile = await Student.findOneAndUpdate(
      { userId: req.user.userId },
      { studentId, fullName, faculty, dateOfBirth, province },
      { new: true, runValidators: true } // new: true หมายถึงให้ส่งข้อมูลตัวที่แก้ไขล่าสุดกลับมา
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลประวัติที่ต้องการแก้ไข' });
    }

    res.status(200).json({ message: 'แก้ไขข้อมูลสำเร็จแล้ว', data: updatedProfile });
  } catch (error) {
    res.status(500).json({ message: 'เซิร์ฟเวอร์เกิดข้อผิดพลาด', error: error.message });
  }
};

// 4. ลบข้อมูลประวัตินักศึกษา (Delete)
exports.deleteProfile = async (req, res) => {
  try {
    const deletedProfile = await Student.findOneAndDelete({ userId: req.user.userId });

    if (!deletedProfile) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลประวัติที่ต้องการลบ' });
    }

    res.status(200).json({ message: 'ลบข้อมูลประวัตินักศึกษาเรียบร้อยแล้ว' });
  } catch (error) {
    res.status(500).json({ message: 'เซิร์ฟเวอร์เกิดข้อผิดพลาด', error: error.message });
  }
};
