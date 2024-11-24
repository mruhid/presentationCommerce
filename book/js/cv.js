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


const price = {
    cvType: {
      standard: 2,
      professional: 4,
    },
    serviceLevel: {
      simple: 2,
      full: 4,
    },
    experienceLevel: {
      graduate: 5,
      mid: 10,
      manager: 15,
    },
    duration: {
      urgent: 20,
      standard: 10,
    },
    language: {
      azerbaijani: 1,
      english: 4,
      russian: 4,
    },
  };
  
  const calculateBtn = document.getElementById("calculate");
  const resultDiv = document.getElementById("result");
  const bookNowBtn = document.getElementById("bookNow");
  
  calculateBtn.addEventListener("click", function () {
    const fullName = document.getElementById("fullName").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const cvType = document.getElementById("cvType").value;
    const serviceLevel = document.getElementById("serviceLevel").value;
    const experienceLevel = document.getElementById("experienceLevel").value;
    const duration = document.getElementById("duration").value;
    const language = document.getElementById("language").value;
  
    // Validation to ensure all fields are filled
    if (!fullName || !phoneNumber || !cvType || !serviceLevel || !experienceLevel || !duration || !language) {
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
    successMessage.textContent = "Sifarişiniz uğurla qəbul edildi!";
    successModal.style.display = "block";
  
   
    setTimeout(() => {
      const whatsappNumber = "+994516944256"; // Replace with your WhatsApp number
      const message = encodeURIComponent(`
              Salam, Mən ${document.getElementById("fullName").value}.
              CV xidmətindən istifadə etmək istəyirəm:
             -CV Tipi: ${document.getElementById("cvType").value}
             -Xidmət Səviyyəsi: ${document.getElementById("serviceLevel").value}
             -Təcrübə Səviyyəsi: ${document.getElementById("experienceLevel").value}
             -Müddət: ${document.getElementById("duration").value}
             -Dil: ${document.getElementById("language").value}
             -Qiymət: ${document.getElementById("result").textContent.slice(8)}
             -Telefon Nömrəm: ${document.getElementById("phoneNumber").value}
            `);
      window.location.href = `https://wa.me/${whatsappNumber}?text=${message}`;
    }, 2000); // 2-second delay
  });
  
  // Close modal when user clicks the close button
  closeModal.addEventListener("click", function () {
    successModal.style.display = "none";
  });

  