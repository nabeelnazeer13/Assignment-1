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

    function extractUniqueTags(challenges) {
        const all = challenges.flatMap(ch => ch.labels || []);
        const normalized = all.map(t => String(t).trim().toLowerCase()).filter(Boolean);
        return Array.from(new Set(normalized)).sort((a,b) => a.localeCompare(b));
    }

    const tagListContainer = document.getElementById("tag-list");
    if (!tagListContainer) {
        console.warn("Hittar inte #tag-list i DOM");
        return;
    }

    const tags = extractUniqueTags(data);
    tagListContainer.innerHTML = "";

    if (tags.length === 0) {
        tagListContainer.innerHTML = '<p class="no-tags">Inga taggar att visa.</p>';
    } else {
        tags.forEach(tag => {
            const div = document.createElement("div");
            div.className = "tag";
            div.setAttribute("data-tag", tag);

            const p = document.createElement("p");
            p.textContent = tag.charAt(0).toUpperCase() + tag.slice(1); 
            div.appendChild(p);

            div.addEventListener("click", () => {
                const idx = filterState.tags.indexOf(tag);
                if (idx > -1) {
                    filterState.tags.splice(idx, 1);
                    div.classList.remove("checked");
                } else {
                    filterState.tags.push(tag);
                    div.classList.add("checked");
                }
                applyFilters();
                console.log("Valda taggar:", filterState.tags);
            });

            tagListContainer.appendChild(div);
        });
    }

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


    function renderFilteredChallenges(challenges) {
        const list = document.getElementById("all-list");
        if (!list) {
            console.warn("Could not find #all-list in DOM");
            return;
        }

        list.innerHTML = "";

        if(challenges.length===0){
            list.innerHTML='<p class="no-results">Your search did not match any challenges</p>';
            return;
        }

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

                const overMin = filterState.minRating === 0 || rating >= filterState.minRating;
                const underMax = filterState.maxRating === 5 || rating <= filterState.maxRating;

                return overMin && underMax;
            })
        }

        if (filterState.tags.length > 0) {
            filtered = filtered.filter(challenge => {
                if (!challenge.labels) return false;

                return filterState.tags.some(tag => //Updated to find challange with any one tag selected
                    challenge.labels.includes(tag)
                );
            });
        }

        renderFilteredChallenges(filtered);

        console.log('Search-filter:', filterState.search)
        console.log(filterState);
    }

};

//Gör initializeFilters tillgänglig globalt så att main.js kommer åt denna
window.initializeFilters = initializeFilters;

