// ==========================
// 1. Mobilmeny
// ==========================
const mobilemenu = document.querySelector('.header__mainmobilenavmenu');
const navmenu = document.querySelector('.header__navcontainer')
const closemenu = document.querySelector('.header__navcontainernavclose')

mobilemenu.addEventListener("click", () => {
    navmenu.classList.toggle('mobileactive');
});

closemenu.addEventListener("click", () => {
    navmenu.classList.toggle('mobileactive');
});


// ==========================
// 2. API-anrop
// ==========================

async function getChallenges() {
    const res = await fetch('https://lernia-sjj-assignments.vercel.app/api/challenges');
    const data = await res.json();
    return data.challenges;
}

// ==========================
// 3. Bygg upp challenge-kort
// sorterar efter rating
// om limited finns: ta bara de 3 första, annars ta
// hela listan
// ==========================


function renderChallenges(challenges, limit = null) {
    const list = document.querySelector("#challengesList");
    list.innerHTML = "";

    const sorted = challenges.sort((a, b) => b.rating - a.rating);

    const toRender = limit ? sorted.slice(0, limit) : sorted;

    toRender.forEach(challenge => {
        const li = document.createElement("li");
        li.classList.add("challenges__listItem");

        const buttonText = challenge.type === "online" ? "Take challenge online" : "Book this room";

        li.innerHTML = `
      <article class="challenge">
      <div class="challenge__imageWrapper">
        <img src="${challenge.image}" alt="${challenge.title}" class="challenge__image">
            <div class="challenge__rating">
            ${"★".repeat(challenge.rating)}${"☆".repeat(5 - challenge.rating)}
            </div>

            ${challenge.type === "online"?`
            <span class="challenge__icon"> <svg height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 85.356 85.356" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path style="fill:#010002;" d="M77.45,57.695v-3.16V35.567V16.599c0-1.736-1.421-3.16-3.16-3.16H11.066 c-1.739,0-3.164,1.417-3.164,3.16v18.968v18.968v3.16L0,67.179c0,2.613,2.122,4.738,4.742,4.738h75.872 c2.616,0,4.742-2.126,4.742-4.738L77.45,57.695z M49.005,70.342H36.358c-0.437,0-0.791-0.351-0.791-0.791 c0-0.44,0.354-0.791,0.791-0.791h12.648c0.433,0,0.791,0.351,0.791,0.791C49.785,69.992,49.438,70.342,49.005,70.342z M29.647,67.182l2.412-2.895h21.233l2.416,2.895H29.647z M73.001,52.104c0,1.525-1.242,2.759-2.756,2.759H15.11 c-1.514,0-2.756-1.245-2.756-2.759V19.036c0-1.525,1.242-2.759,2.756-2.759h55.136c1.514,0,2.756,1.242,2.756,2.759 C73.001,19.036,73.001,52.104,73.001,52.104z"></path> </g> </g></svg>             
                ` : ""}</span>


            ${challenge.type === "onsite"? `
             <span class="challenge__icon"> <svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="94px" height="94px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#231F20" d="M62.79,29.172l-28-28C34.009,0.391,32.985,0,31.962,0s-2.047,0.391-2.828,1.172l-28,28 c-1.562,1.566-1.484,4.016,0.078,5.578c1.566,1.57,3.855,1.801,5.422,0.234L8,33.617V60c0,2.211,1.789,4,4,4h16V48h8v16h16 c2.211,0,4-1.789,4-4V33.695l1.195,1.195c1.562,1.562,3.949,1.422,5.516-0.141C64.274,33.188,64.356,30.734,62.79,29.172z"></path> </g></svg> `: ""}</span>
        </div>

       

        <h3 class="challenge__title">
          ${challenge.title}
          <span class="challenge__type">(${challenge.type})</span>
        </h3>
        
 <div class="challenge__details">
          <span class="challenge__size">${challenge.minParticipants}-${challenge.maxParticipants} participants</span>
        </div>
        <p class="challenge__description">${challenge.description}</p>

        ${challenge.labels && challenge.labels.length > 0
                ? `<div class="challenge__tags">
              ${challenge.labels.map(label => `<span class="challenge__tag">#${label}</span>`).join("")}
            </div>`
                : ""
            }

        <button class="challenge__bookbutton">${buttonText}</button>
      </article>
    `;

        list.appendChild(li);
    });
}

// ==========================
// 4. Hämtar utmaningarna från API
// om sidan har klassen: homepage = visa 3 kort annars
// visa alla i en grid
// ==========================
document.addEventListener("DOMContentLoaded", async () => {
    const challenges = await getChallenges();

    if (document.body.classList.contains("homepage")) {
        renderChallenges(challenges, 3);
    }

    if (document.body.classList.contains("allchallenges")) {
        renderChallenges(challenges);
    }
});