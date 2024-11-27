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
  
    pageCount: {
      qisa: 15, // 10 səhifəlik qısa işlər
      uzun: 30, // 20-30 səhifəlik geniş işlər
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
      az: 5,
      ing: 10,
      rus: 8,
    },
    

  };
  
  const calculateBtn = document.getElementById("calculate");
  const resultDiv = document.getElementById("result");
  const bookNowBtn = document.getElementById("bookNow");
  
  calculateBtn.addEventListener("click", function () {
    const fullName = document.getElementById("fullName").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const sehifeSayi = document.getElementById("pageCount").value;
    const tedqiqatSeviyyesi = document.getElementById("researchLevel").value;
    const teqdimat = document.getElementById("presentation").value;
    const vaxtFaktoru = document.getElementById("timeFactor").value;
    const dil = document.getElementById("language").value;
  
    // Validation to ensure all fields are filled
    if (
      !fullName ||
      !phoneNumber ||
      !sehifeSayi ||
      !tedqiqatSeviyyesi ||
      !teqdimat ||
      !vaxtFaktoru ||
      !dil 
    ) {
      resultDiv.textContent = "Zəhmət olmasa bütün məlumatları daxil edin.";
      resultDiv.style.color = "red";
      bookNowBtn.classList.add("hidden");
      return;
    }
  
    // Calculate total price
    const totalPrice =
      price.pageCount[sehifeSayi] +
      price.researchLevel[tedqiqatSeviyyesi] +
      price.presentation[teqdimat] +
      price.timeFactor[vaxtFaktoru] +
      price.language[dil]

  
    resultDiv.textContent = `Qiymət: ${totalPrice} AZN`;
    resultDiv.style.color = "green";
  
    bookNowBtn.classList.remove("hidden");
  });
  
  bookNowBtn.addEventListener("click", function () {
    const whatsappNumber = "+994516944256";
    const message = encodeURIComponent(`
      Salam, Mən ${document.getElementById("fullName").value}.
      Kurs işi hazırlatmaq istəyirəm:
      - Səhifə Sayı: ${document.getElementById("pageCount").value}
      - Tədqiqat Səviyyəsi: ${document.getElementById("researchLevel").value}
      - Təqdimat: ${document.getElementById("presentation").value}
      - Vaxt Faktoru: ${document.getElementById("timeFactor").value}
      - Dil: ${document.getElementById("language").value}
      - Digər İstəklər: ${document.getElementById("others").value||"Yazılmayıb"}
      - Qiymət: ${document.getElementById("result").textContent.slice(8)}
      - Telefon Nömrəm: ${document.getElementById("phoneNumber").value}
    `);
    window.location.href = `https://wa.me/${whatsappNumber}?text=${message}`;
  });
  