// -------------------------
// Création des variables
// -------------------------

const gallery = document.querySelector(".gallery");
const categories = document.getElementById("categories");

let projectData = [];
let categoriesData = [];
let category = [];

// variables du mode administrateur
const token = window.localStorage.getItem("token");
const categoriesDelete = document.getElementById("categories");
const logOut = document.getElementById("js-log");
const lienModale = document.getElementById("lien-modale");
const modeEdition = document.querySelector(".js-admin");

// ------------------------------------
// Création des boutons des catégories
// ------------------------------------

// fonction pour récupérer les categories des projets
const categoriesFetch = async () => {
  await fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((response) => (categoriesData = response));
  buttonCreate();
};

// Fonction pour créer chaque bouton selon sa catégorie
const buttonCreate = () => {
  categories.innerHTML += categoriesData
    .map(
      (categorie) =>
        `
      <button id="btn${categorie.id}" class="btn-filtre">
      ${categorie.name}
      </button>
       `
    )
    .join("");
};

categoriesFetch();

// ---------------------------------------------------
// Récupération et affichage des projets du back-end
//----------------------------------------------------

// fonction pour récupérer les datas des projets
const projectsFetch = async () => {
  await fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((response) => (projectData = response));
};

// Fonction pour créer chaque projet
const projectCreate = async (projectData) => {
  gallery.innerHTML = projectData
    .map(
      (project) =>
        `
        <figure>
          <img src=${project.imageUrl} alt="${project.title}"></img>
          <figcaption>${project.title}</figcaption>  
        </figure> 
        `
    )
    .join("");
};

// --------------------------------------
// Réalisation des filtres des travaux
// --------------------------------------

const categorieChoose = async () => {
  // Sélection des boutons après leur création
  const buttons = document.querySelectorAll(".btn-filtre");

  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      if (e.target.id === "btnTous") {
        category = projectData;
      } else {
        // Cas dynamique pour les autres catégories
        const categoryId = parseInt(e.target.id.replace("btn", ""));
        category = projectData.filter((data) => data.categoryId === categoryId);
      }

      projectCreate(category);
    });
  });
};

// Fonction pour afficher les projets dynamiquement
const projectDisplay = async () => {
  await projectsFetch();
  await categorieChoose();
  await projectCreate(projectData);
};

projectDisplay();


// -------------------------------------
// Affichage de la page administrateur
// -------------------------------------

const adminDisplay = () => {
  if (token !== null) {
    // suppression de <div> contenant les boutons de catégories
    categoriesDelete.style.display = "none";
    // modification du login en LOGOUT de la navBar
    logOut.innerText = "logout";
    // ajout du <a> modifier dans la section portofolio
    lienModale.innerHTML += `
    <a href="#modal" class="js-modal">
    <i class="fa-regular fa-pen-to-square"></i>
     modifier</a>
    `;
    // ajout du bandeau noir d'en-tête
    modeEdition.classList.add("mode-edition");
    const p = document.createElement("p");
    p.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> Mode édition`;
    modeEdition.appendChild(p);
  }
};

adminDisplay();