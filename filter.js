//toggle online/offline checkbox apperence
function toggleCheckbox() {
    var checkBox = document.getElementById("myCheck");
    var text = document.getElementById("text");
    if (checkBox.checked == true){
        text.style.display = "block";
    } else {
       text.style.display = "none";
    }
}

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
