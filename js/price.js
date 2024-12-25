// PC-menu color and scrool movement
const header = document.querySelector('.pc-menu');
let lastScrollY = window.scrollY;
const basePath = "/presentationCommerce"


window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }


    
    lastScrollY = window.scrollY;
});


async function fetchPriceData(sectionName) {
  try {
    const checkBackendUrl = await fetch(`${basePath}/src/src.json`);
    const backendConfig = await checkBackendUrl.json();

    const url = backendConfig.backend_url + "/price";

    const fetchUrl = backendConfig.action ? url : `${basePath}/json/priceData.json`;

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
    data.companyName ? data.companyName + " | Price" : "Price"
  } `;
  // Change the favicon
  const favicon = document.getElementById("favicon");
  favicon.href = `${data.companyWebLogo || ""}`;
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

async function updateDocumentSelection() {
  // Fetch data from the server or a local function
  const data = await fetchPriceData("documentSelection");
  // Select the document selection section
  const documentSelection = document.querySelector(".document-selection");
  if (!data.action) {
    documentSelection.style = "display:none";
    return;
  }

  // Update the title
  const titleElement = documentSelection.querySelector("h1");
  titleElement.textContent = data.title || "";

  // Update the description
  const descriptionElement = documentSelection.querySelector("p");
  descriptionElement.textContent = data.description || "";


}

async function updateOptionsSection() {
  const data = await fetchPriceData("options");
  
  const optionsContainer = document.querySelector(".options-container");
  optionsContainer.innerHTML = ""; // Clear existing options

  data.forEach(option => {
    const optionCard = document.createElement("a");
    if(!option.action){
      optionCard.style = "display:none";
    }
    optionCard.href = option.href || "#";
    optionCard.className = "option-card";

    // Add icon
    const iconElement = document.createElement("i");
    iconElement.className = option.iconClass || "fas fa-question-circle";
    optionCard.appendChild(iconElement);

    // Add title
    const title = document.createElement("h2");
    title.textContent = option.title || "Untitled";
    optionCard.appendChild(title);

    optionsContainer.appendChild(optionCard);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateHeader();
  updateDocumentSelection();
  updateOptionsSection();
  updateFooterData();
});
