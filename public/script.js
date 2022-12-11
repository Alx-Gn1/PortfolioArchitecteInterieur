import { getWorks, displayWorkGallery, getInUseCategories, displayFilters } from "./modules/gallery.js";
import { showEditUi, showLogoutButton } from "./modules/editUi.js";
import { handleModal } from "./modules/modal.js";

// Verify if a user is logged in
const userToken = sessionStorage.getItem("userToken");
// console.log(userToken);

const HomePage = async () => {
  // Main variables
  const workList = await getWorks();
  const inUseCategories = getInUseCategories(workList);
  // Initiate the app
  displayWorkGallery(workList);
  if (!userToken) {
    displayFilters(inUseCategories);
  } else {
    showEditUi();
    showLogoutButton();
    handleModal(workList);
  }
};

HomePage();
