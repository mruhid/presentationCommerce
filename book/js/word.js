
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

async function fetchWordData(sectionName) {
  try {
    const checkBackendUrl = await fetch(`${basePath}/src/src.json`);
    const backendConfig = await checkBackendUrl.json();

    const url = backendConfig.backend_url + "/word";

    const fetchUrl = backendConfig.action
      ? url
      : `${basePath}/json/forms/wordData.json`;

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
    data.companyName
      ? data.companyName + " | Book Word"
      : "Book Word"
  } `;
  // Change the favicon
  const favicon = document.getElementById("favicon");
  favicon.href = `${data.companyWebLogo || ""}`;
}
async function uploadModalText() {
  const data = await fetchWordData("modalText");
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

async function uploadWordForm() {
  const data = await fetchWordData();

  const form = document.querySelector("form");
  if (!form || !data || !data.fields) {
    console.error("Form or data fields not found.");
    return;
  }

  // Clear existing form content
  form.innerHTML = "";

  // Set the title
  const title = document.querySelector(".calculator h1");
  if (title && data.title) title.textContent = data.title;

  // Generate form fields
  data.fields.forEach((field) => {
    const formGroup = document.createElement("div");
    formGroup.classList.add("form-group");

    const label = document.createElement("label");
    label.setAttribute("for", field.id);
    label.textContent = field.label;

    formGroup.appendChild(label);

    if (["text", "tel", "number"].includes(field.type)) {
      const input = document.createElement("input");
      input.type = field.type;
      input.id = field.id;
      input.placeholder = field.placeholder || "";
      if (field.type === "number" && field.min) input.min = field.min;
      formGroup.appendChild(input);
    } else if (field.type === "select") {
      const select = document.createElement("select");
      select.id = field.id;

      if (field.options) {
        field.options.forEach((option) => {
          const optionElement = document.createElement("option");
          optionElement.value = option.value;
          optionElement.textContent = option.text;
          select.appendChild(optionElement);
        });
      }
      formGroup.appendChild(select);
    }

    form.appendChild(formGroup);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateHeader();
  uploadWordForm();
  uploadModalText();
  updateFooterData();
});

const priceData = async () => {
  const data = await fetchWordData("price");
  return data;
};

const getWhatsAppNumber = async () => {
  const data = await fetchWordData("wpNumber");
  return data;
};
// Price Configuration

  
  // Get DOM Elements
  const calculateBtn = document.getElementById("calculate");
  const resultDiv = document.getElementById("result");
  const bookNowBtn = document.getElementById("bookNow");
  
  // Calculate Button Click Event
  calculateBtn.addEventListener("click",async function () {
    const studentName = document.getElementById("studentName").value.trim();
    const topicName = document.getElementById("topicName").value.trim();
    const contactNumber = document.getElementById("contactNumber").value.trim();
    const quality = document.getElementById("quality").value;
    const language = document.getElementById("language").value;
    const slides = parseInt(document.getElementById("slides").value);
  const xidmetMuddeti = document.getElementById("deliveryTime").value;
  const price =await priceData();

  
    // Validation to ensure all fields are filled
        
    if (!xidmetMuddeti || !studentName || !topicName || !contactNumber || !quality || !language || isNaN(slides) || slides <= 0 ) {
      resultDiv.textContent = "Zəhmət olmasa bütün məlumatları düzgün daxil edin.";
      resultDiv.style.color = "red";
      bookNowBtn.classList.add("hidden");
      return;
    }
  
  
    // Check if all selections are valid keys in the price object
    if (!(quality in price.quality) || !(language in price.language) || !(xidmetMuddeti in price.xidmetMuddeti)) {
      resultDiv.textContent = "Xəta! Seçimlər düzgün deyil.";
      resultDiv.style.color = "red";
      bookNowBtn.classList.add("hidden");
      return;
    }
  
    // Calculate Total Price
    const totalPrice =
      price.quality[quality] +
      price.language[language] +
    price.xidmetMuddeti[xidmetMuddeti] +
      slides * price.pages;
  
    if (isNaN(totalPrice)) {
      resultDiv.textContent = "Qiymət hesablama zamanı xəta baş verdi.";
      resultDiv.style.color = "red";
      return;
    }
  
    resultDiv.textContent = `Qiymət: ${totalPrice.toFixed(2)} AZN`;
    resultDiv.style.color = "green";
  
    // Show "Book Now" button
    bookNowBtn.classList.remove("hidden");
  });
   
  // Book Now Button Click Event
  bookNowBtn.addEventListener("click", function () {
    const successModal = document.getElementById("successModal");
    const successMessage = document.getElementById("successMessage");
  
    successModal.style.display = "block";
  
    // Redirect to WhatsApp after a delay
    setTimeout(async() => {
      const whatsappNumber = await getWhatsAppNumber(); // Replace with your WhatsApp number
      const message = encodeURIComponent(`
        Salam, Mən ${document.getElementById("studentName").value}.
        Sərbəs iş(word) sifariş etmək istəyirəm:
        - Mövzu: ${document.getElementById("topicName").value}
        - Ədəbiyyat Keyfiyyət: ${document.getElementById("quality").value}
        - Çatdırılma Müddəti: ${document.getElementById("deliveryTime").value}
        - Dil: ${document.getElementById("language").value}
        - Word faylı səhifə sayı: ${document.getElementById("slides").value}
        - Digər İstəklər: ${document.getElementById("others").value||"Yazılmayıb"}
        - Qiymət: ${document.getElementById("result").textContent.slice(8)}
        - Telefon Nömrəm: ${document.getElementById("contactNumber").value}
      `);
      window.location.href = `${whatsappNumber}?text=${message}`;
    }, 2000); // 2-second delay
  });
  
  // Close Modal Event
  document.getElementById("closeModal").addEventListener("click", function () {
    document.getElementById("successModal").style.display = "none";
  });
  