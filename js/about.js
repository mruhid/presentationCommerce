// PC-menu color and scrool movement
const header = document.querySelector(".pc-menu");
let lastScrollY = window.scrollY;
const basePath = "/presentationCommerce"

window.addEventListener("scroll", () => {
  if (window.scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  lastScrollY = window.scrollY;
});

// pahe Loading Functions

async function fetchAboutData(sectionName) {
  try {
    const checkBackendUrl = await fetch(`${basePath}/src/src.json`);
    const backendConfig = await checkBackendUrl.json();

    const url = backendConfig.backend_url + "/about";

    const fetchUrl = backendConfig.action ? url : `${basePath}/json/aboutData.json`;

    const options = backendConfig.action
      ? {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Specify the type of content being sent
          },
          body: JSON.stringify({ sectionName }), // Send the sectionName as part of the request
        }
      : null;

    const response = await fetch(fetchUrl, options);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data[sectionName]) {
      return data[sectionName];
    } else {
      throw new Error(`Section "${sectionName}" not found in data.`);
    }
  } catch (error) {
    console.error("Error fetching section data:", error);
    return null;
  }
}

async function footerFetchData() {
  try {
    // Fetch the configuration file
    const configResponse = await fetch(`${basePath}/src/src.json`); // Adjust path as needed
    if (!configResponse.ok) {
      throw new Error(
        `Failed to fetch config file. Status: ${configResponse.status}`
      );
    }

    const config = await configResponse.json();

    // Determine the data source (backend or fallback JSON)
    const fetchUrl = config.action
      ? `${config.backend_url}/footer`
      : `${basePath}/json/footerData.json`; // Adjust path as needed

    // Fetch the footer data
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch footer data. Status: ${response.status}`
      );
    }

    // Parse and return the data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching footer data:", error);
    return null; // Return null for graceful error handling
  }
}

async function fetchCompanyData() {
  try {
    const configResponse = await fetch(`${basePath}/src/src.json`); // Adjust path as needed
    if (!configResponse.ok) {
      throw new Error(
        `Failed to fetch config file. Status: ${configResponse.status}`
      );
    }

    const config = await configResponse.json();

    // Determine the data source (backend or fallback JSON)
    const fetchUrl = config.action
      ? `${config.backend_url}/company`
      : `${basePath}/json/companyİnformation.json`; // Adjust path as needed

    // Fetch the footer data
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch footer data. Status: ${response.status}`
      );
    }

    // Parse and return the data
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching company data:", error);
  }
}
async function updateHeader() {
  const data = await fetchCompanyData();
  if (!data.companyLogo) {
    return;
  }
  const profilePicture = document.getElementById("profilePicture");
  profilePicture.src = data.companyLogo;
  profilePicture.alt = data.companyName;
  document.title = `${
    data.companyName ? data.companyName + " | About" : "About"
  } `;
  // Change the favicon
  const favicon = document.getElementById("favicon");
  favicon.href = `${data.companyWebLogo || ""}`;
}

async function updateAboutUsSection() {
  const data = await fetchAboutData("aboutUsSection");
  const aboutUsSection = document.querySelector(".about-us");
  if (!data.action) {
    aboutUsSection.style = "display:none";
    return;
  }
  // Update the title
  const titleElement = aboutUsSection.querySelector("h1");
  titleElement.textContent = data.title || "";

  // Update the image
  const imageElement = aboutUsSection.querySelector("img");
  if (imageElement) {
    imageElement.src = data.imgSrc || "";
    imageElement.onerror = () => {
      imageElement.src = "../img/default/noImg.jpg";
    };
    imageElement.alt = data.title || "";
  }

  // Update the description
  const descriptionElement = aboutUsSection.querySelector("p");
  descriptionElement.textContent = data.description || "";
}

async function updatePurposeSection() {
  const data = await fetchAboutData("purposeSection");
  const purposeSection = document.querySelector(".purpose");
  if (!data.action) {
    purposeSection.style = "display:none";
    return;
  }
  // Update the main title
  const titleElement = purposeSection.querySelector("h1");
  titleElement.textContent = data.title || "";

  // Update the catalog highlight and description
  const catalogHighlight = purposeSection.querySelector(
    ".purpose-catalog .title p span"
  );
  catalogHighlight.textContent = data.catalog.highlight || "";

  const catalogDescription = purposeSection.querySelector(
    ".purpose-catalog .title h4 strong"
  );
  catalogDescription.textContent = data.catalog.description || "";

  // Update the catalog image
  const catalogImage = purposeSection.querySelector(
    ".purpose-catalog .purpose-img img"
  );
  if (catalogImage) {
    catalogImage.src = data.catalog.imgSrc || "";
    catalogImage.onerror = () => {
      catalogImage.src = "../img/default/noImg.jpg";
    };
    catalogImage.alt = data.title || "Error";
  }

  // Update the section description
  const descriptionElement = purposeSection.querySelector(".description");
  descriptionElement.textContent = data.description || "";
}

async function updateOtherWorkSection() {
  const data = await fetchAboutData("otherWorkSection");
  const otherWorkSection = document.querySelector(".other-work");

  if (!data.action) {
    otherWorkSection.style = "display:none";
    return;
  }

  // Update background image
  const backgroundImage = otherWorkSection.querySelector("img");
  if (backgroundImage) {
    backgroundImage.src = data.backgroundImg || "";
    backgroundImage.onerror = () => {
      backgroundImage.src = "../img/default/noImg.jpg";
    };
    backgroundImage.alt = data.overlay.title || "Background image";
  }

  // Update overlay title
  const overlayTitle = otherWorkSection.querySelector(".overlay h2");
  if (overlayTitle) {
    overlayTitle.textContent = data.overlay.title || "";
  }

  // Update overlay description
  const overlayDescription = otherWorkSection.querySelector(".overlay p");
  if (overlayDescription) {
    overlayDescription.textContent = data.overlay.description || "";
  }

  // Update button text and link
  const overlayButton = otherWorkSection.querySelector(".overlay .button");
  if (overlayButton) {
    overlayButton.textContent = data.overlay.buttonText || "";
    overlayButton.href = data.overlay.buttonSrc || "";
  }
}

async function updateFooterData() {
  const data = await footerFetchData();
  // Get footer elements
  const footer = document.querySelector("footer");
  const companyNameElement = footer.querySelector(".newsletter h2");
  const footerLogoElement = footer.querySelector(".footer-logo");
  const socialContainer = footer.querySelector(".social");
  const copyrightElement = footer.querySelector(".copyright p");
  const companySearchTools = footer.querySelector(".copyright h4");

  // Set the company name and logo
  companyNameElement.textContent = data.heading;
  footerLogoElement.src = data.logoImg;
  footerLogoElement.style.objectFit = "contain";
  companySearchTools.innerHTML = data.searchTools || "";
  // Create social media links dynamically
  socialContainer.innerHTML = ""; // Clear existing links
  data.socialLinks.forEach((link) => {
    const socialLink = document.createElement("a");
    socialLink.href = link.link;
    socialLink.setAttribute("title", `Bizi buradan izləyə bilərsiniz`);
    const icon = document.createElement("i");
    icon.className = link.iconClass;
    socialLink.appendChild(icon);
    socialContainer.appendChild(socialLink);
  });

  // Set the copyright text
  copyrightElement.innerHTML = data.copyright || "";
}

document.addEventListener("DOMContentLoaded", () => {
  updateAboutUsSection();
  updateHeader();
  updatePurposeSection();
  updateOtherWorkSection();
  updateFooterData();
});
