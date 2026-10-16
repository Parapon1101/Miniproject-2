const API_URL = 'http://localhost:5000/api/student/profile';
const token = localStorage.getItem('studentToken');
const username = localStorage.getItem('username');

// ตรวจสอบตัวตั๋วผ่านทาง (Token) ถ้าไม่มีให้เด้งกลับไปหน้าล็อกอิน
if (!token) {
  window.location.href = 'index.html';
}

document.getElementById('user-display').textContent = username;
let isEditMode = false; // ตัวแปรเช็กสถานะว่าเป็นการเพิ่มใหม่หรือแก้ไขตัวเก่า

// 1. ดึงข้อมูลโปรไฟล์จากเซิร์ฟเวอร์มาแสดง (Read)
const fetchProfile = async () => {
  try {
    const res = await fetch(API_URL, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (res.ok) {
      const data = await res.json();
      displayProfile(data);
    } else {
      // หากไม่มีข้อมูลประวัติในระบบ ให้เปิดฟอร์มไว้รอรับการกรอกข้อมูลใหม่
      document.getElementById('student-form').style.display = 'block';
      document.getElementById('profile-display').style.display = 'none';
    }
  } catch (err) {
    alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
  }
};

// ฟังก์ชันนำข้อมูลไปหยอดใส่ในตัวแสดงผลหน้า HTML
const displayProfile = (data) => {
  document.getElementById('view-studentId').textContent = data.studentId;
  document.getElementById('view-fullName').textContent = data.fullName;
  document.getElementById('view-faculty').textContent = data.faculty;
  
  // จัดรูปแบบการแสดงผลวันที่ให้สวยงามแบบสากล
  const dob = new Date(data.dateOfBirth).toISOString().split('T')[0];
  document.getElementById('view-dob').textContent = dob;
  document.getElementById('view-province').textContent = data.province;

  // สลับการแสดงผล: ซ่อนฟอร์มกรอกข้อมูล และแสดงกล่องประวัติ
  document.getElementById('student-form').style.display = 'none';
  document.getElementById('profile-display').style.display = 'block';
};

// 2. จัดการส่งข้อมูลฟอร์มตอนกดบันทึก (Create / Update)
document.getElementById('student-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const studentData = {
    studentId: document.getElementById('studentId').value,
    fullName: document.getElementById('fullName').value,
    faculty: document.getElementById('faculty').value,
    dateOfBirth: document.getElementById('dateOfBirth').value,
    province: document.getElementById('province').value
  };

  // เช็กว่าต้องยิง API ไปที่ Create หรือ Update
  const method = isEditMode ? 'PUT' : 'POST';

  try {
    const res = await fetch(API_URL, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(studentData)
    });
    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      isEditMode = false;
      document.getElementById('submit-btn').textContent = '💾 บันทึกข้อมูลประวัติ';
      fetchProfile(); // โหลดข้อมูลมาโชว์ใหม่หลังจากบันทึกเสร็จ
    } else {
      alert(data.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  } catch (err) {
    alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์หลังบ้านได้');
  }
});

// 3. ปุ่มเข้าสู่โหมดแก้ไขข้อมูล (Prepare Update)
document.getElementById('edit-btn').addEventListener('click', () => {
  isEditMode = true;
  document.getElementById('submit-btn').textContent = '🔄 อัปเดตข้อมูลประวัติ';
  
  // นำค่าเดิมจากกล่องแสดงผลมาหยอดใส่ฟอร์มกรอกเงินเพื่อเตรียมแก้
  document.getElementById('studentId').value = document.getElementById('view-studentId').textContent;
  document.getElementById('fullName').value = document.getElementById('view-fullName').textContent;
  document.getElementById('faculty').value = document.getElementById('view-faculty').textContent;
  document.getElementById('dateOfBirth').value = document.getElementById('view-dob').textContent;
  document.getElementById('province').value = document.getElementById('view-province').textContent;

  // สลับหน้าจอเปิดฟอร์มขึ้นมาแก้ไขอีกครั้ง
  document.getElementById('student-form').style.display = 'block';
  document.getElementById('profile-display').style.display = 'none';
});

// 4. ปุ่มลบข้อมูลประวัติ (Delete)
document.getElementById('delete-btn').addEventListener('click', async () => {
  if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลประวัตินักศึกษานี้ออกจากระบบ?')) {
    try {
      const res = await fetch(API_URL, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        document.getElementById('student-form').reset();
        fetchProfile(); // โหลดสถานะหน้าจอใหม่
      } else {
        alert(data.message || 'เกิดข้อผิดพลาดในการลบข้อมูล');
      }
    } catch (err) {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์หลังบ้านได้');
    }
  }
});

// 5. ปุ่มออกจากระบบ (Logout)
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.clear(); // ล้างตั๋วผ่านทางและประวัติผู้ใช้ออกจาก Browser
  window.location.href = 'index.html';
});

// รันคำสั่งดึงข้อมูลอัตโนมัติทุกครั้งที่ผู้ใช้เปิดหน้านี้ขึ้นมา
fetchProfile();
