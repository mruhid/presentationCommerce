const header = document.querySelector(".pc-menu");
let lastScrollY = window.scrollY;
const basePath = "/presentationCommerce"
const githubProfile="https://github.com/mruhid"

window.addEventListener("scroll", () => {
  if (window.scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  lastScrollY = window.scrollY;
});

// Update functions for convert fetch data to html elements
async function fetchProfileData(sectionName) {
  try {
    const checkBackendUrl = await fetch(`${basePath}/src/src.json`);
    const backendConfig = await checkBackendUrl.json();

    const url = backendConfig.backend_url + "/profile";

    const fetchUrl = backendConfig.action ? url : `${basePath}/json/profileData.json`;

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

async function updateProfile() {
  // Fetching the profile data (replace with actual data fetching if needed)
  const data = await fetchProfileData("profile");

  const profileSection = document.querySelector(".profile");

  // Update Presentations
  const presentationsSection = profileSection.querySelector(".presentations");
  if(!data){
    return
  }
  presentationsSection.innerHTML = ""; // Clear existing presentations

  if (data.presentations.length === 0) {
    const noPresentationsMessage = document.createElement("p");
    noPresentationsMessage.textContent =
      "No presentations available in the database.";
    presentationsSection.appendChild(noPresentationsMessage);
  } else {
    data.presentations.forEach((presentation) => {
      const presentationLink = document.createElement("a");
      presentationLink.classList.add("presentation");
      const src1=`${githubProfile}${basePath}/raw/refs/heads/main/presentation/components/${presentation.link}`
      presentationLink.href = src1;
      presentationLink.title = presentation.altText;
      presentationLink.target = "_blank";

      const img = document.createElement("img");
      img.src = presentation.imageSrc;
      img.alt = presentation.altText;
      presentationLink.appendChild(img);

      presentationsSection.appendChild(presentationLink);
    });
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
    data.companyName ? data.companyName + " | Profile" : "Profile"
  } `;
  // Change the favicon
  const favicon = document.getElementById("favicon");
  favicon.href = `${data.companyWebLogo || ""}`;

  // Update Profile Picture
  const profileSection = document.querySelector(".profile");
  const profilePictureDiv = profileSection.querySelector(" .ProfilPicture a");
  const profileImage = profilePictureDiv.querySelector("img");
  profileImage.src = data.companyLogo;
  profileImage.alt = data.companyName;
  profilePictureDiv.href = "/about.html";

  // Update Name Section
  const nameSection = profileSection.querySelector(".name");
  const fullName = nameSection.querySelector("h2");
  fullName.textContent = data.fullName;
  const companyLink = nameSection.querySelector("a");
  const companyName = companyLink.querySelector("p");
  companyName.textContent ='@'+ data.companyName;
  companyLink.href = "/about.html";
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
  updateHeader();
  updateProfile();
  updateFooterData();
});
