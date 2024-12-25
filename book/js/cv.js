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

async function fetchCVData(sectionName) {
  try {
    const checkBackendUrl = await fetch(`${basePath}/src/src.json`);
    const backendConfig = await checkBackendUrl.json();

    const url = backendConfig.backend_url + "/cv";

    const fetchUrl = backendConfig.action ? url : `${basePath}/json/forms/cvFormData.json`;

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
    if (!sectionName) {
      return data;
    }

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
    data.companyName ? data.companyName + " | Book CV" : "Book CV"
  } `;
  // Change the favicon
  const favicon = document.getElementById("favicon");
  favicon.href = `${data.companyWebLogo || ""}`;
}
async function uploadCVForm() {
  const data = await fetchCVData("");
  const form = document.querySelector("form");

  if (!form || !data.fields) {
    console.error("Form or data fields not found.");
    return;
  }

  // Clear existing form content
  form.innerHTML = "";

  // Set the title
  const title = document.querySelector(".calculator h1");
  if (title) title.textContent = data.title;

  // Generate form fields
  data.fields.forEach((field) => {
    const formGroup = document.createElement("div");
    formGroup.classList.add("form-group");

    const label = document.createElement("label");
    label.setAttribute("for", field.id);
    label.textContent = field.label;

    formGroup.appendChild(label);

    if (field.type === "text" || field.type === "tel") {
      const input = document.createElement("input");
      input.type = field.type;
      input.id = field.id;
      input.placeholder = field.placeholder;
      formGroup.appendChild(input);
    } else if (field.type === "select" && field.options) {
      const select = document.createElement("select");
      select.id = field.id;

      field.options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        select.appendChild(optionElement);
      });

      formGroup.appendChild(select);
    }

    form.appendChild(formGroup);
  });
}

async function uploadModalText() {
  const data = await fetchCVData("modalText");
  const modalText = document.querySelector("#successMessage");
  modalText.innerHTML = data;
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
  uploadCVForm();
  uploadModalText();
  updateFooterData();
});

const priceData = async () => {
  const data = await fetchCVData("price");
  return data;
};

const getWhatsAppNumber = async () => {
  const data = await fetchCVData("wpNumber");
  return data;
};
const calculateBtn = document.getElementById("calculate");
const resultDiv = document.getElementById("result");
const bookNowBtn = document.getElementById("bookNow");

calculateBtn.addEventListener("click", async function () {
  const fullName = document.getElementById("fullName").value;
  const phoneNumber = document.getElementById("phoneNumber").value;
  const cvType = document.getElementById("cvType").value;
  const serviceLevel = document.getElementById("serviceLevel").value;
  const experienceLevel = document.getElementById("experienceLevel").value;
  const duration = document.getElementById("duration").value;
  const language = document.getElementById("language").value;
  const price = await priceData();
  // Validation to ensure all fields are filled
  if (
    !fullName ||
    !phoneNumber ||
    !cvType ||
    !serviceLevel ||
    !experienceLevel ||
    !duration ||
    !language
  ) {
    resultDiv.textContent = "Zəhmət olmasa bütün məlumatları daxil edin.";
    resultDiv.style.color = "red";
    bookNowBtn.classList.add("hidden");
    return;
  }

  // Calculate total price
  const totalPrice =
    price.cvType[cvType] +
    price.serviceLevel[serviceLevel] +
    price.experienceLevel[experienceLevel] +
    price.duration[duration] +
    price.language[language];

  resultDiv.textContent = `Qiymət: ${totalPrice} AZN`;
  resultDiv.style.color = "green";

  // Show "Book Now" button
  bookNowBtn.classList.remove("hidden");
});

bookNowBtn.addEventListener("click", function () {
  // Show success message modal
  successModal.style.display = "block";

  setTimeout(async () => {
    const whatsappNumber = await getWhatsAppNumber(); // Replace with your WhatsApp number
    const message = encodeURIComponent(`
              Salam, Mən ${document.getElementById("fullName").value}.
              CV xidmətindən istifadə etmək istəyirəm:
             -CV Tipi: ${document.getElementById("cvType").value}
             -Xidmət Səviyyəsi: ${document.getElementById("serviceLevel").value}
             -Təcrübə Səviyyəsi: ${
               document.getElementById("experienceLevel").value
             }
             -Müddət: ${document.getElementById("duration").value}
             -Dil: ${document.getElementById("language").value}
             -Qiymət: ${document.getElementById("result").textContent.slice(8)}
             -Digər İstəklər: ${
               document.getElementById("others").value || "Yazılmayıb"
             }
             -Telefon Nömrəm: ${document.getElementById("phoneNumber").value}
            `);
    window.location.href = `${whatsappNumber}?text=${message}`;
  }, 2000); // 2-second delay
});

// Close modal when user clicks the close button
closeModal.addEventListener("click", function () {
  successModal.style.display = "none";
});
