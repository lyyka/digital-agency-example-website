const switchViewMode = (active) => {
    const notActive = active.parentNode.querySelector('.view-mode-switch:not(.active)');
    document.body.classList.toggle('is-dark');
    if(notActive) {
        active.classList.remove('active');
        notActive.classList.add('active');
        notActive.onclick = () => { switchViewMode(notActive); };
    }
};

const initiallyActive = document.querySelector('.view-mode-switch.active');
initiallyActive.onclick = () => { switchViewMode(initiallyActive); }