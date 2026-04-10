function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "admin123") {
    localStorage.setItem("auth", "true");
    window.location.href = "issues.html";
  } else {
    alert("Invalid credentials. Please try again");
  }
}
