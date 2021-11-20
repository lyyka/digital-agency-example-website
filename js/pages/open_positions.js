document.querySelectorAll(".open-position-card").forEach(card => {
    card.addEventListener("click", function(e) {
        const descriptionContainer = card.querySelector(".open-position-card-content");
        if(descriptionContainer) {
            descriptionContainer.classList.toggle("visible");
        }
    });
});