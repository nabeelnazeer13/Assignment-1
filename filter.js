import { getChallenges, createChallengeLi } from './main.js';

function initializeFilters() {

    const onlineCheckbox = document.querySelector(".filter__online");
    const onsiteCheckbox = document.querySelector(".filter__on-site");
    const ratingStarsMin = document.querySelectorAll(".rating__stars--min .fa-star");
    const ratingStarsMax = document.querySelectorAll(".rating__stars--max .fa-star");
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

    getChallenges().then(data => {
        allChallengesData = data;
    });


    ratingStarsMin.forEach((star, index) => {
        star.addEventListener("click", () => {
            const selected = ratingStarsMin.length - index;
            filterState.minRating = selected;

            ratingStarsMin.forEach((s, i) => {
                if (i >= ratingStarsMin.length - selected) {
                    s.classList.add("checked");
                }
                else {
                    s.classList.remove("checked");
                }
            })
            applyFilters();
        });
    });

    ratingStarsMax.forEach((star, index) => {
        star.addEventListener("click", () => {
            const selected = ratingStarsMax.length - index;
            filterState.maxRating = selected;

            ratingStarsMax.forEach((s, i) => {
                if (i >= ratingStarsMax.length - selected) {
                    s.classList.add("checked");
                }
                else {
                    s.classList.remove("checked");
                }
            })

            applyFilters();
        });
    });

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

    /*  function renderChallenges(challenges) {
         const list = document.getElementById('challengesList');
 
         if (!list) {
             console.error('Could not find #challengesList in HTML');
             return;
         }
 
         list.innerHTML = "";
 
         if (challenges.length === 0) {
             list.innerHTML = '<li>no matching challenges</li>';
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
                 <p class ="challenge__label">${challenge.labels}</p>
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
 
     loadchallenges(); */

    function renderFilteredChallenges(challenges) {
        const list = document.getElementById("all-list");
        if (!list) {
            console.warn("Could not find #all-list in DOM");
            return;
        }

        list.innerHTML = "";

        challenges.forEach(ch => {
            list.appendChild(createChallengeLi(ch));
        });
    };

    function applyFilters() {
        let filtered = allChallengesData;

        if (filterState.search.trim() !== "") {
            filtered = filtered.filter(challenge => {
                const title = challenge.title.toLowerCase();
                const description = challenge.description.toLowerCase();

                return (title.includes(filterState.search)) ||
                    description.includes(filterState.search);
            })
        };

        if (filterState.online || filterState.onSite) {
            filtered = filtered.filter(challenge => {
                if (filterState.online && challenge.type === 'online') return true;
                if (filterState.onSite && challenge.type === 'onsite') return true;
                return false;
            });
        }

        if (filterState.minRating !== 0 || filterState.maxRating !== 0) {
            filtered = filtered.filter(challenge => {
                const rating = challenge.rating;

                const OverMin = filterState.minRating === 0 || rating >= filterState.minRating;
                const underMax = filterState.maxRating === 5 || rating <= filterState.maxRating;

                return OverMin && underMax;
            })
        }

        if (filterState.tags.length > 0) {
            filtered = filtered.filter(challenge => {
                if (!challenge.labels) return false;

                return filterState.tags.some(tag =>
                    challenge.labels.includes(tag)
                );
            });
        }

        renderFilteredChallenges(filtered);

        console.log('Search-filter:', filterState.search)
        console.log(filterState);
    }

    //toogle tag state, added to selectedTags array if checked
    const selectedTags = [];
    const tagElement = document.querySelectorAll('.tag');

    function toggleTag(event) {
        const tagElement = event.currentTarget;
        const tag = tagElement.textContent.trim().toLowerCase(); //lowercase and trim to be same as in API
        const index = selectedTags.indexOf(tag);

        if (index > -1) {
            selectedTags.splice(index, 1);
            tagElement.classList.remove("checked");
        } else {
            selectedTags.push(tag);
            tagElement.classList.add("checked");
        }

        filterState.tags = selectedTags;
        applyFilters();

        console.log("Selected tags:", selectedTags);
    }
    //adds eventListener to all tags
    tagElement.forEach(x => {
        x.addEventListener('click', toggleTag);
    });

};

//Gör initializeFilters tillgänglig globalt så att main.js kommer åt denna
window.initializeFilters = initializeFilters;

