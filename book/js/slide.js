
// PC-menu color and scrool movement
const header = document.querySelector('.pc-menu');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

   
    
    lastScrollY = window.scrollY;
});

// Price Configuration
const price = {
    quality: {
      Zəif: 1,
      Orta: 2,
      Güclü: 3,
    },
    timeframe: {
      Təcili: 5,
      Standart: 2
  },
    language: {
      az: 1,
      eng: 3,
      rus: 2,
    },
    slides: 0.5, // Each slide adds a fixed price
  };
  
  // Get DOM Elements
  const calculateBtn = document.getElementById("calculate");
  const resultDiv = document.getElementById("result");
  const bookNowBtn = document.getElementById("bookNow");
  
  // Calculate Button Click Event
  calculateBtn.addEventListener("click", function () {
    const studentName = document.getElementById("studentName").value.trim();
    const topicName = document.getElementById("topicName").value.trim();
    const contactNumber = document.getElementById("contactNumber").value.trim();
    const quality = document.getElementById("quality").value;
    const timeframe = document.getElementById("timeframe").value;
    const language = document.getElementById("language").value;
    const slides = parseInt(document.getElementById("slides").value);
    const uniName = document.getElementById("uniName").value;

  
    // Validation to ensure all fields are filled
    if (!studentName|| !uniName || !timeframe || !topicName || !contactNumber || !quality || !language || isNaN(slides) || slides <= 0) {
      resultDiv.textContent = "Zəhmət olmasa bütün məlumatları düzgün daxil edin.";
      resultDiv.style.color = "red";
      bookNowBtn.classList.add("hidden");
      return;
    }
  
    
  
    // Check if all selections are valid keys in the price object
    if (!(quality in price.quality) || !(language in price.language) || !(timeframe in price.timeframe)) {
      resultDiv.textContent = "Xəta! Seçimlər düzgün deyil.";
      resultDiv.style.color = "red";
      bookNowBtn.classList.add("hidden");
      return;
    }
  
    // Calculate Total Price
    const totalPrice =
      price.quality[quality] +
      price.timeframe[timeframe] +
      price.language[language] +
      slides * price.slides;
  
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
  
    successMessage.textContent = "Sifarişiniz uğurla qəbul edildi!";
    successModal.style.display = "block";
  
    // Redirect to WhatsApp after a delay
    setTimeout(() => {
      const whatsappNumber = "+994516944256"; // Replace with your WhatsApp number
      const message = encodeURIComponent(`
        Salam, Mən ${document.getElementById("studentName").value}.
        Təqdimat sifariş etmək istəyirəm:
        - Mövzu: ${document.getElementById("topicName").value}
        -Universitet: ${document.getElementById("uniName").value}
        - Keyfiyyət: ${document.getElementById("quality").value}
        - Dil: ${document.getElementById("language").value}
        -Vaxt: ${document.getElementById("timeframe").value}
        - Slaydların sayı: ${document.getElementById("slides").value}
        -Digər İstəklər: ${document.getElementById("others").value||"Yazılmayıb"}
        - Qiymət: ${document.getElementById("result").textContent.slice(8)}
        - Telefon Nömrəm: ${document.getElementById("contactNumber").value}
      `);
      window.location.href = `https://wa.me/${whatsappNumber}?text=${message}`;
    }, 2000); // 2-second delay
  });
  
  // Close Modal Event
  document.getElementById("closeModal").addEventListener("click", function () {
    document.getElementById("successModal").style.display = "none";
  });
  