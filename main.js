const mobilemenu = document.querySelector('.header__mainmobilenavmenu');
const navmenu = document.querySelector('.header__navcontainer')
const closemenu = document.querySelector('.header__navcontainernavclose')


mobilemenu.addEventListener("click", () => {
    navmenu.classList.toggle('mobileactive');
});

closemenu.addEventListener("click", () => {
    navmenu.classList.toggle('mobileactive');
});


//Funktion to download api, is provided in task 4 Specifikation ==> API: https://lernia-sjj-assignments.vercel.app/
async function getChallenges() {
    const res = await fetch('https://lernia-sjj-assignments.vercel.app/api/challenges');
    const data = await res.json();
    return data.challenges;
};


//unktion to create list challenges

function createChallengeLi(ch) {
    const {
        title,
        description,
        type,
        minParticipants,
        maxParticipants,
        rating = 0,
        image,
        labels = []
    } = ch;


    const full = Math.floor(Number(rating));
    const empty = 5 - full;
    const filledStars = '★ '.repeat(full).trim();
    const emptyStars = '☆'.repeat(empty);
    const typeText = type === 'onsite' ? '(on-site)' : '(networked)';

    const li = document.createElement('li');
    li.className = 'challenges__listItem';
    li.innerHTML = `
    <article class="challenge">
     <div class="challenge__imageWrapper">
      <img src="${image}" alt="${title}" class="challenge__image">


      <div class="challenge__details">
        <div class="challenge__rating" role="img" aria-label="${rating} of 5 stars">
          <span class="challenge__rating__filledstar">${filledStars}</span>
          <span class="challenge__rating__emptystar">${emptyStars}</span>
        </div>
        <h3 class="challenge__title">${title} ${typeText}</h3>
        <span class="challenge__size">${minParticipants}–${maxParticipants} participants</span>

        ${type === "online" ? `
          <span class="challenge__icon"> 
          <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 85.356 85.356" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path style="fill:#010002;" d="M77.45,57.695v-3.16V35.567V16.599c0-1.736-1.421-3.16-3.16-3.16H11.066 c-1.739,0-3.164,1.417-3.164,3.16v18.968v18.968v3.16L0,67.179c0,2.613,2.122,4.738,4.742,4.738h75.872 c2.616,0,4.742-2.126,4.742-4.738L77.45,57.695z M49.005,70.342H36.358c-0.437,0-0.791-0.351-0.791-0.791 c0-0.44,0.354-0.791,0.791-0.791h12.648c0.433,0,0.791,0.351,0.791,0.791C49.785,69.992,49.438,70.342,49.005,70.342z M29.647,67.182l2.412-2.895h21.233l2.416,2.895H29.647z M73.001,52.104c0,1.525-1.242,2.759-2.756,2.759H15.11 c-1.514,0-2.756-1.245-2.756-2.759V19.036c0-1.525,1.242-2.759,2.756-2.759h55.136c1.514,0,2.756,1.242,2.756,2.759 C73.001,19.036,73.001,52.104,73.001,52.104z"></path> </g> </g></svg>             
                ` : ""}</span>

        ${type === 'onsite' ? `
             
            <span class="challenge__icon"> <svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="94px" height="94px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#231F20" d="M62.79,29.172l-28-28C34.009,0.391,32.985,0,31.962,0s-2.047,0.391-2.828,1.172l-28,28 c-1.562,1.566-1.484,4.016,0.078,5.578c1.566,1.57,3.855,1.801,5.422,0.234L8,33.617V60c0,2.211,1.789,4,4,4h16V48h8v16h16 c2.211,0,4-1.789,4-4V33.695l1.195,1.195c1.562,1.562,3.949,1.422,5.516-0.141C64.274,33.188,64.356,30.734,62.79,29.172z"></path> </g></svg> `: ""}</span>
      </div>

      <p class="challenge__description">${description}</p>

      <!-- valfritt: visa etiketter om du har stil för dem--> 
      ${labels.length ? `<div class="challenge__labels">${labels.map(l => `<span class="tags">#${l}</span>`).join(' ')}</div>` : ''}
        
      <div class="challenge__buttonWrapper">
      <button class="challenge__bookbutton">
        ${type === 'onsite' ? 'Book this room' : 'Take challenge online'}
      </button>
      </div>
    </article>
  `;
    return li;
}

//Function to download cards for front site
const listElMain = document.getElementById('main-list');
const statusElMain = document.getElementById('main-status');

async function initMain() {
    try {
        statusElMain.textContent = 'Laddar…';
        const all = await getChallenges();
        const top3 = [...all].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 3);

        listElMain.innerHTML = '';
        top3.forEach(ch => listElMain.appendChild(createChallengeLi(ch)));
        statusElMain.textContent = '';
    } catch (e) {
        statusElMain.textContent = 'Kunde inte ladda data.';
        console.error(e);
    }
}


//Function to download cards for next site.
const listElAll = document.getElementById('all-list');
const statusElAll = document.getElementById('all-status');

async function initAll() {
    try {
        statusElAll.textContent = 'Laddar alla utmaningar...';

        const all = await getChallenges();
        const sorted = [...all].sort(
            (a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 15);

        listElAll.innerHTML = '';
        sorted.forEach(ch => {
            listElAll.appendChild(createChallengeLi(ch));
        });


        statusElAll.textContent = '';
    } catch (e) {
        statusElAll.textContent = 'Kunde inte ladda data: ' + e.message;
        console.error(e);
    }
}
if (listElMain && statusElMain) {
    initMain();
}

if (listElAll && statusElAll) {
    initAll();
}


//Filter function open and close
function openFilter() {
    const contentDiv = document.querySelector("#loadFilter");
    const openBtn = document.querySelector(".filterBtn");

    contentDiv.style.display = 'block';
    openBtn.style.display = 'none';
}

function closeFilter() {
    const contentDiv = document.querySelector("#loadFilter");
    const openBtn = document.querySelector(".filterBtn");

    contentDiv.style.display = 'none';
    openBtn.style.display = 'block';
}
