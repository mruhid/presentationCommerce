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
    quality: {
      Zəif: 1,
      Orta: 2,
      Güclü: 3,
    },
    language: {
      Azərbaycan: 1,
      Xarici: 2,
    },
  };

  const calculateBtn = document.getElementById("calculate");
  const resultDiv = document.getElementById("result");
  const bookNowBtn = document.getElementById("bookNow");

  calculateBtn.addEventListener("click", function () {
    const quality = document.getElementById("quality").value;
    const language = document.getElementById("language").value;
    const slides = document.getElementById("slides").value;
    console.log(quality, language, slides);

    // Validation to check if all fields are filled
    if (!quality || !language || !slides) {
      resultDiv.textContent = "Zəhmət olmasa bütün məlumatları daxil edin.";
      resultDiv.style.color = "red"; 
      bookNowBtn.classList.add("hidden"); 
      return;
    }

    const totalPrice = (parseFloat(price.quality[quality]) + parseFloat(price.language[language])) * parseInt(slides, 10);
    resultDiv.textContent = `Qiymət: ${totalPrice}AZN`;
    resultDiv.style.color = "var(--color-primary)"; 

    bookNowBtn.classList.remove("hidden");
  });

  bookNowBtn.addEventListener("click", function () {
    const whatsappNumber = "+994516944256"; 
    const message = encodeURIComponent(`Salam .
       Mən təqdimat sifaris etmek isteyirəm:
        Slide sayı: ${document.getElementById("slides").value}
        Keyfiyyət: ${document.getElementById("quality").value}
        Dil: ${document.getElementById("language").value}
        Məbləğ: ${document.getElementById("result").textContent.slice(6)}AZN
        `);
        console.log(message);
    window.location.href = `https://wa.me/${whatsappNumber}?text=${message}`;
  });
