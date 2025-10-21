const barberForm = document.getElementById('barberForm');
const otpModal = document.getElementById('otpModal');
const otpMessage = document.getElementById('otpMessage');
const otpInput = document.getElementById('otpInput');
const verifyOtp = document.getElementById('verifyOtp');
const otpError = document.getElementById('otpError');
const backLogin = document.getElementById('back-login');

let generatedOtp = "";

// Form submit
barberForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if(password !== confirmPassword){
        alert("Parol va tasdiqlash paroli mos kelmadi!");
        return;
    }

    // Random 6 xonali OTP
    generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Tasdiqlash kodi (simulyatsiya):", generatedOtp);

    const phone = document.getElementById('phone').value;
    otpMessage.innerText = `Telefon raqamiga 6 xonali kod yuborildi: ${phone}`;

    otpInput.value = "";
    otpInput.classList.remove("error");
    otpError.style.display = "none";

    otpModal.style.display = "block";
});

// OTP tasdiqlash
verifyOtp.addEventListener('click', () => {
    const userOtp = otpInput.value.trim();

    if(userOtp === generatedOtp){
        alert("Tasdiqlash muvaffaqiyatli! Sartarosh sahifasiga yo‘naltirilmoqda...");
        otpModal.style.display = "none";
        barberForm.reset();
        window.location.href = "barber-dashboard.html"; // sartaroshning asosiy sahifasi
    } else {
        otpInput.classList.add("error");
        otpError.style.display = "block";
    }
});

// Modal oynani tashqaridan bosilganda yopish (optional)
window.addEventListener('click', function(e){
    if(e.target === otpModal){
        otpModal.style.display = "none";
        otpInput.value = "";
        otpInput.classList.remove("error");
        otpError.style.display = "none";
    }
});

// Back to login form
backLogin.addEventListener('click', () => {
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
});