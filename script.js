// Supabase-Konfiguration
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseKey = 'public-anon-key';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Karte initialisieren
let map = L.map('map').setView([51.1657, 10.4515], 6); // Deutschland-Zentrum

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap Contributors'
}).addTo(map);

// Karte: Klick-Handler
let clickedLatLng = null;

map.on('click', (e) => {
  clickedLatLng = e.latlng;
  document.getElementById('form-popup').classList.remove('hidden');
});
function cancelFund() {
  document.getElementById('form-popup').classList.add('hidden');
  clickedLatLng = null;
}

async function saveFund() {
  const art = document.getElementById('fischart').value;
  const beschreibung = document.getElementById('beschreibung').value;

  if (!art || !clickedLatLng) return alert("Bitte Fischart eingeben und auf die Karte klicken.");

  const { lat, lng } = clickedLatLng;

  await supabase.from('fischfunde').insert({
    latitude: lat,
    longitude: lng,
    art,
    beschreibung
  });

  L.marker([lat, lng]).addTo(map).bindPopup(`<strong>${art}</strong><br>${beschreibung}`).openPopup();

  // Formular zurücksetzen
  document.getElementById('form-popup').classList.add('hidden');
  clickedLatLng = null;
  document.getElementById('fischart').value = '';
  document.getElementById('beschreibung').value = '';
}


  // In Supabase speichern
  await supabase.from('fischfunde').insert({
    latitude: lat,
    longitude: lng
  });
});

// Vorhandene Funde laden
async function loadFishFindings() {
  const { data, error } = await supabase.from('fischfunde').select('*');
  if (error) return console.error('Fehler beim Laden:', error);

  data.forEach(fund => {
    L.marker([fund.latitude, fund.longitude])
      .addTo(map)
      .bindPopup(`<strong>${fund.art}</strong><br>${fund.beschreibung || ''}`);
  });
}



