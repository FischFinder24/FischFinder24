const supabaseUrl = 'https://xnauxpkrcwpdtvezxxfj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuYXV4cGtyY3dwZHR2ZXp4eGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMjIyMTcsImV4cCI6MjA2Mjc5ODIxN30.SvjV6zh_rBJ94z9AXbbH5aqt2U-RAkoLzgAmuChKDK4';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("login-form");
  const statusEl = document.getElementById("status");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      statusEl.innerText = "❗ Bitte E-Mail und Passwort eingeben.";
      statusEl.style.color = "red";
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error || !data || !data.user) {
      statusEl.innerText = "❌ Login fehlgeschlagen. Überprüfe E-Mail und Passwort.";
      statusEl.style.color = "red";
    } else {
      // ✅ Erfolgreich eingeloggt → weiterleiten
      window.location.href = "dashboard.html";
    }
  });
});
