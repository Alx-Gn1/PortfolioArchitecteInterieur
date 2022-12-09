import { displayWorkGallery, getWorks } from "./gallery.js";
import { createModalGallery } from "./modal.js";

export const verifyImage = (image) => {
  if ((image && image.type === "image/png") || (image && image.type === "image/jpeg")) {
    if (image.size <= 4194304) {
      if (image.name.length < 40) {
        return true;
      }
      return "Le nom du fichier ne doit pas faire plus de 40 caractères";
    }
    return "L'image doit peser 4Mo maximum !\n\nTaille actuelle: " + Math.round(image.size / 1048576) + "Mo";
  }
  return "L'image doit être au format png/jpg";
};

export const setimageBackground = (image) => {
  const imgInputContainer = document.getElementById("imgInputContainer");

  if (!image) return;
  imgInputContainer.setAttribute(
    "style",
    "background-image : url(" + window.URL.createObjectURL(image) + "); padding:0"
  );

  // Create a label so the image re-open the file input
  const invisibleInput = document.getElementById("imageInvisibleInput");
  invisibleInput.setAttribute("style", "display:block");

  // imgInputContainer.setAttribute("style", "background-image : url(" + window.URL.createObjectURL(image) + ")");
  imgInputContainer.setAttribute("class", "hideChildren");
};

export const resetForm = () => {
  const imgInputContainer = document.getElementById("imgInputContainer");
  const invisibleInput = document.getElementById("imageInvisibleInput");
  imgInputContainer.removeAttribute("style");
  imgInputContainer.removeAttribute("class");
  invisibleInput.removeAttribute("style");

  const form = document.getElementById("addPictureForm");
  form.reset();
};

export const formatImageName = (image) => {
  const splittedName = image.name.split(".");
  splittedName.pop();

  if (!splittedName.toString().match(/[A-Za-z]/g)) return null;

  const imgName = splittedName
    .toString()
    .replace(/[^A-Za-z0-9]/g, " ")
    .replace(/[0-9]/g, "")
    .slice(0, 40);

  return imgName.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase());
};

export const submitLoadingAnimation = () => {
  const submitButton = document.getElementById("saveChange");

  let count = 1;
  let intervalId;

  return {
    start: () => {
      intervalId = setInterval(() => {
        if (count > 3) count = 0;
        const submitText = "Valider " + ".".repeat(count);
        submitButton.replaceChildren(document.createTextNode(submitText));
        count++;
      }, 500);
    },
    stop: () => {
      clearInterval(intervalId);
      count = 0;
      intervalId = null;
      submitButton.replaceChildren(document.createTextNode("Valider"));
    },
  };
};

export const refreshGalleriesAfterChange = async () => {
  const workList = await getWorks();
  displayWorkGallery(workList);
  createModalGallery(workList);
  return;
};

const deleteWorkFromDOM = (id) => {
  const gallery = document.querySelector(".gallery");
  const modalGallery = document.querySelector(".modalGallery");

  const itemToDelete = document.querySelectorAll(".workId-" + id);
  itemToDelete.forEach((element) => {
    element.remove();
  });

  // // Check if there is already a gallery, do not generate 2 time the same image/work
  // for (const child of gallery.children) {
  //   const imageId = Number(child.getAttribute("id").split("-").pop());
  //   if (imageId === id) {
  //     child.remove();
  //   }
  // }
};

export const deleteWork = async (id) => {
  const userToken = sessionStorage.getItem("userToken");
  const headers = new Headers({
    Accept: "*/*",
    Authorization: "Bearer " + userToken,
  });

  const deleteWorkRes = await fetch("http://localhost:5678/api/works/" + id, {
    headers,
    method: "DELETE",
  }).then((res) => {
    if (res.status == 200 || res.status == 204) {
      deleteWorkFromDOM(id);
      return res;
    } else if (res.status == 401) {
      alert("401 - Accès non autorisé");
    } else {
      alert("Une erreur inconnue est survenue : " + res?.status + res?.statusText);
    }
    return res;
  });

  return deleteWorkRes;
};

export const postWork = async (formData) => {
  const userToken = sessionStorage.getItem("userToken");

  const body = formData;
  const headers = new Headers({
    Accept: "application/json",
    Authorization: "Bearer " + userToken,
  });

  const postWorkRes = await fetch("http://localhost:5678/api/works", {
    headers,
    body,
    method: "POST",
  }).then((res) => {
    if (res.status == 201) {
      return res;
    } else if (res.status == 400) {
      alert("400 - Bad Request");
    } else if (res.status == 401) {
      alert("401 - Accès non autorisé");
    } else {
      alert("Une erreur inconnue est survenue : " + res?.status + res?.statusText);
    }
    return res;
  });

  return postWorkRes;
};

export const successWorkUploadAnim = () => {
  const submitFormButton = document.getElementById("saveChange");

  const successLogo = document.createElement("i");
  successLogo.setAttribute("class", "fa-regular fa-circle-check successLogo");
  submitFormButton.after(successLogo);
  setTimeout(() => {
    successLogo.style = "bottom:80px";
  }, 1);
  setTimeout(() => {
    successLogo.style = "bottom:80px;opacity:0";
  }, 100);
};
