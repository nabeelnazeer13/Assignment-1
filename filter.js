//adds to array when selected using addEventlistener
const selectedTypes = [];

const onlineBox = document.querySelector('.online');
const offlineBox = document.querySelector('.offline');

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

    } console.log(selectedTypes) 
}
  onlineBox.addEventListener('change', checkBox);
  offlineBox.addEventListener('change', checkBox);


//toogle tag state, added to selectedTags array if checked
let selectedTags = [];

function toggleTag(tagElement) {
    const tag = tagElement.textContent.trim();
    const index = selectedTags.indexOf(tag);

    if (index > -1) {
        selectedTags.splice(index, 1);
        tagElement.classList.remove("checked");s
    } else {
        selectedTags.push(tag);
        tagElement.classList.add("checked");
    }

    console.log("Selected tags:", selectedTags);
}
