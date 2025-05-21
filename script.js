document.addEventListener("DOMContentLoaded", () => {
  // Supabase-Setup
  const supabaseUrl = 'https://xnauxpkrcwpdtvezxxfj.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuYXV4cGtyY3dwZHR2ZXp4eGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMjIyMTcsImV4cCI6MjA2Mjc5ODIxN30.SvjV6zh_rBJ94z9AXbbH5aqt2U-RAkoLzgAmuChKDK4';
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  // Startscreen → Auth anzeigen
  document.getElementById("start-button")?.addEventListener("click", () => {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("auth").style.display = "block";
  });

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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else {
      alert("Eingeloggt!");
      document.getElementById("auth").style.display = "none";
      document.getElementById("map-container").style.display = "block";
      initMap();
    }
  };

  // Logout
  document.getElementById("logout")?.addEventListener("click", async () => {
    await supabase.auth.signOut();
    location.reload();
  });

  document.getElementById("logout-map")?.addEventListener("click", async () => {
    await supabase.auth.signOut();
    location.reload();
  });

  // Karte & Marker
  async function initMap() {
    const map = L.map('map').setView([51.1657, 10.4515], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap-Mitwirkende'
    }).addTo(map);

    // Bestehende Funde laden
    const { data: finds } = await supabase.from("fish_finds").select("*");

    finds.forEach(f => {
      let popupContent = `<strong>${f.fish_name}</strong><br>${f.description || ''}`;
      if (f.image_url) {
        popupContent += `<br><img src="${f.image_url}" width="100%">`;
      }
      popupContent += `<br><button class="delete-fish" data-id="${f.id}">🗑️ Löschen</button>`;

      const marker = L.marker([f.lat, f.lng]).addTo(map);
      marker.bindPopup(popupContent);
    });

    // Klick auf Karte → neues Fund-Formular öffnen
    map.on('click', async function (e) {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        alert("Bitte einloggen, um Funde zu dokumentieren.");
        return;
      }

      const popup = document.getElementById("add-fish-popup");
      if (!popup) return;
      popup.style.display = "block";

      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      const saveBtn = document.getElementById("save-fish");
      const cancelBtn = document.getElementById("cancel-fish");

      const newSaveBtn = saveBtn.cloneNode(true);
      saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
      const newCancelBtn = cancelBtn.cloneNode(true);
      cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

      newSaveBtn.onclick = async () => {
        const fishName = document.getElementById("fish-name").value;
        const description = document.getElementById("fish-desc").value;
        const imageFile = document.getElementById("fish-image").files[0];

        let imageUrl = null;

        if (imageFile) {
          const fileExt = imageFile.name.split('.').pop();
          const filePath = `${Date.now()}.${fileExt}`;
          const { error } = await supabase.storage
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

        let popupContent = `<strong>${fishName}</strong><br>${description}`;
        if (imageUrl) popupContent += `<br><img src="${imageUrl}" width="100%">`;
        L.marker([lat, lng]).addTo(map).bindPopup(popupContent).openPopup();

        popup.style.display = "none";
        document.getElementById("fish-name").value = '';
        document.getElementById("fish-desc").value = '';
        document.getElementById("fish-image").value = '';
      };

      newCancelBtn.onclick = () => {
        popup.style.display = "none";
        document.getElementById("fish-name").value = '';
        document.getElementById("fish-desc").value = '';
        document.getElementById("fish-image").value = '';
      };
    });

    // 🔴 Löschfunktion für Marker
    document.getElementById("map-container").addEventListener("click", async (e) => {
      if (e.target.classList.contains("delete-fish")) {
        const id = e.target.getAttribute("data-id");
        const confirmed = confirm("Diesen Fisch-Fund wirklich löschen?");
        if (!confirmed) return;

        const { error } = await supabase.from("fish_finds").delete().eq("id", id);
        if (error) {
          alert("Fehler beim Löschen.");
        } else {
          alert("Fisch-Fund gelöscht.");
          location.reload();
        }
      }
    });
  }
});
