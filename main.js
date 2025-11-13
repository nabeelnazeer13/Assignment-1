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
        <img src="${challenge.image}" alt="${challenge.title}" class="challenge__image">

        <div class="challenge__details">
          <div class="challenge__rating">
            ${"★".repeat(challenge.rating)}${"☆".repeat(5 - challenge.rating)}
          </div>
          <span class="challenge__size">${challenge.minParticipants}-${challenge.maxParticipants} participants</span>
        </div>

        <h3 class="challenge__title">
          ${challenge.title}
          <span class="challenge__type">${challenge.type}</span>
        </h3>

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