// -----------------------
// Création des variables
// -----------------------
const btnConnect = document.getElementById("btnConnect");

// -------------------------------------
// Vérification de l'authentification
// -------------------------------------

const loginCheck = () => {
  // Récupération identifiant & mot de passe tapés
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const error = document.querySelector(".error");

  let emailLogin = emailInput.value;
  let passwordLogin = passwordInput.value;

  const login = {
    email: emailLogin,
    password: passwordLogin,
  };

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(login),
  }).then((response) => {
    if (response.status === 200) {
      response
        .json()
        .then((response) => (data = response))
        .then((data) => {
          localStorage.setItem("token", data.token); // récuperer le TOKEN et l'enregistrer dans le localStorage
          location.href = "./index.html";
        });
    } else {
      error.innerText = "Email ou mot de passe incorrect";
    }
  });
};

// --------------------------
// Envoi du login à l'API
// --------------------------

btnConnect.addEventListener("click", function (e) {
  e.preventDefault;
  loginCheck();
});