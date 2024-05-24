// -----------------------
// Création des variables
// -----------------------

const modalContainer = document.querySelector(".modal");

// -----------------------------------------------
// Création de la fenêtre modale "Galerie photo"
// ----------------------------------------------

// fonction pour créer le corps de la modale
const createModal = () => {
  modalContainer.innerHTML = `
     <div class="modal-wrapper js-modal-stop">
         <i class="fa-solid fa-xmark js-modal-close"></i>
         <h3 id="titlemodal">Galerie photo</h3>
          <div class="cards">
          </div>
          <input type="button" value="Ajouter une photo" class="btn">
    </div>
    `;
};

// Fonction pour créer dynamiquement les photos dans la modale
const photoCreate = (projectData) => {
  const cards = document.querySelector(".cards");

  cards.innerHTML = projectData
    .map(
      (photo) =>
        `
            <article class="card">
                <img src="${photo.imageUrl}" alt="${photo.title}">
                <a href="#" class="trash"><i class="fa-solid fa-trash-can"></i></a>
            </article>
          `
    )
    .join("");
};

// Fonction d'affichage de la modale
const modalDisplay = async () => {
  if(token !== null) {
  createModal();
  await projectsFetch();
  photoCreate(projectData);}
};

modalDisplay();

// ----------------------------------------------------
// Ouverture et Fermeture de la modale "Galerie photo"
// ----------------------------------------------------

let modal = null;

// fonction pour ouvrir la modale
const openModal = async(e) => {
  e.preventDefault();
  await modalDisplay(); // attendre que la modale soit creer pour jouer la fonction openModal
  const target = document.querySelector(e.target.getAttribute("href"));
  target.style.display = null;
  target.removeAttribute("aria-hidden");
  target.setAttribute("aria-modal", "true");
  modal = target;
  modal.addEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
  modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
};



//fonction pour fermer la modale
const closeModal = async(e) => {
  if (modal === null) return;
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").removeEventListener("click", closeModal)
  modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation)
  modal = null;
};

// fonction pour éviter la fermeture au clic dans toute la modale
const stopPropagation = (e) =>{
e.stopPropagation()
}

// Ecouter le clic sur "modifier" de la page du mode édition
document.querySelector(".js-modal").addEventListener("click", openModal);
