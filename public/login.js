const form = document.forms["loginForm"];
form.addEventListener("submit", (event) => {
  event.preventDefault();
});

const displayErrorMessage = (message) => {
  // If no message is given to the function, it clear all error message

  // Delete former message
  const errorMessage = document.querySelector(".error");
  if (errorMessage) {
    errorMessage.remove();
  }
  if (message) {
    // Create html for error message
    const container = document.createElement("div");
    container.setAttribute("class", "error");
    const messageNode = document.createTextNode(message);
    container.appendChild(messageNode);

    // Add new message to the dom
    const loginSection = document.getElementById("login");
    loginSection.insertBefore(container, form);
  }
};

const clearErrorMessage = () => displayErrorMessage(null);

const loginUser = async (email, password) => {
  const loginHeaders = new Headers({ "content-type": "application/json" });
  const fetchConfig = {
    headers: loginHeaders,
    body: JSON.stringify({ email, password }),
    method: "POST",
  };

  const response = await fetch("http://localhost:5678/api/users/login", fetchConfig).then((res) => {
    if (res.status === 401 || res.status === 404) {
      displayErrorMessage("Erreur dans l'identifiant ou le mot de passe");
      return null;
    } else {
      return res.json();
    }
  });

  if (response?.token) {
    sessionStorage.setItem("userToken", response.token);
    window.location.replace("/");
  }
};

// Event listeners
const emailInput = form.email;
const passwordInput = form.password;
const loginButton = form.loginButton;

let email;
let password;

emailInput.addEventListener("input", (e) => {
  email = e.target.value;
});
passwordInput.addEventListener("input", (e) => {
  password = e.target.value;
});

loginButton.addEventListener("click", () => {
  //
  if (emailInput.reportValidity() && passwordInput.reportValidity()) {
    clearErrorMessage();
    loginUser(email, password);
  }
});
