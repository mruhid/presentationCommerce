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
    mektubMaqsedi: {
      is: 10,
      teqaud: 15,
      akademik: 20,
    },
    ferdiSeviyye: {
      umumi: 5,
      ferdi: 10,
    },
    sektorNovu: {
      sade: 5,
      reqabet: 15,
    },
    xidmetMuddeti: {
      tecili: 20,
      standart: 10,
    },
    dil: {
      azerbaycan: 1,
      ingilis: 4,
      rus: 4,
    },
  };
  
  
  const calculateBtn = document.getElementById("calculate");
  const resultDiv = document.getElementById("result");
  const bookNowBtn = document.getElementById("bookNow");
  
  calculateBtn.addEventListener("click", function () {
    const fullName = document.getElementById("fullName").value;
  const phoneNumber = document.getElementById("phoneNumber").value;
  const letterSubject = document.getElementById("letterSubject").value;
  const mektubMaqsedi = document.getElementById("letterPurpose").value;
  const ferdiSeviyye = document.getElementById("customizationLevel").value;
  const sektorNovu = document.getElementById("sectorType").value;
  const xidmetMuddeti = document.getElementById("deliveryTime").value;
  const dil = document.getElementById("language").value;
  
    // Validation to ensure all fields are filled
    if (
        !fullName ||
        !phoneNumber ||
        !letterSubject ||
        !mektubMaqsedi ||
        !ferdiSeviyye ||
        !sektorNovu ||
        !xidmetMuddeti ||
        !dil
      ) {
      resultDiv.textContent = "Zəhmət olmasa bütün məlumatları daxil edin.";
      resultDiv.style.color = "red";
      bookNowBtn.classList.add("hidden");
      return;
    }
  
    // Calculate total price
    const totalPrice =
    price.mektubMaqsedi[mektubMaqsedi] +
    price.ferdiSeviyye[ferdiSeviyye] +
    price.sektorNovu[sektorNovu] +
    price.xidmetMuddeti[xidmetMuddeti] +
    price.dil[dil];

  
    resultDiv.textContent = `Qiymət: ${totalPrice} AZN`;
    resultDiv.style.color = "green";
  
    bookNowBtn.classList.remove("hidden");
  });
  
  bookNowBtn.addEventListener("click", function () {
    successMessage.textContent = "Sifarişiniz uğurla qəbul edildi!";
    successModal.style.display = "block";
  
    setTimeout(() => {
      const whatsappNumber = "+994516944256"; 
      const message = encodeURIComponent(`
        Salam, Mən ${document.getElementById("fullName").value}.
        Cover Letter xidmətindən istifadə etmək istəyirəm:
        - Məktub Mövzusu: ${document.getElementById("letterSubject").value}
        - Məqsəd: ${document.getElementById("letterPurpose").value}
        - Fərdiləşdirmə Səviyyəsi: ${document.getElementById("customizationLevel").value}
        - Sektor Növü: ${document.getElementById("sectorType").value}
        - Çatdırılma Müddəti: ${document.getElementById("deliveryTime").value}
        - Dil: ${document.getElementById("language").value}
        - Qiymət: ${document.getElementById("result").textContent.slice(8)}
        - Telefon Nömrəm: ${document.getElementById("phoneNumber").value}
      `);
      window.location.href = `https://wa.me/${whatsappNumber}?text=${message}`;
    }, 2000); // 2-second delay
  });
  
  closeModal.addEventListener("click", function () {
    successModal.style.display = "none";
  });
  