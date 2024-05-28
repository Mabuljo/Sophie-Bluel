// -----------------------
// Création des variables
// -----------------------

const modalContainer = document.getElementById("modal");

let modal = null;

// ------------------------------
// Création de la fenêtre modale
// ------------------------------

// fonction pour créer le corps de la modale
const createModal = () => {
  modalContainer.innerHTML = `
    <div id="gallery-modal" class="modal-wrapper js-modal-stop">
      <i class="fa-solid fa-xmark js-modal-close"></i>
      <h3 id="titlemodal">Galerie photo</h3>
      <div class="cards">
      </div>
      <a href="#photo-modal" class="btn btnPhotoLink js-openPhotoModal">Ajouter une photo</a>
    </div>

    <div id="photo-modal" class="modal-wrapper js-modal-stop" style="display: none;">
      <i class="fa-solid fa-arrow-left js-back-to-gallery"></i>
      <i class="fa-solid fa-xmark js-modal-close"></i>
      <h3>Ajout photo</h3>
      <form action="#" method="post" id="photo-modal-form">
          <div id="add-photo">
            <i class="fa-regular fa-6x fa-image"></i>
            <label for="photo" class="btnAdd-photo">+ Ajouter Photo</label>
            <input type="file" id="photo" name="photo" required>
            <p>jpg, png : 4mo max</p>
          </div>
          <label for="titre">Titre</label>
          <input type="text" name="titre" id="titre" required />
          <label for="add-categorie">Catégorie</label>
          <select name="add-categorie" id="add-categorie" required>
            <option value=""></option>
          </select>
        </form>   
      <input type="submit" value="Valider" class="btnValid" />
    </div>
  `;
};

// Fonction pour créer dynamiquement les photos dans la vue "galerie photo"
const photoCreate = (projectData) => {
  const cards = document.querySelector(".cards");

  cards.innerHTML = projectData
    .map(
      (project) =>
        `
          <article class="card">
              <img src="${project.imageUrl}" alt="${project.title}">
              <a href="#" class="trash"><i class="fa-solid fa-trash-can "></i> </a>
          </article>
      `
    )
    .join("");

  // Ecouter le clic sur les icones "trash" pour supprimer un projet
  const trashs = document.querySelectorAll(".fa-trash-can");
  trashs.forEach((trash) => {
    trash.addEventListener("click", projectDelete);
  });
};

// Fonction d'affichage de la modale
const modalDisplay = async () => {
  if (token !== null) {
    createModal();
    await projectsFetch();
    photoCreate(projectData);
    categoriesAdd(); // pour ajouter les catégories dans la vue "Ajout photo"
  }
};

modalDisplay();

// ----------------------------------
// Fonction d'ouverture de la modale
// ----------------------------------

const openModal = async (e) => {
  e.preventDefault();
  await modalDisplay(); // attendre que la modale soit créée pour jouer la fonction openModal
  const target = document.querySelector(e.target.getAttribute("href"));
  target.style.display = null;
  target.removeAttribute("aria-hidden");
  target.setAttribute("aria-modal", "true");
  modal = target;
  modal.addEventListener("click", closeModal);
  modal.querySelectorAll(".js-modal-close").forEach((x) => {
    x.addEventListener("click", closeModal);
  });
  modal.querySelectorAll(".js-modal-stop").forEach((stop) => {
    stop.addEventListener("click", stopPropagation);
  });

  // Ecouter le clic pour ouvrir la vue "Ajout photo"
  document
    .querySelector(".js-openPhotoModal")
    .addEventListener("click", openPhotoModal);
};

// -----------------------------------
// Fonction de fermeture de la modale
// -----------------------------------

const closeModal = async (e) => {
  if (modal === null) return;
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal.querySelectorAll(".js-modal-close").forEach((x) => {
    x.removeEventListener("click", closeModal);
  });
  modal.querySelectorAll(".js-modal-stop").forEach((stop) => {
    stop.removeEventListener("click", stopPropagation);
  });
  modal = null;
};

// fonction pour éviter la fermeture au clic dans toute la modale
const stopPropagation = (e) => {
  e.stopPropagation();
};

//---------------------------------------------------------------
// Ecouter le clic sur la class "js-modal" pour ouvrir la modale
//---------------------------------------------------------------

document.querySelector(".js-modal").addEventListener("click", openModal);

// ----------------------------------------------------------
// Fonctions d'ouverture et fermeture de la vue "Ajout photo"
// ----------------------------------------------------------

const openPhotoModal = async () => {
  document.getElementById("photo-modal").style.display = null;
  document.getElementById("gallery-modal").style.display = "none";

  // Écoutez le clic sur le bouton "back-to-gallery" pour revenir à "galerie photo"
  document
    .querySelector(".js-back-to-gallery")
    .addEventListener("click", closePhotoModal);
};

const closePhotoModal = async () => {
  document.getElementById("photo-modal").style.display = "none";
  document.getElementById("gallery-modal").style.display = null;
};

// ------------------------
// Suppression de projets
// ------------------------

const projectDelete = async () => {
  let confirmation = confirm("Voulez-vous supprimer ce projet?");
  if (confirmation === true) {
    fetch(`http://localhost:5678/api/${project.id}`, {
      method: "DELETE",
    }).then((response) => {
      if (response.status === 200) {
        alert("Le projet a bien été supprimé");
        projectDisplay();
        modalDisplay();
      } else {
        alert("Erreur: le projet n'a pas pu être supprimé");
      }
    });
  }
};

// ------------------
// Ajout de projets 
// ------------------

// fonction pour ajouter les options de catégories dans la vue "Ajout Photo"
const categoriesAdd = () => {
 fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((response) => (categoriesData = response));
  document.getElementById("add-categorie").innerHTML += categoriesData
    .map(
      (categorie) =>
        `
      <option value="${categorie.name}">${categorie.name}</option>
      `
    )
    .join("");
};
