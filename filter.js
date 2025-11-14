//adds online/on-site to array when selected using addEventlistener
const selectedTypes = [];

const onlineBox = document.querySelector('.online');
const onsiteBox = document.querySelector('.onsite');

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
  onlineBox.addEventListener('change', checkBox);
  onsiteBox.addEventListener('change', checkBox);


//adds rating to array
const selectedRating = [];

const minRating = 1; //defult min rating
const maxRating = 5; //defult max rating

selectedRating <= maxRating
selectedRating >= minRating

//toogle tag state, added to selectedTags array if checked
const selectedTags = [];

const tagElement = document.querySelectorAll('.tag');

function toggleTag(event) {
    const tagElement = event.currentTarget;
    const tag = tagElement.textContent.toLowerCase(); //lowercase to be same as in API
    const index = selectedTags.indexOf(tag);

    if (index > -1) {
        selectedTags.splice(index, 1);
        tagElement.classList.remove("checked");
    } else {
        selectedTags.push(tag);
        tagElement.classList.add("checked");
    }

    console.log("Selected tags:", selectedTags);
}
//adds eventListener to all tags
tagElement.forEach(x => {
x.addEventListener('click', toggleTag);
});


//test array for tags/labels
const challenges = [
    {
        "id": 1,
        "labels": ["web", "linux", "javascript"]
    },
    {
        "id": 2,
        "labels": ["web", "linux"]
    }
];

//under construction
// const findIdByTags = challenges.filter(c => 
      //c.labels.some(label => selectedTags.includes(label)))
      // .map(c => c.id);

//console.log("ID by Tags: " + findIdByTags);


