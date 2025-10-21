// DOM elements
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegister = document.getElementById('show-register');
const backLogin = document.getElementById('back-login');

const loginBtn = document.getElementById('login-btn');
const clientBtn = document.getElementById('client-btn');
const barberBtn = document.getElementById('barber-btn');

// Show register form
showRegister.addEventListener('click', () => {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
});

// Back to login form
backLogin.addEventListener('click', () => {
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
});

// Login button click
loginBtn.addEventListener('click', () => {
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;

    if(phone && password){
        alert(`Kirish muvaffaqiyatli!\nTelefon: ${phone}`);
        // Bu yerda serverga so'rov yuborish mumkin
    } else {
        alert('Iltimos, telefon raqami va parolni kiriting.');
    }
});

// Register buttons
clientBtn.addEventListener('click', () => {
   window.location.href = "customer-register.html";
   
});

barberBtn.addEventListener('click', () => { 
    // alert o‘rniga sahifaga yo‘naltirish
    window.location.href = "barber-register.html";
});

