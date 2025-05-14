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
map.on('click', async (e) => {
  const { lat, lng } = e.latlng;
  L.marker([lat, lng]).addTo(map).bindPopup('Fischfund!').openPopup();

  // In Supabase speichern
  await supabase.from('fischfunde').insert({
    latitude: lat,
    longitude: lng
  });
});

// Vorhandene Funde laden
loadFishFindings();

async function loadFishFindings() {
  const { data, error } = await supabase.from('fischfunde').select('*');
  if (error) return console.error('Fehler beim Laden der Funde:', error);

  data.forEach(fund => {
    L.marker([fund.latitude, fund.longitude]).addTo(map)
      .bindPopup('Fischfund');
  });
}

