// PC-menu color and scrool movement
const header = document.querySelector(".pc-menu");
const heroSection = document.querySelector(".hero-section");
let lastScrollY = window.scrollY;
const basePath = "/presentationCommerce"


window.addEventListener("scroll", () => {
  if (window.scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
  if (window.scrollY > heroBottom) {
    header.classList.add("bg-change");
  } else {
    header.classList.remove("bg-change");
  }

  lastScrollY = window.scrollY;
});

// Page Uploading Functions

async function fetchHomeData(sectionName) {
  try {
    
    const checkBackendUrl =await fetch(`${basePath}/src/src.json`)
    const backendConfig = await checkBackendUrl.json();

    const url = backendConfig.backend_url + "/home";

    const fetchUrl = backendConfig.action ? url : `${basePath}/json/homePageData.json`;

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
    await fetch(`${basePath}/src/src.json`)
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
    data.companyName ? data.companyName + " | Home" : "Home"
  } `;
  // Change the favicon
  const favicon = document.getElementById("favicon");
  favicon.href = `${data.companyWebLogo || ""}`;
}

async function updateHeroSection() {
  const data = await fetchHomeData("heroSection");
  const heroSection = document.querySelector(".hero-section");

  if (!data.action) {
    heroSection.style = "display:none";
  }
  const subtitle = heroSection.querySelector(".subtitle");
  subtitle.textContent = data.subtitle;

  // Update title
  const title = heroSection.querySelector(".title");
  title.innerHTML = data.title || "Loading...";

  // Update description
  const description = heroSection.querySelector(".description");
  description.textContent = data.description || "";

  // Update "Sifariş ver" button
  const orderButton = heroSection.querySelector(".button");

  if (data.buttonText) {
    orderButton.textContent = data.buttonText || "...";
    orderButton.href = data.buttonSrc || "#";
  }

  // Update contact info
  const contactInfos = heroSection.querySelectorAll(".contact-info");
  if (contactInfos.length > 0) {
    data.contactInfo.forEach((contact, index) => {
      if (contactInfos[index]) {
        const icon = contactInfos[index].querySelector(".call-icon i");
        const label = contactInfos[index].querySelector(".call p");
        const link = contactInfos[index].querySelector(".call a");

        // Update icon
        if (icon) {
          icon.className = contact.iconClass;
          if (contact.iconStyle) {
            icon.style = contact.iconStyle;
          } else {
            icon.removeAttribute("style");
          }
        }

        if (label) label.textContent = contact.label || "";
        if (link) {
          link.textContent = contact.value || "";
          link.href = contact.link || "#";
        }
      }
    });
  }

  if (data.backgroundImg) {
    heroSection.style.backgroundImage = `url(${data.backgroundImg})`;
  }
}

async function updateOperationsSection() {
  const data = await fetchHomeData("operationsSection");
  const operationsSection = document.querySelector(".operations");

  if (!data.action) {
    operationsSection.style = "display:none";
    return;
  }

  // Update the title
  const sectionTitle = operationsSection.querySelector("h1");
  sectionTitle.textContent = data.title || "";

  // Update the description
  const sectionDescription = operationsSection.querySelector("h3");
  sectionDescription.textContent = data.description || "";

  // Get the operations list container
  const operationsList = operationsSection.querySelector(".operation-items");

  // Clear any existing list items (if necessary)
  operationsList.innerHTML = "";

  // Populate the operations
  data.operations
    .sort((a, b) => a.place - b.place)
    .forEach((operation) => {
      const operationItem = document.createElement("li");
      operationItem.innerHTML = `
      <a href="${operation.link}">
        <div class="operation-icon">
          <div class="down"><i class="${operation.iconClass}"></i></div>
          <div><i class="fas fa-chevron-down"></i></div>
        </div>
        <h3>${operation.title}</h3>
        <p>${operation.description}</p>
      </a>
    `;

      operationsList.appendChild(operationItem);
    });
}

async function updateWhyUsSection() {
  const data = await fetchHomeData("whyUsSection");
  const whyUsSection = document.querySelector(".why-us");
  if (!data.action) {
    whyUsSection.style = "display:none";
    return;
  }
  // Update the title
  const sectionTitle = whyUsSection.querySelector("h1");
  sectionTitle.textContent = data.title || "";

  // Get the container for the features
  const container = whyUsSection.querySelector(".container");

  // Clear existing content in the container
  container.innerHTML = "";

  // Loop through the features and create the HTML dynamically
  data.features.forEach((feature, index) => {
    // Create a new div for each feature
    const featureDiv = document.createElement("div");
    featureDiv.classList.add((index + 2) % 2 == 0 ? "one" : "two"); // Add the class 'one' for the first item and 'two' for the second item

    // Insert the HTML content for each feature
    featureDiv.innerHTML = `
      ${
        (index + 2) % 2 == 0
          ? `<h1>${feature.title}</h1>`
          : `<div><img src="${feature.image}" alt="why-us"></div>`
      }
      <p>${feature.description}</p>
      ${
        (index + 2) % 2 !== 0
          ? `<h1>${feature.title}</h1>`
          : `<div><img src="${feature.image}" alt="why-us"></div>`
      }

    `;

    // Append the feature div to the container
    container.appendChild(featureDiv);
  });
}

async function updateSocialSection() {
  const data = await fetchHomeData("socialSection");
  const socialSection = document.querySelector(".social");
  if (!data.action) {
    socialSection.style = "display:none";
    return;
  }
  // Update the title
  const sectionTitle = socialSection.querySelector("h1");
  sectionTitle.textContent = data.title || "";

  // Get the container for the social media links
  const socialMediaContainer = socialSection.querySelector(".social-media");

  // Clear any existing social media links before adding new ones
  socialMediaContainer.innerHTML = "";

  // Loop through the social media links and create the HTML dynamically
  data.links
    .sort((a, b) => a.place - b.place)
    .forEach((link) => {
      // Create a new div for each social media platform
      const platformDiv = document.createElement("div");
      platformDiv.classList.add(link.platform.toLowerCase()); // Add class based on the platform (e.g., 'instagram', 'facebook')

      // Create the anchor tag and the icon inside the div
      platformDiv.innerHTML = `
      <a href="${link.link}" target="_blank">
        <i class="${link.iconClass}"></i>
      </a>
    `;

      // Append the platform div to the social media container
      socialMediaContainer.appendChild(platformDiv);
    });
}

async function updateGoFormSection() {
  const data = await fetchHomeData("goFormSection");
  const goFormSection = document.querySelector(".go-form");
  if (!data.action) {
    goFormSection.style = "display:none";
    return;
  }

  // Update the title
  const sectionTitle = goFormSection.querySelector("h1");
  sectionTitle.textContent = data.title || "";

  const buttonContainer = goFormSection.querySelector("div");

  buttonContainer.innerHTML = "";

  const button = document.createElement("button");
  const anchor = document.createElement("a");
  anchor.href = data.buttonSrc || "Sifariş ver";

  const span = document.createElement("span");
  span.textContent = data.buttonText;
  const icon = document.createElement("i");
  icon.className = data.iconClass;

  anchor.appendChild(span);
  anchor.appendChild(icon);

  button.appendChild(anchor);

  buttonContainer.appendChild(button);
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
  updateHeroSection();
  updateHeader();
  updateOperationsSection();
  updateWhyUsSection();
  updateSocialSection();
  updateGoFormSection();
  updateFooterData();
});
