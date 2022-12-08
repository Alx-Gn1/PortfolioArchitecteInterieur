// Show or hide the editing Ui
const editHeader = document.getElementById("editHeader");
const header = document.querySelector("header");
const editButtons = document.querySelectorAll(".editButton");

export const showEditUi = (openModal, workList) => {
  editHeader.style = "display : flex";
  header.style = "margin: 80px 0";
  editButtons.forEach((e) => {
    e.style = "display: block";
  });
  const editGalleryButton = document.getElementById("editGallery");
  editGalleryButton.addEventListener("click", () => {
    openModal(workList);
  });
};

export const hideEditUi = () => {
  editHeader.style = "display : none";
  header.removeAttribute("style");
  editButtons.forEach((e) => {
    e.removeAttribute("style");
  });
};

export const showLogoutButton = ({ onLogout }) => {
  const loginButton = document.querySelector("a[href='./login.html']");
  loginButton.style = "display : none";
  const logoutButton = document.createElement("a");
  logoutButton.appendChild(document.createTextNode("logout"));
  loginButton.insertAdjacentElement("beforebegin", logoutButton);

  logoutButton.addEventListener("click", () => {
    logoutButton.style = "display : none";
    loginButton.removeAttribute("style");
    onLogout();
  });
};
