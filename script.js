document.getElementById("login-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Hier würde Supabase-Login kommen – aktuell nur Demo
  console.log("Login versucht:", email);

  // Platzhalter für Statusmeldung
  document.getElementById("status").innerText = "Login (Test) erfolgreich für: " + email;
});
