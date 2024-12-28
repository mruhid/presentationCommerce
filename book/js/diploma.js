// PC-menu color and scrool movement
const header = document.querySelector(".pc-menu");
let lastScrollY = window.scrollY;
const basePath = "/presentationCommerce";

window.addEventListener("scroll", () => {
  if (window.scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  lastScrollY = window.scrollY;
});

async function fetchDiplomaData(sectionName) {
  try {
    const checkBackendUrl = await fetch(`${basePath}/src/src.json`);
    const backendConfig = await checkBackendUrl.json();

    const url = backendConfig.backend_url + "/forms/diploma";

    const fetchUrl = backendConfig.action
      ? url
      : `${basePath}/json/forms/diplomaData.json`;

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
      ? data.companyName + " | Book DiplomaWork"
      : "Book DiplomaWork"
  } `;
  // Change the favicon
  const favicon = document.getElementById("favicon");
  favicon.href = `${data.companyWebLogo || ""}`;
}

async function uploadModalText() {
  const data = await fetchDiplomaData("modalText");
  const modalText = document.querySelector("#successMessage");
  modalText.innerHTML = data;
}

async function uploadDiplomaForm() {
  const data = await fetchDiplomaData();
  const form = document.querySelector("form");

  if (!form || !data.fields) {
    console.error("Form or data fields not found.");
    return;
  }

  // Clear existing form content
  form.innerHTML = " ";

  // Set the form title
  const title = document.querySelector("#pageTitle");
  if (title) {
    title.textContent = data.title;
  }

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
  uploadDiplomaForm();
  uploadModalText();
  updateFooterData();
});

const priceData = async () => {
  const data = await fetchDiplomaData("price");
  return data;
};

const getWhatsAppNumber = async () => {
  const data = await fetchDiplomaData("wpNumber");
  return data;
};
async function sendFormData(data) {
  try {
    const configResponse = await fetch(`${basePath}/src/src.json`); // Adjust path as needed
    if (!configResponse.ok) {
      throw new Error(
        `Failed to fetch config file. Status: ${configResponse.status}`
      );
    }

    const config = await configResponse.json();

    // Determine the data source (backend or fallback JSON)
    const fetchUrl = config.action && `${config.backend_url}/books`; // Adjust path as needed

    if (!config.action) {
      console.log("backend server or forms data not aviable yet");
      return;
    }

    const response = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to save book data");
    }

    const result = await response.json();
    console.log("Data saved successfully:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

const calculateBtn = document.getElementById("calculate");
const resultDiv = document.getElementById("result");
const bookNowBtn = document.getElementById("bookNow");

calculateBtn.addEventListener("click", async function () {
  const studentName = document.getElementById("studentName").value;
  const topicName = document.getElementById("topicName").value;
  const contactNumber = document.getElementById("contactNumber").value;
  const scope = document.getElementById("scope").value;
  const research = document.getElementById("research").value;
  const projectType = document.getElementById("projectType").value;
  const design = document.getElementById("design").value;
  const timeframe = document.getElementById("timeframe").value;
  const language = document.getElementById("language").value;
  const uniName = document.getElementById("uniName").value;
  const price = await priceData();

  // Validation to ensure all fields are filled
  if (
    !studentName ||
    !uniName ||
    !topicName ||
    !contactNumber ||
    !scope ||
    !research ||
    !projectType ||
    !design ||
    !timeframe ||
    !language
  ) {
    resultDiv.textContent = "Zəhmət olmasa bütün məlumatları daxil edin.";
    resultDiv.style.color = "red";
    bookNowBtn.classList.add("hidden");
    return;
  }

  // Debugging - log the values selected

  // Check if all selections are valid keys in the price object
  if (
    !(scope in price.scope) ||
    !(research in price.research) ||
    !(projectType in price.projectType) ||
    !(design in price.design) ||
    !(timeframe in price.timeframe) ||
    !(language in price.language)
  ) {
    resultDiv.textContent = "Xəta! Seçimlər düzgün deyil.";
    resultDiv.style.color = "red";
    bookNowBtn.classList.add("hidden");
    return;
  }

  // Calculate total price
  const totalPrice =
    price.scope[scope] +
    price.research[research] +
    price.projectType[projectType] +
    price.design[design] +
    price.timeframe[timeframe] +
    price.language[language];

  if (isNaN(totalPrice)) {
    resultDiv.textContent = "Qiymət hesablama zamanı xəta baş verdi.";
    resultDiv.style.color = "red";
    return;
  }

  resultDiv.textContent = `Qiymət: ${totalPrice} AZN`;
  resultDiv.style.color = "green";

  // Show "Book Now" button
  bookNowBtn.classList.remove("hidden");
});

bookNowBtn.addEventListener("click", function () {
  // Show success message modal
  const successModal = document.getElementById("successModal");
  const successMessage = document.getElementById("successMessage");
  successModal.style.display = "block";

  // Redirect to WhatsApp after a delay
  setTimeout(async () => {
    const whatsappNumber = await fetchDiplomaData("wpNumber");
    const data = {
      type: "diploma",
      data: {
        fullName: document.getElementById("studentName").value,
        phoneNumber: document.getElementById("contactNumber").value,
        topicName: document.getElementById("topicName").value,
        uniName: document.getElementById("uniName").value,
        scope: document.getElementById("scope").value,
        research: document.getElementById("research").value,
        projectType: document.getElementById("projectType").value,
        design: document.getElementById("design").value,
        timeframe: document.getElementById("timeframe").value,
        language: document.getElementById("language").value,
        others: document.getElementById("others").value,
      },
      price: parseFloat(document.getElementById("result").textContent.slice(8)), // Convert price to Decimal
    };

    await sendFormData(data);
    // Replace with your WhatsApp number
    const message = encodeURIComponent(`
            Salam, Mən ${document.getElementById("studentName").value}.
            Diplom işi sifariş etmək istəyirəm:
            -Mövzu: ${document.getElementById("topicName").value}
            -Universitet: ${document.getElementById("uniName").value}
            -İş Həcmi: ${document.getElementById("scope").value}
            -Araşdırma: ${document.getElementById("research").value}
            -Tədqiqat Növü: ${document.getElementById("projectType").value}
            -Dizayn: ${document.getElementById("design").value}
            -Vaxt: ${document.getElementById("timeframe").value}
            -Dil: ${document.getElementById("language").value}
            -Digər İstəklər: ${
              document.getElementById("others").value || "Yazılmayıb"
            }
            -Qiymət: ${document.getElementById("result").textContent.slice(8)}
            -Telefon Nömrəm: ${document.getElementById("contactNumber").value}
        `);
    window.location.href = `${whatsappNumber}?text=${message}`;
  }, 2000); // 2-second delay
});

// Close modal when user clicks the close button
document.getElementById("closeModal").addEventListener("click", function () {
  document.getElementById("successModal").style.display = "none";
});
