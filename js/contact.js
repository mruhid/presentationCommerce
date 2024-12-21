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
// Page Uploading Functions

async function fetchContactData(sectionName) {
    try {
      const checkBackendUrl = await fetch(`${basePath}/src/src.json`);
      const backendConfig = await checkBackendUrl.json();
  
      const url = backendConfig.backend_url + "/contact";
  
      const fetchUrl = backendConfig.action ? url : `${basePath}/json/contactData.json`;
  
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
      data.companyName ? data.companyName + " | Contact" : "Contact"
    } `;
    // Change the favicon
    const favicon = document.getElementById("favicon");
    favicon.href = `${data.companyWebLogo || ""}`;
  }

  async function updateContactSection() {
    // Fetch the data (this is just a placeholder, replace with actual fetch if needed)
    const data = await fetchContactData("contactPage");
    const contactPage = document.querySelector(".contact-page");
  
    // If action is false, hide the contact page
    if (!data.action) {
      contactPage.style.display = "none";
    }
  
    // Update header
    const header = contactPage.querySelector("h1");
    header.textContent = data.header || "";
  
    // Update description
    const description = contactPage.querySelector("p");
    description.textContent = data.description || "";
  
    // Update social links
    const socialLinksContainer = contactPage.querySelector(".social-links");
    socialLinksContainer.innerHTML = ""; // Clear existing social links
  
    data.socialLinks.forEach(link => {
      const socialLink = document.createElement("a");
      socialLink.href = link.url;
      socialLink.target = "_blank";
      socialLink.classList.add("social-icon", link.platform.toLowerCase());
  
      const icon = document.createElement("i");
      icon.classList.add(...link.iconClass.split(" "));
      socialLink.appendChild(icon);
      
      socialLink.innerHTML += ` ${link.platform}`;
      socialLinksContainer.appendChild(socialLink);
    });
  }
  
  // Example of how the fetchContactPageData function might look
  async function fetchContactPageData(page) {
    const response = await fetch(`./data/${page}.json`);
    const data = await response.json();
    return data;
  }
  


  async function updateGoFormSection() {
    // Fetch the data (this is just a placeholder, replace with actual fetch if needed)
    const data = await fetchContactData("goForm");
    const goFormSection = document.querySelector(".go-form");
  
    // If action is false, hide the go form section
    if (!data.action) {
      goFormSection.style.display = "none";
    }
  
    // Update the header of the go form section
    const header = goFormSection.querySelector("h1");
    header.textContent = data.title || "";
  
    // Update the button text
    const button = goFormSection.querySelector("button span");
    button.textContent = data.buttonText || "";
  
    // Update the button link
    const buttonLink = goFormSection.querySelector("button a");
    buttonLink.href = data.buttonSrc || "";
  
    // Update the button icon
    const buttonIcon = goFormSection.querySelector("button i");
    buttonIcon.className = data.iconClass || "fas fa-arrow-right";
  }
  
  // Example of how the fetchGoFormData function might look
  
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
    updateHeader();
    updateContactSection();
    updateGoFormSection();
    updateFooterData();
  });