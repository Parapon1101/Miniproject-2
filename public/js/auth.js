const API_URL = 'http://localhost:5000/api/auth';

// ดึงองค์ประกอบต่างๆ จากหน้า HTML
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const goToRegister = document.getElementById('go-to-register');
const goToLogin = document.getElementById('go-to-login');

// 1. สลับหน้าจอระหวัง Login และ Register
goToRegister.addEventListener('click', (e) => {
  e.preventDefault();
  loginSection.style.display = 'none';
  registerSection.style.display = 'block';
});

goToLogin.addEventListener('click', (e) => {
  e.preventDefault();
  registerSection.style.display = 'none';
  loginSection.style.display = 'block';
});

// 2. ระบบจัดการการสมัครสมาชิก (Register)
document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;

  try {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (res.ok) {
      alert('🎉 สมัครสมาชิกสำเร็จ! ระบบจะพาท่านกลับไปหน้าล็อกอิน');
      document.getElementById('register-form').reset();
      goToLogin.click(); // คลิกสลับไปหน้า login ให้ผู้ใช้อัตโนมัติ
    } else {
      alert(data.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
    }
  } catch (err) {
    alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์หลังบ้านได้');
  }
});

// 3. ระบบจัดการการเข้าสู่ระบบ (Login)
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (res.ok) {
      // 🔑 เก็บตั๋วผ่านทาง Token และชื่อผู้ใช้ไว้ใน Browser ล็อกเอาต์หรือปิดแอปก็ยังอยู่
      localStorage.setItem('studentToken', data.token);
      localStorage.setItem('username', data.username);
      
      // ส่งผู้ใช้ไปยังหน้า Dashboard จัดการข้อมูลนักศึกษาต่อไป
      window.location.href = 'dashboard.html';
    } else {
      alert(data.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  } catch (err) {
    alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์หลังบ้านได้');
  }
});
