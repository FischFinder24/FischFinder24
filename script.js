// Verbindung zu deiner Supabase-Instanz
const supabaseUrl = 'https://xnauxpkrcwpdtvezxxfj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuYXV4cGtyY3dwZHR2ZXp4eGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMjIyMTcsImV4cCI6MjA2Mjc5ODIxN30.SvjV6zh_rBJ94z9AXbbH5aqt2U-RAkoLzgAmuChKDK4';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Event Listener für das Login-Formular
document.getElementById("login-form").addEventListener("submit", async function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    document.getElementById("status").innerText = "❗ Bitte E-Mail und Passwort eingeben.";
    document.getElementById("status").style.color = "red";
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

if (error || !data || !data.user) {
  document.getElementById("status").innerText = "❌ Login fehlgeschlagen. Überprüfe E-Mail und Passwort.";
  document.getElementById("status").style.color = "red";
} else {
  // Erfolgreich eingeloggt → Weiterleitung
  window.location.href = "dashboard.html";
}

});
