const onlineCheckbox = document.querySelector(".filter__online");
const onsiteCheckbox = document.querySelector(".filter__on-site");

const filterUserInput = document.querySelector(".filter__user-input");
let allChallengesData = []; //Spara api-data
let filterState = {
    search: "",
    online: false,
    onSite: false,
    tags: [],
    minRating: 0,
    maxRating: 5
};

onsiteCheckbox.addEventListener("change", () => {
    filterState.onSite = onsiteCheckbox.checked;
    applyFilters();
});

onlineCheckbox.addEventListener("change", () => {
    filterState.online = onlineCheckbox.checked;
    applyFilters();
});


filterUserInput.addEventListener("input", (e) => {
    filterState.search = e.target.value.toLowerCase();
    applyFilters();
})

function renderChallenges(challenges) {
    const list = document.getElementById('challengesList');

    if (!list) {
        console.error("Could not find #challengesList in HTML");
        return;
    }

    list.innerHTML = "";

    if (challenges.length === 0) {
        list.innerHTML = '<li>Could not find matching challenges</li>';
        return;
    }

    challenges.forEach(challenge => {
        const li = document.createElement('li');
        li.classList.add("challenge");

        li.innerHTML = `
        <div class = "challenge__card">
        <img src = "${challenge.image}"/>
            <div class="challenge__content">
                <h3 class="challenge__title">${challenge.title}</h3>
                <p class ="challenge__description">${challenge.description}</p>
                <p class ="challenge__rating">${challenge.rating}</p>
                <p class="challenge__type">${challenge.type}</p>
             </div>
        </div> 
        `;

        list.appendChild(li);
    });
}


async function loadchallenges() {
    try {
        const res = await fetch('https://lernia-sjj-assignments.vercel.app/api/challenges');
        const data = await res.json();

        allChallengesData = data.challenges;
        renderChallenges(allChallengesData)
    } catch (err) {
        console.error('Error loading challenges', err);
    }
}

loadchallenges();

function applyFilters() {
    let filtered = allChallengesData;

    if (filterState.search.trim() !== "") {
        filtered = filtered.filter(challenge => {
            const title = challenge.title.toLowerCase();
            const description = challenge.description.toLowerCase();

            return (title.includes(filterState.search)) ||
                description.includes(filterState.search
                );
        })
    };

    if(filterState.online || filterState.onSite){
        filtered = filtered.filter(challenge=>{
            if(filterState.online && challenge.type === 'online') return true;
            if(filterState.onSite && challenge.type ==='onsite') return true;
            return false;
        });
    }

    renderChallenges(filtered);

    console.log('Search-filter:', filterState.search)
}