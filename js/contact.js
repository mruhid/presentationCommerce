// PC-menu color and scrool movement
const header = document.querySelector('.pc-menu');
const heroSection = document.querySelector('.box1');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
    if (window.scrollY > heroBottom) {
        header.classList.add('bg-change');
    } else {
        header.classList.remove('bg-change');
    }
    
    lastScrollY = window.scrollY;
});
