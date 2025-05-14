// DEINE Supabase-Zugangsdaten hier einfügen:
const supabaseUrl = https://xnauxpkrcwpdtvezxxfj.supabase.com
const supabaseKey = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuYXV4cGtyY3dwZHR2ZXp4eGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMjIyMTcsImV4cCI6MjA2Mjc5ODIxN30.SvjV6zh_rBJ94z9AXbbH5aqt2U-RAkoLzgAmuChKDK4
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Event-Handler für das Login-Formular
document.getElementById("login-form").addEventListener("submit", async function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    document.getElementById("status").innerText = "❌ Login fehlgeschlagen: " + error.message;
    document.getElementById("status").style.color = "red";
  } else {
    document.getElementById("status").innerText = "✅ Login erfolgreich! Willkommen, " + data.user.email;
    document.getElementById("status").style.color = "green";

    // Optional: Nach Login weiterleiten
    // window.location.href = "dashboard.html";
  }
});
