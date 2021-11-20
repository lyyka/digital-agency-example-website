document.querySelector("#open-menu").addEventListener('click', (e) => {
    const links = document.querySelector(".navigation-links");
    links.classList.toggle('active');
});