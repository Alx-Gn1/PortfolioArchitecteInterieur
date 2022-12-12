export const openModal = () => {
  const modal = document.getElementById("modal");
  modal.showModal();
};

export const closeModal = () => {
  const modal = document.getElementById("modal");
  modal.close();
};

const hideModalGallery = () => {
  const modalGallery = document.querySelector(".modalGallery");
  modalGallery.style = "display : none";
};
const showModalGallery = () => {
  const modalGallery = document.querySelector(".modalGallery");
  modalGallery.removeAttribute("style");
};

export const modalNavigate = () => {
  const goBackButton = document.querySelector(".modalHeader .fa-arrow-left");
  const saveChangeButton = document.getElementById("saveChange");
  const addPictureForm = document.getElementById("addPictureForm");
  const deleteGalleryButton = document.getElementById("deleteGallery");
  const addPictureButton = document.getElementById("addPicture");
  const modalTitle = document.querySelector(".modalContainer h3");
  return {
    toForm: () => {
      modalTitle.replaceChildren("Ajout photo");

      goBackButton.removeAttribute("style");

      saveChangeButton.style = "display : block";
      addPictureForm.style = "display : flex";

      deleteGalleryButton.style = "display : none";
      addPictureButton.style = "display : none";
      hideModalGallery();
    },
    toGallery: () => {
      modalTitle.replaceChildren("Galerie photo");

      goBackButton.style = "opacity : 0";

      deleteGalleryButton.removeAttribute("style");
      addPictureButton.removeAttribute("style");
      addPictureForm.removeAttribute("style");
      saveChangeButton.removeAttribute("style");
      showModalGallery();
    },
  };
};

export const setupModalNavigation = () => {
  // Close the modal
  window.onclick = (e) => {
    if (e.target == modal) {
      closeModal();
    }
  };
  const closeModalButton = document.querySelector(".modalHeader .fa-xmark");
  closeModalButton.addEventListener("click", () => {
    closeModal();
  });
  // Nav to picture form
  const addPictureButton = document.getElementById("addPicture");
  addPictureButton.addEventListener("click", () => {
    modalNavigate().toForm();
  });
  // Nav back to gallery
  const goBackButton = document.querySelector(".modalHeader .fa-arrow-left");
  goBackButton.setAttribute("style", "opacity : 0");
  goBackButton.addEventListener("click", () => {
    modalNavigate().toGallery();
  });
};
