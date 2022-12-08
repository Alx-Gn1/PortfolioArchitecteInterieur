import { closeModal, modalNavigate, setupModalNavigation } from "./modalNavigation.js";
import {
  verifyImage,
  setimageBackground,
  formatImageName,
  submitLoadingAnimation,
  deleteWork,
  postWork,
  successWorkUploadAnim,
  resetForm,
  refreshGalleriesAfterChange,
} from "./handleForm.js";

const getCategories = async () => {
  const categories = await fetch("http://localhost:5678/api/categories", {
    method: "GET",
  }).then((res) => res.json());
  return categories;
};

const addCategoriesToForm = (categories) => {
  const categorySelector = document.getElementById("categoryInput");
  // generate option for category select element
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.setAttribute("value", category.id);
    option.setAttribute("label", category.name);
    categorySelector.appendChild(option);
  });
};

export const createModalGallery = (workList) => {
  const modalGallery = document.querySelector(".modalGallery");
  const imageBoxes = workList.map((work) => {
    const imageBox = document.createElement("figure");
    imageBox.setAttribute("class", "imageBox workId-" + work.id);

    const imageBackground = document.createElement("div");
    fetch(work.imageUrl)
      .then((res) => res.blob())
      .then((imageBlob) => {
        const imageObjectURL = URL.createObjectURL(imageBlob);
        imageBackground.setAttribute("style", "background-image : url(" + imageObjectURL + ")");
        imageBackground.setAttribute("class", "imageBackground");
      });

    const buttonContainer = document.createElement("div");
    buttonContainer.setAttribute("class", "imgBtnContainer");

    const editButton = document.createElement("figcaption");
    const caption = document.createTextNode("éditer");
    editButton.appendChild(caption);

    const deleteButton = document.createElement("button");
    deleteButton.addEventListener("click", () => {
      deleteWork(work.id).then((res) => {
        if (res.status == 200 || res.status == 204) {
          imageBox.remove();
        }
      });
    });

    const trashIcon = document.createElement("i");
    trashIcon.setAttribute("class", "fa-solid fa-trash-can");
    deleteButton.appendChild(trashIcon);

    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);
    imageBox.appendChild(imageBackground);
    imageBox.appendChild(buttonContainer);

    return imageBox;
  });
  //   modalGallery.hasChildNodes ? modalGallery.replaceChildren(...imageBoxes) : modalGallery.appendChild();
  modalGallery.replaceChildren(...imageBoxes);
};

const listenFormResults = () => {
  const form = document.getElementById("addPictureForm");
  const imageInput = document.getElementById("imageInput");
  const titleInput = document.getElementById("titleInput");
  const categoryInput = document.getElementById("categoryInput");
  //
  imageInput.addEventListener("change", () => {
    const image = imageInput.files[0];
    if (verifyImage(image) !== true) {
      alert(verifyImage(image));
      return;
    }

    const titleInput = document.getElementById("titleInput");
    if (!titleInput.value) titleInput.value = formatImageName(image);

    setimageBackground(image);
  });

  const submitAnim = submitLoadingAnimation();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    submitAnim.start();

    if (verifyImage(imageInput.files[0]) !== true) {
      alert(verifyImage(imageInput.files[0]));
      return;
    } else if (categoryInput.value.length < 1 || titleInput.value.length < 1) {
      alert("Vérifiez que vous avez correctement rempli les champs Titre & Catégorie");
      submitAnim.stop();
      return;
    }

    const formData = new FormData();
    const fieldNames = ["category", "title", "image"];

    for (let value of new FormData(form).values()) {
      formData.append(fieldNames.pop(), value);
    }

    postWork(formData).then((res) => {
      if (res.status == 201) {
        submitAnim.stop();
        successWorkUploadAnim();
        resetForm();
        setTimeout(() => {
          refreshGalleriesAfterChange().then(() => {
            modalNavigate().toGallery();
          });
        }, 500);
      }
    });
  });
};

export const setupDeleteGalleryButton = (workList) => {
  const delButton = document.getElementById("deleteGallery");

  delButton.addEventListener("click", () => {
    if (document.querySelector(".delGalleryConfirmBox")) {
      return;
    }

    const confirmBox = document.createElement("div");
    confirmBox.setAttribute("class", "delGalleryConfirmBox");

    const confirmButton = document.createElement("button");
    confirmButton.setAttribute("type", "button");
    confirmButton.setAttribute("class", "delGalleryConfirm");
    const confirmIcon = document.createElement("i");
    confirmIcon.setAttribute("class", "fa-solid fa-trash");
    const confirmText = document.createTextNode("Oui supprimer la galerie");
    confirmButton.appendChild(confirmIcon);
    confirmButton.appendChild(confirmText);

    const cancelButton = document.createElement("button");
    cancelButton.innerText = "Annuler";
    cancelButton.setAttribute("type", "button");
    cancelButton.setAttribute("class", "delGalleryCancel");

    confirmBox.appendChild(confirmButton);
    confirmBox.appendChild(cancelButton);
    delButton.insertAdjacentElement("afterend", confirmBox);

    confirmButton.addEventListener("click", () => {
      closeModal();
      workList.forEach((work) => {
        deleteWork(work.id);
      });
    });
    cancelButton.addEventListener("click", () => {
      delButton.innerText = "Supprimer la galerie";
      confirmBox.remove();
    });

    //
    //

    delButton.innerText = "Êtes vous sûr ? Ce processus est irreversible";
    setTimeout(() => {
      delButton.innerText = "Supprimer la galerie";
      confirmBox.remove();
    }, 5000);
  });
};

export const openModal = (workList) => {
  const modal = document.getElementById("modal");
  modal.showModal();
  createModalGallery(workList);
};

export const handleModal = async () => {
  const categories = await getCategories();
  // Event listeners to close the modal & to navigate beetween gallery & form
  setupModalNavigation();

  addCategoriesToForm(categories);
  listenFormResults();
};
