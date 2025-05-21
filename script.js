document.addEventListener("DOMContentLoaded", () => {
  // Deckblatt-Logik
  const startButton = document.getElementById("start-button");
  startButton.addEventListener("click", () => {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("auth").style.display = "block";
  });

  // Supabase-Initialisierung
  const supabaseUrl = 'https://xnauxpkrcwpdtvezxxfj.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuYXV4cGtyY3dwZHR2ZXp4eGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMjIyMTcsImV4cCI6MjA2Mjc5ODIxN30.SvjV6zh_rBJ94z9AXbbH5aqt2U-RAkoLzgAmuChKDK4';
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  // Registrierung
  document.getElementById("signup").onclick = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Registrierung erfolgreich! Bitte E-Mail bestätigen.");
  };

  // Login
  document.getElementById("login").onclick = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else {
      alert("Eingeloggt!");
 document.getElementById("auth").style.display = "none";
document.getElementById("map-container").style.display = "block";

      initMap();
    }
  };

  // Logout
  document.getElementById("logout").onclick = async () => {
    await supabase.auth.signOut();
    location.reload();
  };
  
  document.getElementById("logout-map").onclick = async () => {
  await supabase.auth.signOut();
  location.reload();
};


  // Karte initialisieren
  async function initMap() {
    const map = L.map('map').setView([51.1657, 10.4515], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap-Mitwirkende'
    }).addTo(map);

    map.on('click', async function (e) {
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    alert("Bitte einloggen, um Funde zu dokumentieren.");
    return;
  }

  // Zeige Eingabefenster
  document.getElementById("add-fish-popup").style.display = "block";

  // Speichern-Logik
  document.getElementById("save-fish").onclick = async () => {
    const fishName = document.getElementById("fish-name").value;
    const description = document.getElementById("fish-desc").value;
    const imageFile = document.getElementById("fish-image").files[0];
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    let imageUrl = null;

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const filePath = `${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('fish-images')
        .upload(filePath, imageFile);

      if (error) {
        alert("Bild-Upload fehlgeschlagen");
        return;
      }

      const { data: publicUrlData } = supabase
        .storage
        .from('fish-images')
        .getPublicUrl(filePath);

      imageUrl = publicUrlData.publicUrl;
    }

    await supabase.from("fish_finds").insert([
      {
        user_id: user.data.user.id,
        fish_name: fishName,
        description: description,
        image_url: imageUrl,
        lat,
        lng
      }
    ]);

    const marker = L.marker([lat, lng]).addTo(map);
    let popupContent = `<strong>${fishName}</strong><br>${description}`;
    if (imageUrl) popupContent += `<br><img src="${imageUrl}" width="100%">`;
    marker.bindPopup(popupContent).openPopup();

    document.getElementById("add-fish-popup").style.display = "none";
    document.getElementById("fish-name").value = '';
    document.getElementById("fish-desc").value = '';
    document.getElementById("fish-image").value = '';
  };

  // Abbrechen
  document.getElementById("cancel-fish").onclick = () => {
    document.getElementById("add-fish-popup").style.display = "none";
    document.getElementById("fish-name").value = '';
    document.getElementById("fish-desc").value = '';
    document.getElementById("fish-image").value = '';
  };
});
