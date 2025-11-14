//adds to array when selected using addEventlistener
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


//toogle tag state, added to selectedTags array if checked
const selectedTags = [];

const tagElement = document.querySelectorAll('.tag');

function toggleTag(event) {
    const tagElement = event.currentTarget;
    const tag = tagElement.textContent;
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
 
