const scrollToTopButton = document.querySelector("#scroll-to-top-button");

scrollToTopButton.addEventListener('click', function() {
    document.documentElement.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

document.addEventListener('scroll', function() {
    const root = document.documentElement;
    const scrollTotal = root.scrollHeight - root.clientHeight;
    if ((root.scrollTop / scrollTotal ) > 0.10 ) {
        scrollToTopButton.classList.add("show");
    } else {
        scrollToTopButton.classList.remove("show");
    }
});