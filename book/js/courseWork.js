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
  topicDifficulty: {
      sade: 10,
      cetin: 20,
    },
    pageCount: {
      qisa: 15, // 10 səhifəlik qısa işlər
      genis: 30, // 20-30 səhifəlik geniş işlər
    },
    researchLevel: {
      esas: 10,
      derin: 25,
    },
    presentation: {
      yox: 0, // Yalnız mətn
      var: 10, // PowerPoint ilə birgə
    },
    timeFactor: {
      standart: 5, // 2 həftə və ya daha çox
      tecili: 20, // Bir neçə gün ərzində
    },
    language: {
      azerbaycan: 5,
      ingilis: 10,
      rus: 8,
    },
    customization:{
      minimal: 10,
      derin:20,
    }

  };
  
  const calculateBtn = document.getElementById("calculate");
  const resultDiv = document.getElementById("result");
  const bookNowBtn = document.getElementById("bookNow");
  
  calculateBtn.addEventListener("click", function () {
    const fullName = document.getElementById("fullName").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const movzuCetinliyi = document.getElementById("topicDifficulty").value;
    const sehifeSayi = document.getElementById("pageCount").value;
    const tedqiqatSeviyyesi = document.getElementById("researchLevel").value;
    const teqdimat = document.getElementById("presentation").value;
    const vaxtFaktoru = document.getElementById("timeFactor").value;
    const dil = document.getElementById("language").value;
    const customization = document.getElementById("customization").value;
  
    // Validation to ensure all fields are filled
    if (
      !fullName ||
      !phoneNumber ||
      !movzuCetinliyi ||
      !sehifeSayi ||
      !tedqiqatSeviyyesi ||
      !teqdimat ||
      !vaxtFaktoru ||
      !dil ||
      !customization
    ) {
      resultDiv.textContent = "Zəhmət olmasa bütün məlumatları daxil edin.";
      resultDiv.style.color = "red";
      bookNowBtn.classList.add("hidden");
      return;
    }
  
    // Calculate total price
    const totalPrice =
      price.topicDifficulty[movzuCetinliyi] +
      price.pageCount[sehifeSayi] +
      price.researchLevel[tedqiqatSeviyyesi] +
      price.presentation[teqdimat] +
      price.timeFactor[vaxtFaktoru] +
      price.language[dil]+
      price.customization[customization];
  
    resultDiv.textContent = `Qiymət: ${totalPrice} AZN`;
    resultDiv.style.color = "green";
  
    bookNowBtn.classList.remove("hidden");
  });
  
  bookNowBtn.addEventListener("click", function () {
    const whatsappNumber = "+994516944256";
    const message = encodeURIComponent(`
      Salam, Mən ${document.getElementById("fullName").value}.
      Kurs işi hazırlatmaq istəyirəm:
      - Mövzunun Çətinliyi: ${document.getElementById("topicDifficulty").value}
      - Səhifə Sayı: ${document.getElementById("pageCount").value}
      - Tədqiqat Səviyyəsi: ${document.getElementById("researchLevel").value}
      - Təqdimat: ${document.getElementById("presentation").value}
      - Vaxt Faktoru: ${document.getElementById("timeFactor").value}
      - Dil: ${document.getElementById("language").value}
      - Fərdiləşdirmə Səviyyəsi: ${document.getElementById("customization").value}
      - Qiymət: ${document.getElementById("result").textContent.slice(8)}
      - Telefon Nömrəm: ${document.getElementById("phoneNumber").value}
    `);
    window.location.href = `https://wa.me/${whatsappNumber}?text=${message}`;
  });
  