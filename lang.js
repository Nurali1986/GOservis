const langData = {
  uz: {
    welcome_title: "Xush kelibsiz!",
    welcome_text: "Barcha xizmatlar bir joyda.",
    features_title: "Yuzlab vazifalar. Bitta ekotizim.",
    services_title: "Har qanday xizmat ko'rsatish biznesi uchun javob beradi",
    features: "Imkoniyatlar",
    services: "Xizmatlar",
    login: "Kirish",
    register: "Ro'yxatdan o'tish",

    // Xizmat turlari
    soch: "Sartarashxonalar",
    gozal: "Go'zallik salonlari",
    tibbiy: "Tibbiy xizmatlar",
    talim: "Ta'lim",
    tex_xizmat: "Avto xizmatlar",
    sport: "Sport",
    mash_xiz: "Maishiy xizmatlar",
    oshxona: "Oshxona va kafe",

    // Imkoniyatlar
    onlayn: "Onlayn ro'yxatdan o'tish",
    uvedom: "Bildirishnomalar",
    moliya: "Moliya hisobi",
    stat: "Statistikalar",
    klient: "Mijoz bazasi",
    loyal: "Sodiqlik dasturlari",
    brend: "Brendllar",
    franshiza: "Franshiza",
    mobil: "Mobil ilova",
    integr: "Integratsiya",

 salons: "Sartarashxonalar",
    booking: "Bron qilish",
    book_now: "Bron qilish",
    book_appointment: "Uchrashuv bron qilish",
    select_service: "Xizmat turi:",
    select_date: "Sana:",
    select_time: "Vaqt:",
    confirm_booking: "Bron qilishni tasdiqlash",
    popular_salons: "Mashhur sartarashxonalar",
    hero_title: "Sartaroshlik xizmatlari",
    hero_text: "Eng yaxshi sartaroshlar bilan uchrashing"



  },

  ru: {
    welcome_title: "Добро пожаловать!",
    welcome_text: "Все услуги в одном месте.",
    features_title: "Сотни задач. Одна экосистема.",
    services_title: "Подходит для любого сервисного бизнеса",
    features: "Возможности",
    services: "Услуги",
    login: "Вход",
    register: "Регистрация",

    // Типы сервисов
    soch: "Парикмахерские",
    gozal: "Салоны красоты",
    tibbiy: "Медицинские услуги",
    talim: "Образование",
    tex_xizmat: "Авто сервис",
    sport: "Спорт",
    mash_xiz: "Бытовые услуги",
    oshxona: "Рестораны и кафе",

    // Возможности
    onlayn: "Онлайн регистрация",
    uvedom: "Уведомления",
    moliya: "Финансовый учет",
    stat: "Статистика",
    klient: "База клиентов",
    loyal: "Программы лояльности",
    brend: "Бренды",
    franshiza: "Франшиза",
    mobil: "Мобильное приложение",
    integr: "Интеграции",

salons: "Парикмахерские",
    booking: "Бронирование",
    book_now: "Забронировать",
    book_appointment: "Запись на прием",
    select_service: "Тип услуги:",
    select_date: "Дата:",
    select_time: "Время:",
    confirm_booking: "Подтвердить бронирование",
    popular_salons: "Популярные парикмахерские",
    hero_title: "Парикмахерские услуги",
    hero_text: "Встречайтесь с лучшими парикмахерами"

  },
};

// Til almashtirish funksiyasi
function changeLang(lang) {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (langData[lang][key]) {
      el.textContent = langData[lang][key];
    }
  });
}

// Misol uchun tugma orqali chaqirish:
// changeLang('uz') yoki changeLang('ru');


let currentLang = "uz";
const langToggle = document.getElementById("langToggle");

// Menu toggle funksiyasi
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  // Hamburger animatsiyasi
  menuBtn.classList.toggle("active");
});

// Tilni o'zgartirish
langToggle.addEventListener("click", () => {
  currentLang = currentLang === "uz" ? "ru" : "uz";
  langToggle.textContent = currentLang === "uz" ? "RU" : "UZ";
  translatePage();
});

function translatePage() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (langData[currentLang][key]) {
      el.textContent = langData[currentLang][key];
    }
  });
}

// Sahifa yuklanganda tarjima qilish
document.addEventListener('DOMContentLoaded', function() {
  translatePage();
  
  // Mobil menyuni yopish
  document.addEventListener('click', function(e) {
    if (!e.target.closest('nav') && !e.target.closest('.menu-icon') && navMenu.classList.contains('active')) {
      navMenu.classList.remove("active");
      menuBtn.classList.remove('active');
    }
  });
});
