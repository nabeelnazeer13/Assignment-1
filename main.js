const mobilemenu = document.querySelector('.header__mainmobilenavmenu');
const navmenu = document.querySelector('.header__navcontainer')
const closemenu = document.querySelector('.header__navcontainernavclose')


mobilemenu.addEventListener("click", () => {
    navmenu.classList.toggle('mobileactive'); });

closemenu.addEventListener("click", () => {
    navmenu.classList.toggle('mobileactive'); });


    const BASE_URL = 'https://lernia-sjj-assignments.vercel.app/api';