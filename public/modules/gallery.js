import { ApiUrl } from "../Constants/Api.js";

// Get works from api
const getWorks = async () => {
  const getWorksHeaders = new Headers({ "content-type": "application/json" });
  // get the work list
  const workList = await fetch(ApiUrl + "/works", {
    method: "GET",
    headers: getWorksHeaders,
  }).then((res) => res.json());

  return workList;
};

const displayWorkGallery = (workList) => {
  const gallery = document.querySelector(".gallery");

  // Check if there is already a gallery, do not generate 2 time the same image/work
  const imagesAlreadyInGallery = new Set([]);
  for (const child of gallery.children) {
    // Rappel : image figure class = " ...workId-XXXX"
    const imageId = Number(child.getAttribute("class").split("-").pop());
    imagesAlreadyInGallery.add(imageId);
  }

  // Create html elements for each work
  const workElements = workList.map((work) => {
    if (imagesAlreadyInGallery.has(work.id)) {
      return null;
    }
    // Creation d'un élément pour chaque projet
    const img = document.createElement("img");
    fetch(work.imageUrl)
      .then((res) => res.blob())
      .then((imageBlob) => {
        const imageObjectURL = URL.createObjectURL(imageBlob);
        img.src = imageObjectURL;
      });
    img.alt = work.title;

    const figcaption = document.createElement("figcaption");
    const caption = document.createTextNode(work.title);
    figcaption.appendChild(caption);

    const figure = document.createElement("figure");
    figure.setAttribute("class", "categoryId-" + work.category.id + " workId-" + work.id);
    figure.appendChild(img);
    figure.appendChild(figcaption);

    return figure;
  });

  workElements.forEach((element) => {
    if (element !== null) gallery.appendChild(element);
  });
};

// Create filter & gallery elements
const createFiltersHtml = (categories) => {
  const gallery = document.querySelector(".gallery");

  const filters = document.createElement("div");
  filters.setAttribute("class", "filters");
  categories.forEach((category) => {
    const elementClass = category.name === "Tous" ? "filterButton selected" : "filterButton";
    const button = document.createElement("button");
    button.setAttribute("class", elementClass);
    button.setAttribute("name", category.name);
    button.setAttribute("value", category.id);
    button.appendChild(document.createTextNode(category.name));
    filters.appendChild(button);
  });
  gallery.insertAdjacentElement("beforebegin", filters);
};

const filterGallery = (filter) => {
  const gallery = new Set(document.querySelectorAll(".gallery figure"));

  gallery.forEach((element) => {
    // Rappel : class="categoryId-XXX workId-XXX"
    filter === "0" || element.className.split(" ")[0] === "categoryId-" + filter
      ? element.classList.remove("d-none")
      : element.classList.add("d-none");
  });
};

const selectFilter = (filter) => {
  const filterButtons = document.getElementsByClassName("filterButton");

  filterGallery(filter);

  for (let i = 0; i < filterButtons.length; i++) {
    const element = filterButtons[i];
    element.getAttribute("value") === filter
      ? element.setAttribute("class", "filterButton selected")
      : element.setAttribute("class", "filterButton");
  }
};

const handleFilters = () => {
  const filterButtons = document.getElementsByClassName("filterButton");

  for (let i = 0; i < filterButtons.length; i++) {
    const filter = filterButtons[i].getAttribute("value");
    filterButtons[i].addEventListener("click", () => {
      selectFilter(filter);
    });
  }
};

const displayFilters = (categories) => {
  createFiltersHtml(categories);
  handleFilters();
};

const getInUseCategories = (workList) => {
  const categories = [{ id: 0, name: "Tous" }];
  workList.forEach((work) => {
    if (!categories.find((e) => e.id === work.category.id)) categories.push(work.category);
  });
  return categories;
};

export { getWorks, displayWorkGallery, displayFilters, getInUseCategories };
