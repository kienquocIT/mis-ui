function applyTheme(theme) {
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(`theme-${theme}`);
    document.querySelector('.hk-wrapper').setAttribute('data-menu', theme)
    document.querySelector('#dark_mode_btn').checked = theme === 'dark'
}

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);

   const btnElm = document.querySelector('#dark_mode_btn')
   btnElm.addEventListener("change", function (evt) {
       const isCheck = evt.target.checked
       localStorage.setItem("theme", isCheck ? 'dark' : 'light')
       applyTheme(isCheck ? 'dark' : 'light');
   });
});