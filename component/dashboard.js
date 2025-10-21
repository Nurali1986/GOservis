// Simple dashboard logic with localStorage persistence

// Tabs
const navBtns = document.querySelectorAll('.nav-btn');
const tabs = document.querySelectorAll('.tab');
navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    navBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    tabs.forEach(t => t.id === tab ? t.classList.add('active') : t.classList.remove('active'));
  });
});

// Helper storage
const DB = {
  load(key, def){ try { return JSON.parse(localStorage.getItem(key)) || def; } catch(e){ return def; } },
  save(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
};

// ---------- PROFILE ----------
const pName = document.getElementById('pName');
const pAddress = document.getElementById('pAddress');
const pPhone = document.getElementById('pPhone');
const pContacts = document.getElementById('pContacts');
const saveProfileBtn = document.getElementById('saveProfile');
const avatarInput = document.getElementById('avatarInput');
const avatarPreview = document.getElementById('avatarPreview');
const sidebarName = document.getElementById('sidebarName');

function loadProfile(){
  const profile = DB.load('barber_profile', {name:'Sartarosh', address:'', phone:'', contacts:'', avatar:''});
  pName.value = profile.name || '';
  pAddress.value = profile.address || '';
  pPhone.value = profile.phone || '';
  pContacts.value = profile.contacts || '';
  sidebarName.textContent = profile.name || '—';
  if(profile.avatar) {
    avatarPreview.style.backgroundImage = `url(${profile.avatar})`;
    avatarPreview.textContent = '';
    avatarPreview.style.backgroundSize = 'cover';
    avatarPreview.style.backgroundPosition = 'center';
  } else {
    avatarPreview.style.backgroundImage = '';
    avatarPreview.textContent = (profile.name || 'S').charAt(0).toUpperCase();
  }
}
saveProfileBtn.addEventListener('click', () => {
  const profile = { name: pName.value.trim(), address: pAddress.value.trim(), phone: pPhone.value.trim(), contacts: pContacts.value.trim(), avatar: avatarPreview.style.backgroundImage ? avatarPreview.style.backgroundImage.slice(5,-2) : '' };
  DB.save('barber_profile', profile);
  alert('Profil saqlandi');
  loadProfile();
});
avatarInput && avatarInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = function(ev){
    avatarPreview.style.backgroundImage = `url(${ev.target.result})`;
    avatarPreview.textContent = '';
  };
  reader.readAsDataURL(file);
});

// ---------- SERVICES ----------
const serviceForm = document.getElementById('serviceForm');
const serviceName = document.getElementById('serviceName');
const servicePrice = document.getElementById('servicePrice');
const servicesList = document.getElementById('servicesList');

let services = DB.load('barber_services', [
  {id:1, name:'Soch olish', price:250000},
  {id:2, name:'Soqol olish', price:100000},
  {id:3, name:'Kompleks', price:350000},
]);

function renderServices(){
  servicesList.innerHTML = '';
  services.forEach(s=>{
    const li = document.createElement('li');
    li.innerHTML = `<div><strong>${s.name}</strong> — ${s.price}</div>
      <div>
        <button class="small-btn" data-id="${s.id}" data-action="edit">Tahrirlash</button>
        <button class="small-btn" data-id="${s.id}" data-action="del">O'chirish</button>
      </div>`;
    servicesList.appendChild(li);
  });
  // attach handlers
  servicesList.querySelectorAll('button').forEach(btn=>{
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      const action = btn.dataset.action;
      if(action==='del'){
        services = services.filter(x=>x.id!==id);
        DB.save('barber_services', services);
        renderServices(); populateBookingSelects();
      } else {
        const s = services.find(x=>x.id===id);
        const newName = prompt('Xizmat nomi:', s.name);
        const newPrice = prompt('Narx:', s.price);
        if(newName !== null && newPrice !== null){
          s.name = newName; s.price = Number(newPrice);
          DB.save('barber_services', services);
          renderServices(); populateBookingSelects();
        }
      }
    });
  });
}
serviceForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = serviceName.value.trim(); const price = Number(servicePrice.value) || 0;
  if(!name) return alert('Xizmat nomini kiriting');
  const id = Date.now();
  services.push({id, name, price});
  DB.save('barber_services', services);
  serviceName.value = ''; servicePrice.value = '';
  renderServices(); populateBookingSelects();
});
renderServices();

// ---------- CLIENTS ----------
const clientForm = document.getElementById('clientForm');
const clientName = document.getElementById('clientName');
const clientPhone = document.getElementById('clientPhone');
const clientsList = document.getElementById('clientsList');

let clients = DB.load('barber_clients', [
  {id:1, name:'Ali J.', phone:'+998901234567'},
]);

function renderClients(){
  clientsList.innerHTML = '';
  clients.forEach(c=>{
    const li = document.createElement('li');
    li.innerHTML = `<div>${c.name} <small>${c.phone}</small></div>
      <div>
        <button class="small-btn" data-id="${c.id}" data-action="book">Bron</button>
        <button class="small-btn" data-id="${c.id}" data-action="del">O'chirish</button>
      </div>`;
    clientsList.appendChild(li);
  });
  // handlers
  clientsList.querySelectorAll('button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = Number(btn.dataset.id); const action = btn.dataset.action;
      const c = clients.find(x=>x.id===id);
      if(action==='del'){
        if(confirm('Mijozni o\'chirasizmi?')) {
          clients = clients.filter(x=>x.id!==id);
          DB.save('barber_clients', clients);
          renderClients(); populateBookingSelects();
        }
      } else {
        // quick fill booking form
        document.getElementById('bookingClient').value = id;
        document.querySelector(`[data-tab="bookings"]`).click();
      }
    });
  });
}
clientForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = clientName.value.trim(), phone = clientPhone.value.trim();
  if(!name || !phone) return alert('Iltimos barcha maydonlarni to\'ldiring');
  const id = Date.now();
  clients.push({id, name, phone});
  DB.save('barber_clients', clients);
  clientName.value = ''; clientPhone.value = '';
  renderClients(); populateBookingSelects();
});
renderClients();

// ---------- BOOKINGS ----------
const bookingForm = document.getElementById('bookingForm');
const bookingClient = document.getElementById('bookingClient');
const bookingService = document.getElementById('bookingService');
const bookingDate = document.getElementById('bookingDate');
const bookingTime = document.getElementById('bookingTime');
const todayBookings = document.getElementById('todayBookings');
const upcomingBookings = document.getElementById('upcomingBookings');

let bookings = DB.load('barber_bookings', []);

function populateBookingSelects(){
  bookingClient.innerHTML = '';
  clients.forEach(c => bookingClient.appendChild(new Option(c.name + ' — ' + c.phone, c.id)));
  bookingService.innerHTML = '';
  services.forEach(s => bookingService.appendChild(new Option(`${s.name} — ${s.price}`, s.id)));
}
populateBookingSelects();

function renderBookings(){
  const today = new Date().toISOString().slice(0,10);
  todayBookings.innerHTML = ''; upcomingBookings.innerHTML = '';

  bookings.sort((a,b)=> (a.date+a.time) > (b.date+b.time) ? 1:-1);

  bookings.forEach(b=>{
    const client = clients.find(c=>c.id===b.clientId) || {name:'-'}; 
    const service = services.find(s=>s.id===b.serviceId) || {name:'-', price:0};
    const li = document.createElement('li');
    li.innerHTML = `<div><strong>${client.name}</strong> — ${service.name} <div style="font-size:13px">${b.date} ${b.time}</div></div>
      <div>
        <button class="small-btn" data-id="${b.id}" data-action="done">Yakunlash</button>
        <button class="small-btn" data-id="${b.id}" data-action="del">Bekor</button>
      </div>`;
    if(b.date === today) todayBookings.appendChild(li);
    else upcomingBookings.appendChild(li);
  });

  // handlers
  [todayBookings, upcomingBookings].forEach(ul=>{
    ul.querySelectorAll('button').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = Number(btn.dataset.id); const action = btn.dataset.action;
        if(action==='del'){ if(confirm('Bron bekor qilinsinmi?')) { bookings = bookings.filter(x=>x.id!==id); DB.save('barber_bookings', bookings); renderBookings(); renderEarnings(); } }
        else { // done: mark completed and add to earnings record
          const b = bookings.find(x=>x.id===id);
          b.completed = true; DB.save('barber_bookings', bookings); renderBookings(); renderEarnings();
        }
      });
    });
  });
}
bookingForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const clientId = Number(bookingClient.value);
  const serviceId = Number(bookingService.value);
  const date = bookingDate.value; const time = bookingTime.value;
  if(!clientId || !serviceId || !date || !time) return alert('Iltimos to\'ldiring');
  const id = Date.now();
  bookings.push({id, clientId, serviceId, date, time, completed:false});
  DB.save('barber_bookings', bookings);
  renderBookings(); renderEarnings();
  bookingDate.value=''; bookingTime.value='';
});
renderBookings();

// ---------- RATINGS ----------
const ratingForm = document.getElementById('ratingForm');
const ratingClientName = document.getElementById('ratingClientName');
const ratingStars = document.getElementById('ratingStars');
const ratingComment = document.getElementById('ratingComment');
const ratingsList = document.getElementById('ratingsList');
const ratingsSummary = document.getElementById('ratingsSummary');

let ratings = DB.load('barber_ratings', []);
function renderRatings(){
  ratingsList.innerHTML = '';
  if(ratings.length===0) ratingsList.innerHTML = '<li>Hozircha fikr yo‘q</li>';
  ratings.forEach(r=>{
    const li = document.createElement('li');
    li.innerHTML = `<div><strong>${r.name || 'Anonim'}</strong> — ${'⭐'.repeat(r.stars)}<div style="font-size:13px">${r.comment||''}</div></div>
      <div><button class="small-btn" data-id="${r.id}" data-action="del">O'chirish</button></div>`;
    ratingsList.appendChild(li);
  });
  // summary
  const avg = ratings.length ? (ratings.reduce((s,n)=>s+n.stars,0)/ratings.length).toFixed(2) : 0;
  ratingsSummary.innerHTML = `O'rtacha reyting: <strong>${avg}</strong> (${ratings.length} ta fikr)`;
  // delete handlers
  ratingsList.querySelectorAll('button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = Number(btn.dataset.id);
      ratings = ratings.filter(r=>r.id!==id); DB.save('barber_ratings', ratings); renderRatings();
    });
  });
}
ratingForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = ratingClientName.value.trim(); const stars = Number(ratingStars.value); const comment = ratingComment.value.trim();
  const id = Date.now(); ratings.push({id, name, stars, comment}); DB.save('barber_ratings', ratings);
  ratingClientName.value=''; ratingComment.value=''; ratingStars.value='5';
  renderRatings();
});
renderRatings();

// ---------- GALLERY ----------
const galleryInput = document.getElementById('galleryInput');
const galleryGrid = document.getElementById('galleryGrid');
let gallery = DB.load('barber_gallery', []);
function renderGallery(){
  galleryGrid.innerHTML = '';
  gallery.forEach((dataUrl, idx)=>{
    const img = document.createElement('img');
    img.src = dataUrl;
    img.title = 'Image #' + (idx+1);
    galleryGrid.appendChild(img);
  });
}
galleryInput && galleryInput.addEventListener('change', (e)=>{
  const files = Array.from(e.target.files);
  files.forEach(file=>{
    const reader = new FileReader();
    reader.onload = function(ev){
      gallery.unshift(ev.target.result); // newest first
      DB.save('barber_gallery', gallery);
      renderGallery();
    };
    reader.readAsDataURL(file);
  });
});
renderGallery();

// ---------- PROMOS ----------
const promoForm = document.getElementById('promoForm');
const promoText = document.getElementById('promoText');
const promoList = document.getElementById('promoList');
let promos = DB.load('barber_promos', []);
function renderPromos(){
  promoList.innerHTML = '';
  promos.forEach((p, idx)=>{
    const li = document.createElement('li');
    li.innerHTML = `<div>${p}</div><div><button class="small-btn" data-idx="${idx}" data-action="del">O'chirish</button></div>`;
    promoList.appendChild(li);
  });
  promoList.querySelectorAll('button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      promos.splice(Number(btn.dataset.idx),1); DB.save('barber_promos', promos); renderPromos();
    });
  });
}
promoForm.addEventListener('submit',(e)=>{
  e.preventDefault();
  if(!promoText.value.trim()) return;
  promos.unshift(promoText.value.trim());
  DB.save('barber_promos', promos); promoText.value=''; renderPromos();
});
renderPromos();

// ---------- EARNINGS & STATS ----------
const earnToday = document.getElementById('earnToday');
const earnWeek = document.getElementById('earnWeek');
const earnMonth = document.getElementById('earnMonth');
const earnChart = document.getElementById('earnChart');

function computeEarnings(){
  // sum completed bookings by date using service prices
  const priceMap = {}; services.forEach(s=>priceMap[s.id]=Number(s.price||0));
  const byDate = {};
  bookings.forEach(b=>{
    if(b.completed){ 
      const date = b.date;
      byDate[date] = (byDate[date] || 0) + (priceMap[b.serviceId] || 0);
    }
  });
  // todays, week, month
  const today = new Date();
  const fmt = d => d.toISOString().slice(0,10);
  const todayStr = fmt(today);
  const startOfWeek = new Date(today); startOfWeek.setDate(today.getDate()-today.getDay()); // sunday
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  let t=0,w=0,m=0;
  Object.keys(byDate).forEach(date=>{
    const val = byDate[date];
    if(date === todayStr) t += val;
    const d = new Date(date);
    if(d >= startOfWeek) w += val;
    if(d >= startOfMonth) m += val;
  });
  earnToday.textContent = t;
  earnWeek.textContent = w;
  earnMonth.textContent = m;

  // Prepare chart: last 7 days totals
  const labels = [], data = [];
  for(let i=6;i>=0;i--){
    const d = new Date(); d.setDate(today.getDate()-i);
    const ds = fmt(d);
    labels.push(ds.slice(5)); // MM-DD
    data.push(byDate[ds] || 0);
  }
  drawChart(labels, data);
}
function renderEarnings(){ computeEarnings(); }
function drawChart(labels, data){
  const ctx = earnChart.getContext('2d');
  ctx.clearRect(0,0,earnChart.width, earnChart.height);
  // simple bar chart
  const w = earnChart.width, h = earnChart.height;
  const pad = 30; const barW = (w - pad*2) / data.length * 0.7;
  const max = Math.max(...data,1);
  data.forEach((val,i)=>{
    const x = pad + i * ((w - pad*2)/data.length) + ((w - pad*2)/data.length - barW)/2;
    const barH = (val / max) * (h - pad*2);
    ctx.fillStyle = '#0b5ed7';
    ctx.fillRect(x, h - pad - barH, barW, barH);
    ctx.fillStyle = '#222';
    ctx.font = '12px Arial';
    ctx.fillText(labels[i], x, h - 6);
  });
}
renderEarnings();

// Re-render earnings when bookings, services, or completions change
window.addEventListener('storage', ()=>{ /* if other tab modifies */ });

// initial load
loadProfile();
renderServices();
renderClients();
renderBookings();
renderRatings();
renderGallery();
renderPromos();
renderEarnings();
