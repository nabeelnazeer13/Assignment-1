//const dateInput=document.querySelector('#date');
/*<script type="module" src="main.js"></script>
<script type="module" src="other.js"></script>
*/
//import {id,minParticipants,maxParticipants} from './main.js';

const id = 3;

const checkit = document.querySelector('#check');
const choice = document.querySelector('#dates');

function checkavailabilty (id,datum) {
    const res_url = `https://lernia-sjj-assignments.vercel.app/api/booking/available-times?date=${datum}&challenge=${id}`;
    console.log(res_url);
    return res_url
}

async function fetch_slots() {
    const datum = document.querySelector("#date_input").value;
    if (datum=="") {
        alert("the fuck");
    }
    else {
    const res = await fetch(checkavailabilty(id,datum));
    const data = await res.json();
    data.slots.forEach(slot => {
    console.log(slot);
    const option = document.createElement('option');
    option.value = slot;
    option.textContent = slot;
    choice.appendChild(option);

    });
    return data.slots;
}}

checkit.addEventListener('click', fetch_slots);



