// DOM
const clientForm = document.getElementById('clientForm');
const backLogin = document.getElementById('back-login');

const otpModal = document.getElementById('otpModal');
const otpMessage = document.getElementById('otpMessage');
const clientOtpInput = document.getElementById('clientOtpInput');
const clientOtpError = document.getElementById('clientOtpError');
const verifyClientOtp = document.getElementById('verifyClientOtp');
const resendOtp = document.getElementById('resendOtp');

let clientGeneratedOtp = "";
let lastPhone = "";

// Orqaga (agar kerak bo'lsa)
backLogin && backLogin.addEventListener('click', () => window.history.back());

// Yordamchi: 6 xonali OTP yaratish
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Modalni ochish
function openOtpModal(phone) {
  otpMessage.textContent = `Telefon raqamiga 6 xonali kod yuborildi: ${phone}`;
  clientOtpInput.value = "";
  clientOtpInput.classList.remove('error');
  clientOtpError.textContent = "";
  otpModal.setAttribute('aria-hidden', 'false');
  clientOtpInput.focus();
}

// Modalni yopish
function closeOtpModal() {
  otpModal.setAttribute('aria-hidden', 'true');
  clientOtpInput.value = "";
  clientOtpInput.classList.remove('error');
  clientOtpError.textContent = "";
}

// Form submit
clientForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const firstName = document.getElementById('cFirstName').value.trim();
  const lastName = document.getElementById('cLastName').value.trim();
  const phone = document.getElementById('cPhone').value.trim();
  const email = document.getElementById('cEmail').value.trim();

  // Basic validation
  if(!firstName || !lastName || !phone || !email) {
    alert("Iltimos barcha maydonlarni to'ldiring.");
    return;
  }

  // Simulyatsiya: serverga yuborilayotgan paytda OTP generatsiya qilamiz
  clientGeneratedOtp = generateOtp();
  lastPhone = phone;
  console.log("Mijoz OTP (simulyatsiya):", clientGeneratedOtp);

  // Modalni ochamiz
  openOtpModal(phone);
});

// Tasdiqlash tugmasi
verifyClientOtp.addEventListener('click', function() {
  const entered = clientOtpInput.value.trim();

  if(entered === clientGeneratedOtp) {
    // muvaffaqiyat
    alert("Tasdiqlash muvaffaqiyatli! Mijozning profiliga o‘tilmoqda...");
    closeOtpModal();
    clientForm.reset();
    // haqiqiy loyihada shu yerda serverga ro'yxatga olish so'rovi yuboriladi
    window.location.href = "client-dashboard.html"; // yoki kerakli sahifa
  } else {
    // xato: inputni qizil qilish va xabar ko'rsatish
    clientOtpInput.classList.add('error');
    clientOtpError.textContent = "Kod noto'g'ri. Iltimos qayta kiriting.";
  }
});

// Qayta yuborish (resend)
resendOtp.addEventListener('click', function() {
  if(!lastPhone) return;
  clientGeneratedOtp = generateOtp();
  console.log("Mijoz OTP qayta (simulyatsiya):", clientGeneratedOtp);
  clientOtpError.textContent = "Kod qayta yuborildi.";
  clientOtpInput.classList.remove('error');
  clientOtpInput.value = "";
  clientOtpInput.focus();
});

// Modal oynani tashqaridan bosilganda yopish
window.addEventListener('click', function(e) {
  if(e.target === otpModal) {
    closeOtpModal();
  }
});
