const mobilemenu = document.querySelector('.header__mainmobilenavmenu');
const navmenu = document.querySelector('.header__navcontainer')
const closemenu = document.querySelector('.header__navcontainernavclose')

//Open and close mobilemenu
mobilemenu.addEventListener("click", () => {
    navmenu.classList.toggle('mobileactive');
});

closemenu.addEventListener("click", () => {
    navmenu.classList.toggle('mobileactive');
});


//Funktion to download api, is provided in task 4 Specifikation ==> API: https://lernia-sjj-assignments.vercel.app/
export async function getChallenges() {
    try {
        const res = await fetch('https://lernia-sjj-assignments.vercel.app/api/challenges');

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        return data.challenges;

    } catch (err) {
        console.error("Failed to fetch challenges:", err);

        const statusElAll = document.querySelector('#all-status');
        if (statusElAll) {
            statusElAll.textContent = 'Faild to fetch challenges, try again later!';
        }

        return [];
    }
};



//function to create list challenges
export function createChallengeLi(ch) {
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

    //Creates a li-element to hold a challenge and assigns a CSS class for styling the list
    const li = document.createElement('li');
    li.className = 'challenges__listItem';
    
    //Fill the <li>-element with the HTML structure for a challenge
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

<!--Shows a specific icon if the type is online/onsite-->
        ${type === "online" ? `
          <span class="challenge__icon"> 
          <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 85.356 85.356" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path style="fill:#010002;" d="M77.45,57.695v-3.16V35.567V16.599c0-1.736-1.421-3.16-3.16-3.16H11.066 c-1.739,0-3.164,1.417-3.164,3.16v18.968v18.968v3.16L0,67.179c0,2.613,2.122,4.738,4.742,4.738h75.872 c2.616,0,4.742-2.126,4.742-4.738L77.45,57.695z M49.005,70.342H36.358c-0.437,0-0.791-0.351-0.791-0.791 c0-0.44,0.354-0.791,0.791-0.791h12.648c0.433,0,0.791,0.351,0.791,0.791C49.785,69.992,49.438,70.342,49.005,70.342z M29.647,67.182l2.412-2.895h21.233l2.416,2.895H29.647z M73.001,52.104c0,1.525-1.242,2.759-2.756,2.759H15.11 c-1.514,0-2.756-1.245-2.756-2.759V19.036c0-1.525,1.242-2.759,2.756-2.759h55.136c1.514,0,2.756,1.242,2.756,2.759 C73.001,19.036,73.001,52.104,73.001,52.104z"></path> </g> </g></svg>             
                ` : ""}</span>

        ${type === 'onsite' ? `
             
            <span class="challenge__icon"> <svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="94px" height="94px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#231F20" d="M62.79,29.172l-28-28C34.009,0.391,32.985,0,31.962,0s-2.047,0.391-2.828,1.172l-28,28 c-1.562,1.566-1.484,4.016,0.078,5.578c1.566,1.57,3.855,1.801,5.422,0.234L8,33.617V60c0,2.211,1.789,4,4,4h16V48h8v16h16 c2.211,0,4-1.789,4-4V33.695l1.195,1.195c1.562,1.562,3.949,1.422,5.516-0.141C64.274,33.188,64.356,30.734,62.79,29.172z"></path> </g></svg> `: ""}</span>
      </div>

      <p class="challenge__description">${description}</p>

<!--Checks if there are any labels in the labels array. Yes= show tags. No= no output -->
      ${labels.length ? `<div class="challenge__labels">${labels.map(l => `<span class="tags">#${l}</span>`).join(' ')}</div>` : ''}
        
      <div class="challenge__buttonWrapper">
      <button class="challenge__bookbutton button--red">
        ${type === 'onsite' ? 'Book this room' : 'Take challenge online'}
      </button>
      </div>
    </article>
  `;

    //Button to open bookingModal for that specific challenge        
    const button = li.querySelector('.challenge__bookbutton');
    button.addEventListener('click', () => {
        loadBookingModal(ch); // open bookingModal with challenge-data
    });
    return li;
}

const listElMain = document.querySelector('#main-list');
const statusElMain = document.querySelector('#main-status');

//Function to get all challenges and show the three best rated on main site. 
async function initMain() {
    try {
        statusElMain.textContent = 'Laddar…';
        const all = await getChallenges();
        const top3 = [...all].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 3);

        listElMain.innerHTML = '';
        top3.forEach(ch => listElMain.appendChild(createChallengeLi(ch)));
        statusElMain.textContent = '';
    } catch (e) {
        statusElMain.textContent = 'Could not load data.';
        console.error(e);
    }
}

//Function to get all challenges and show the 15 best rated on all-challenges. 

const listElAll = document.querySelector('#all-list');
const statusElAll = document.querySelector('#all-status');
const loadingAnimation = document.querySelector('.loading');

async function initAll() {
    try {
        
        loadingAnimation.classList.remove('hidden');
        statusElAll.textContent = 'Loading challenges...';

        const all = await getChallenges();
        const sorted = [...all].sort(
            (a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 15);

        listElAll.innerHTML = '';
        sorted.forEach(ch => {
            listElAll.appendChild(createChallengeLi(ch));
        });

        loadingAnimation.classList.add('hidden');
        statusElAll.textContent = '';
    } catch (e) {
        loadingAnimation.classList.add('hidden');
        statusElAll.textContent = 'Could not load data: ' + e.message;
        console.error(e);
    }
}
if (listElMain && statusElMain) {
    initMain();
}

if (listElAll && statusElAll) {
    initAll();
}

//Max 50 characters in challenge description
export function truncateDescription(description, maxLength = 50) {
    if (description.length <= maxLength) {
        return description;
    }
    return description.slice(0, maxLength) + '...';
}   

/*console.log(truncateDescription
("This is a long description used only for testing the truncation function.", 50));*/

//Tests for truncateDescription function

/*import { truncateDescription } from "./truncateDescription";

test("should truncate long descriptions", () => {
    const result = truncateDescription(
        "This is a very long description that will be truncated",
        30
    );
    expect(result).toBe("This is a very long description...");
});

test("should not truncate short descriptions", () => {
    const result = truncateDescription("Short text", 50);
    expect(result).toBe("Short text");
});
*/



//FILTER function to load in the HTML from filter.html
async function loadFilterChallenges() {
    try {
        const res = await fetch('filter.html');
        if (!res.ok) throw new Error('Failed to load filter.html');

        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');

        const filterSection = doc.querySelector('.filters');

        if (!filterSection) throw new Error('No .filters found in filters.html');

        const filterBtnChallenges = document.querySelector('.filterBtn');
        const challengeList = document.querySelector('#all-list');// lägg till i 'all-list'
        if (!challengeList) throw new Error('No #all-list found');

        //Removes old filter
        document.querySelector('.filters')?.remove();

        //Give filterSection the class 'is visible' and show it
        challengeList.parentNode.insertBefore(filterSection, challengeList);
        filterSection.classList.add('is-visible');

        //Kopplar in filter.js genom initializeFilters
        if (typeof initializeFilters === "function") {
            initializeFilters();
        };

        //Göm knappen om den finns
        if (filterBtnChallenges) filterBtnChallenges.style.display = 'none';

        //Add a closeing-button 
        const closeBtn = filterSection.querySelector('.filters__close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {

                filterSection.remove();
                if (filterBtnChallenges) filterBtnChallenges.style.display = '';
            });
        }

    } catch (err) {
        console.error('loadFilterChallenges error', err);
        const statusElAll = document.querySelector('#all-status');
    if (statusElAll) statusElAll.textContent = ' I am sorry, could not load the filter : ' + err.message;
    }
}

//gör loadFilterChallenges tillgänglig för klick i html
window.loadFilterChallenges = loadFilterChallenges;

//MODAL function to load the HTML from booking.html
async function loadBookingModal(challenge) {
    try {
        const res = await fetch('booking/booking.html');
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');

        const overlay = doc.querySelector('.booking-overlay');
        const modal = doc.querySelector('#booking-modal');

        modal.querySelector('#booking-room-title-step1').textContent = challenge.title;

        //Remove old modals
        document.querySelector('.booking-overlay')?.remove();
        document.querySelector('#booking-modal')?.remove();

        if (overlay) document.body.appendChild(overlay);
        if (modal) document.body.appendChild(modal); // lägg till i all.html
        overlay?.classList.add('is-visible');
        modal?.classList.add('is-visible');
        initialiseBookingModal(challenge);
        
    } catch (err) {
        console.error(loadBookingModal, err);
        const statusElAll = document.querySelector('#all-status');
        alert('Could not open booking modal, try again later!');
}
}
/*
modal.querySelector('.booking-overlay').addEventListener('click', () => modal.remove());
const closeBtn = modal.querySelector('#booking-close-btn');
if(closeBtn) closeBtn.addEventListener('click', () => modal.remove());
*/