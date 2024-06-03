// -----------------------
// Création des variables
// -----------------------

const modalContainer = document.getElementById("modal");

let modal = null;

// --------------------------------------------
// Ajout de projets dans la vue "Ajout photo"
// --------------------------------------------

// fonction pour ajouter les options de catégories dans la vue "Ajout Photo"
const categoriesAdd = () => {
  fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((response) => (categoriesData = response));
  document.getElementById("add-categorie").innerHTML += categoriesData
    .map(
      (categorie) =>
        `
      <option value="${categorie.id}">${categorie.name}</option>
      `
    )
    .join("");
};

// Fonction pour ajouter un nouveau projet
const addNewProject = async (e) => {
  e.preventDefault();

  const image = document.getElementById("photo").files[0];
  const title = document.getElementById("title").value;
  const category = parseInt(document.getElementById("add-categorie").value);
  const errorAddProject = document.querySelector(".error-add-projet");

  // Vérification des champs du formulaire
  if (!image || !title || !category) {
    errorAddProject.innerText = "Veuillez remplir tous les champs";
    console.log("Formulaire incomplet");
    return;
  } else {
    errorAddProject.innerText = "";
  }

  const formData = new FormData();
  formData.append("image", image);
  formData.append("title", title);
  formData.append("category", category);

  try {
    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }).then((response) => {
      if (response.status === 201) {
        alert("Le projet a bien été ajouté");
        backToGallery(e);
      } else {
        alert("Le projet n'a pas pu être ajouté");
      }
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du projet:", error);
    alert("Une erreur s'est produite. Veuillez réessayer.");
  }
};

const backToGallery = (e) => {
  e.preventDefault();
  projectDisplay();
  modalDisplay();
  closePhotoModal(e);
};

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
            <input type="file" id="photo" name="photo">
            <img id="photo-preview" style="display:none;"/>
            <p>jpg, png : 4mo max</p>
          </div>
          <label for="title">Titre</label>
          <input type="text" name="title" id="title"/>
          <label for="add-categorie">Catégorie</label>
          <select name="add-categorie" id="add-categorie">
            <option value=""></option>
          </select>
        </form>   
        <input type="submit" value="Valider" class="btnDisabled js-validPhoto" disabled/>
        <p class="error-add-projet"></p>
      
    </div>
  `;

  // fonction pour ajouter un aperçu de l'image que l'on veut ajouter
  const photoInput = document.getElementById("photo");
  const photoPreview = document.getElementById("photo-preview");

  const photoPreviewCheck = () => {
    const file = photoInput.files[0];
    if (file) {
      photoPreview.src = URL.createObjectURL(file);
      photoPreview.style.display = "flex";
      photoPreview.setAttribute("width", "130px;");
      photoPreview.setAttribute("height", "200px");
      document.querySelector(".fa-image").style.display = "none";
      document.querySelector(".btnAdd-photo").style.display = "none";
      document.querySelector("#add-photo p").style.display = "none";
    } else {
      photoPreview.style.display = "none";
      document.querySelector(".fa-image").style.display = "";
      document.querySelector(".btnAdd-photo").style.display = "";
      document.querySelector("#add-photo p").style.display = "";
    }
  };

  // Ecouter le changement pour afficher un aperçu de l'image qu'on ajoute
  photoInput.addEventListener("change", photoPreviewCheck);

  // Fonction pour activer le bouton "valider" si tous les champs sont remplis
  const titleInput = document.getElementById("title");
  const categoryInput = document.getElementById("add-categorie");
  const validation = document.querySelector(".js-validPhoto");

  const checkValidation = () => {
    if (
      photoInput.files.length > 0 &&
      titleInput.value !== "" &&
      categoryInput.value !== ""
    ) {
      validation.classList.remove("btnDisabled");
      validation.classList.add("btn-valid");
      validation.removeAttribute("disabled");
    } else {
      validation.classList.remove("btn-valid");
      validation.classList.add("btnDisabled");
      validation.setAttribute("disabled", true);
    }
  };
  // Vérifier si les champs sont bien remplis
  photoInput.addEventListener("change", checkValidation);
  titleInput.addEventListener("input", checkValidation);
  categoryInput.addEventListener("change", checkValidation);

  // Ecouter le clic pour ajouter un nouveau projet
  validation.addEventListener("click", addNewProject);
};

// Fonction pour créer dynamiquement les photos dans la vue "galerie photo"
const photoCreate = (projectData) => {
  const cards = document.querySelector(".cards");

  cards.innerHTML = projectData
    .map(
      (project) =>
        `
          <figure class="card" id="${project.id}">
              <img src="${project.imageUrl}" alt="${project.title}">
              <a href="#" class="trash"><i class="fa-solid fa-trash-can "></i> </a>
          </figure>
      `
    )
    .join("");

  // Ecouter le clic sur les icones "trash" pour supprimer un projet
  const trashs = document.querySelectorAll(".fa-trash-can");
  trashs.forEach((trash) => {
    trash.addEventListener("click", (e) => {
      e.preventDefault();

      // Pour récuperer l'ID de l'élément parent et le transformer en number
      const projectId = parseInt(trash.closest(".card").id);
      console.log("Element:", trash.closest(".card"));
      console.log("Project ID:", projectId);
      projectDelete(projectId);
    });
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

// ---------------------------------------------------
// Suppression de projets dans la vue "Galerie Photo"
// ---------------------------------------------------

const projectDelete = async(projectId) => {
  console.log("Suppression du projet avec l'Id:", projectId); // Pour vérifier que la bonne ID est passée
  let confirmation = confirm("Voulez-vous supprimer ce projet?");
  if (confirmation === true) {
    try {
      await fetch(`http://localhost:5678/api/works/${projectId}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          alert("Le projet a bien été supprimé");
          projectDisplay(projectData);
          modalDisplay(projectData);
          document.getElementById("gallery-modal").style.display = null;
        } else {
          alert("Erreur : le projet n'a pas pu être supprimé");
        }
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du projet:", error);
      alert("Une erreur s'est produite. Veuillez réessayer.");
    }
  }
};
