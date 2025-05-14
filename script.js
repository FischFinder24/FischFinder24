// Supabase-Client initialisieren
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseKey = 'public-anon-key';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const mapSection = document.getElementById('map-section');
let map;

async function signUp() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const { user, error } = await supabase.auth.signUp({ email, password });
  if (error) alert(error.message);
  else alert('Registrierung erfolgreich! Bitte Email bestätigen.');
}

async function signIn() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const { user, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
  else {
    alert('Eingeloggt!');
    mapSection.style.display = 'block';
    initMap();
  }
}

async function signOut() {
  await supabase.auth.signOut();
  alert('Ausgeloggt!');
  mapSection.style.display = 'none';
}

// Karte initialisieren
async function initMap() {
  if (map) return;
  map = L.map('map').setView([51.1657, 10.4515], 6); // Deutschland-Zentrum

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap Contributors'
  }).addTo(map);

  map.on('click', async (e) => {
    const { lat, lng } = e.latlng;
    L.marker([lat, lng]).addTo(map).bindPopup('Fischfund!').openPopup();
    
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return alert("Nicht eingeloggt!");

    await supabase.from('fischfunde').insert({
      user_id: user.id,
      latitude: lat,
      longitude: lng
    });
  });

  loadFishFindings();
}

// Lade gespeicherte Funde
async function loadFishFindings() {
  const { data, error } = await supabase.from('fischfunde').select('*');
  if (error) return console.error(error);
  data.forEach(fund => {
    L.marker([fund.latitude, fund.longitude]).addTo(map).bindPopup('Fischfund (User-ID: ' + fund.user_id + ')');
  });
}
