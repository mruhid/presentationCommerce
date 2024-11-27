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
   
    scope: {
        Standart: 3,
        Genişləndirilmiş: 6
    },
    research: {
        Ümumi: 1,
        Dərin: 3
    },
    projectType: {
        Teorik: 2,
        Praktiki: 4
    },
    design: {
        YalnızMətn: 1,
        Slaydlar: 3
    },
    timeframe: {
        Təcili: 5,
        Standart: 2
    },
    language: {
        az: 1,
        en: 4,
        ru: 3
    }
};

const calculateBtn = document.getElementById("calculate");
const resultDiv = document.getElementById("result");
const bookNowBtn = document.getElementById("bookNow");

calculateBtn.addEventListener("click", function () {
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

    // Validation to ensure all fields are filled
    if (!studentName ||!uniName || !topicName || !contactNumber  || !scope || !research || !projectType || !design || !timeframe || !language) {
        resultDiv.textContent = "Zəhmət olmasa bütün məlumatları daxil edin.";
        resultDiv.style.color = "red";
        bookNowBtn.classList.add("hidden");
        return;
    }

    // Debugging - log the values selected

    // Check if all selections are valid keys in the price object
    if ( !(scope in price.scope) || !(research in price.research) || !(projectType in price.projectType) || !(design in price.design) || !(timeframe in price.timeframe) || !(language in price.language)) {
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
    successMessage.textContent = "Sifarişiniz uğurla qəbul edildi!";
    successModal.style.display = "block";

    // Redirect to WhatsApp after a delay
    setTimeout(() => {
        const whatsappNumber = "+994516944256"; // Replace with your WhatsApp number
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
            -Digər İstəklər: ${document.getElementById("others").value||"Yazılmayıb"}
            -Qiymət: ${document.getElementById("result").textContent.slice(8)}
            -Telefon Nömrəm: ${document.getElementById("contactNumber").value}
        `);
        window.location.href = `https://wa.me/${whatsappNumber}?text=${message}`;
    }, 2000); // 2-second delay
});

// Close modal when user clicks the close button
document.getElementById("closeModal").addEventListener("click", function () {
    document.getElementById("successModal").style.display = "none";
});
