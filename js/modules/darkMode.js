function setCookie(name,value) {
    document.cookie = name + "=" + (value || "")  + "; path=/";
}

function getCookie(name) {
    const nameWithEq = name + "=";
    const allCookies = document.cookie.split(';');
    for(let i=0;i < allCookies.length;i++) {
        const currentCookie = allCookies[i];
        while (currentCookie.charAt(0)==' ') currentCookie = currentCookie.substring(1,c.length);
        if (currentCookie.indexOf(nameWithEq) == 0) return currentCookie.substring(nameWithEq.length,currentCookie.length);
    }
    return null;
}

const switchViewMode = (active) => {
    if(active) {
        const notActive = active.parentNode.querySelector('.view-mode-switch:not(.active)');
        document.body.classList.toggle('is-dark');
        setCookie('dark-mode-on', document.body.classList.contains('is-dark'));
        if(notActive) {
            active.classList.remove('active');
            notActive.classList.add('active');
            notActive.onclick = () => { switchViewMode(notActive); };
        }
    }
};

const initiallyActive = document.querySelector('.view-mode-switch.active');
if(initiallyActive) {
    initiallyActive.onclick = () => { switchViewMode(initiallyActive); }

    window.addEventListener('load', (event) => {
        const isDark = getCookie('dark-mode-on');
        if(isDark) {
            switchViewMode(document.querySelector('.view-mode-switch.active'));        
        }
    });
}