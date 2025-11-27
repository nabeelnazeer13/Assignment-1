import { getChallenges, createChallengeLi } from './main.js';

//moved to outside of initializeFilters to work with updateUIWithState
let filterState = {
        search: "",
        online: false,
        onSite: false,
        tags: [],
        minRating: 0, //lowest possible rating/unrated
        maxRating: 5 //highest possible rating
    };

function initializeFilters() {

    const onlineCheckbox = document.querySelector(".filter__online");
    const onsiteCheckbox = document.querySelector(".filter__on-site");
    const ratingStarsMin = document.querySelectorAll(".rating__stars--min .fa-star");
    const ratingStarsMax = document.querySelectorAll(".rating__stars--max .fa-star");
    const filterUserInput = document.querySelector(".filter__user-input");
    let allChallengesData = []; //Spara api-data

    getChallenges().then(data => {
        allChallengesData = data;

        updateUIWithState();
        applyFilters();
    });

//event listeners for each filter type
 ratingStarsMin.forEach((star, index) => {
    star.addEventListener("click", () => {
        filterState.minRating = ratingStarsMin.length - index;
        applyFilters();
    });
});

ratingStarsMax.forEach((star, index) => {
    star.addEventListener("click", () => {
        filterState.maxRating = ratingStarsMax.length - index;
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

    });


    //toogle tag state, added to selectedTags if checked
    let selectedTags = filterState.tags.slice();
    const tagElement = document.querySelectorAll('.tag');

    function toggleTag(event) {
        const tagElement = event.currentTarget;
        const tag = tagElement.textContent.trim().toLowerCase(); //lowercase and trim to be same as in API
        const index = selectedTags.indexOf(tag);

        if (index > -1) {
            selectedTags.splice(index, 1);
        } else {
            selectedTags.push(tag);
        }

        filterState.tags = selectedTags;
        applyFilters();
       

        console.log("Selected tags:", selectedTags);
    }

    //adds eventListener to all tags
    tagElement.forEach(x => {
        x.addEventListener('click', toggleTag);
    });

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

    //ch = each challenge from main.js
        challenges.forEach(ch => {
            list.appendChild(createChallengeLi(ch));
        });
    };

    //update filter UI with filter state
    function updateUIWithState() {
    
    onlineCheckbox.checked = filterState.online;
    onsiteCheckbox.checked = filterState.onSite;

     ratingStarsMin.forEach((star, index) => {
        const selected = filterState.minRating;
        const threshold = ratingStarsMin.length - selected;
        star.classList.toggle("checked", index >= threshold); 
    });

   
    ratingStarsMax.forEach((star, index) => {
        const selected = filterState.maxRating;
        const threshold = ratingStarsMax.length - selected;
        star.classList.toggle("checked", index >= threshold);
    });

    tagElement.forEach(tag => {
        const value = tag.textContent.trim().toLowerCase();
        tag.classList.toggle("checked", filterState.tags.includes(value));
    });

    filterUserInput.value = filterState.search;
   
}

//apply filters to challenges
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

        //renders filtered challenges and updates UI
        renderFilteredChallenges(filtered);
        updateUIWithState();

        console.log('Search-filter:', filterState.search)
        console.log(filterState);
    }

};
    
//Gör initializeFilters tillgänglig globalt så att main.js kommer åt denna
window.initializeFilters = initializeFilters;

