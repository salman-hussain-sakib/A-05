const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");

loginBtn.addEventListener("click", function () {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (username === "admin" && password === "admin123") {
    loginError.classList.add("hidden");
    window.location.href = "main.html";
  } else {
    loginError.classList.remove("hidden");
  }
});