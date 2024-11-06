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
