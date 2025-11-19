//adds online/on-site to array when selected using addEventlistener
const selectedTypes = [];

const onlineBox = document.querySelector('#online');
const onsiteBox = document.querySelector('#onsite');

function checkBox(event) {
    const value = event.target.value;

    if (event.target.checked) {
      // Add the value if checked
      selectedTypes.push(value);
    } else {
      // Remove it if unchecked
      const index = selectedTypes.indexOf(value);
      if (index > -1) {
        selectedTypes.splice(index, 1);
      }

    } console.log(selectedTypes);
}
  //eventListeners for both checkboxes
  onlineBox.addEventListener('change', checkBox);
  onsiteBox.addEventListener('change', checkBox);


//toggle star button press + calculate amount of stars
const minStars = document.querySelectorAll("#minRating .fa-star");
minStars.forEach((star, index) => {
    star.addEventListener("click", () => {
        minRating = index + 1; 

        //change star apperance
        minStars.forEach((s, i) => {
            if (i < minRating) s.classList.add("checked");
            else s.classList.remove("checked");
        });

        console.log("Min Rating:", minRating);
    });
});

//same but for maximum star rating
const maxStars = document.querySelectorAll("#maxRating .fa-star");
maxStars.forEach((star, index) => {
    star.addEventListener("click", () => {
        maxRating = index + 1; 

        
        maxStars.forEach((s, i) => {
            if (i < maxRating) s.classList.add("checked");
            else s.classList.remove("checked");
        });

        console.log("Max Rating:", maxRating);
    });
});

//test array for tags/labels - to be replaced with actual challenges
const ch = [
    {
        "id": 1,
        "labels": ["web", "linux", "javascript"]
    },
    {
        "id": 2,
        "labels": ["web", "linux"]
    }
];

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

    console.log("Selected tags:", selectedTags);
    //call function to find matching card ids
    updateLabelId();
}

//findsand keeps ids of cards that contain any selected tag
function updateLabelId () {
const findIdByTags = ch.filter(c => //filter though each challange
      c.labels.some(label => selectedTags.includes(label))) //find any labels that match tag
       .map(c => c.id); //get only id number

console.log("ID by Tags: ", findIdByTags);
}

//adds eventListener to all tags
tagElement.forEach(x => {
x.addEventListener('click', toggleTag);
});