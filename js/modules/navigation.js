const button = document.querySelector("#open-menu");
button.addEventListener('click', (e) => {
    button.classList.toggle('active');
    const links = document.querySelector(".navigation-links");
    links.classList.toggle('active');
});