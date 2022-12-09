import { getWorks, displayWorkGallery, getInUseCategories, displayFilters } from "./modules/gallery.js";
import { showEditUi, showLogoutButton, hideEditUi } from "./modules/editUi.js";
import { handleModal } from "./modules/modal.js";
import { openModal } from "./modules/modalNavigation.js";

// Verify if a user is logged in
const userToken = sessionStorage.getItem("userToken");
// console.log(userToken);

const App = async () => {
  // Main variables
  const workList = await getWorks();
  const inUseCategories = getInUseCategories(workList);
  // Initiate the app
  displayWorkGallery(workList);
  if (!userToken) {
    displayFilters(inUseCategories);
  } else {
    showEditUi(openModal, workList);
    showLogoutButton();
    handleModal(workList);
  }
};

App();
