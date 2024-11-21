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
      weak: 1,
      medium: 2,
      strong: 3,
    },
    language: {
      azerbaijan: 1,
      foreign: 2,
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
      resultDiv.textContent = "Please fill in all inputs.";
      resultDiv.style.color = "red"; // Highlight the error message
      bookNowBtn.classList.add("hidden"); // Hide the Book Now button
      return;
    }

    const totalPrice = (parseFloat(price.quality[quality]) + parseFloat(price.language[language])) * parseInt(slides, 10);
    resultDiv.textContent = `Price: ${totalPrice}`;
    resultDiv.style.color = "var(--color-primary)"; // Reset the color for a valid result

    bookNowBtn.classList.remove("hidden");
  });

  bookNowBtn.addEventListener("click", function () {
    const whatsappNumber = "+994516944256"; // Replace with your WhatsApp number in international format (e.g., 1234567890)
    const message = encodeURIComponent(`Salam . Mən təqdimat sifaris etmek isteyirəm:
        Slide sayı: ${document.getElementById("slides").value}
        Keyfiyyət: ${document.getElementById("quality").value}
        Dil: ${document.getElementById("language").value}
        Məbləğ: ${document.getElementById("result").textContent.slice(6)}
        `);
        console.log(message);
    window.location.href = `https://wa.me/${whatsappNumber}?text=${message}`;
  });
