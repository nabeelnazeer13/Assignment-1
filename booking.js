//const dateInput=document.querySelector('#date');
/*<script type="module" src="main.js"></script>
<script type="module" src="other.js"></script>
*/
//import {id,minParticipants,maxParticipants} from './main.js';

const id = 3;
const min_par = 2;
const max_par = 6;
let slots = [];
const name_booking = document.querySelector('#nameinput').textContent;
const email_booking = document.querySelector('#emailinput').textContent;
const slot_booking = document.querySelector('#dates').value;
const checkit = document.querySelector('#check');
const conf = document.querySelector('#confirm');
const choice = document.querySelector('#dates');
const parchoice = document.querySelector('#participants');
const bookobj = {};
const datum ="";

function checkavailabilty (id,datum) {
    const res_url = `https://lernia-sjj-assignments.vercel.app/api/booking/available-times?date=${datum}&challenge=${id}`;
    console.log(res_url);
    return res_url
}

async function fetch_slots() {
    const datum = document.querySelector("#date_input").value;
    if (!datum) {
        alert("the fuck");
    }
    else {
    const res = await fetch(checkavailabilty(id,datum));
    const data = await res.json();
    slots = data.slots;
    populateslots();
}}

function populateslots() {
    slots.forEach(slot => {
    const slotoption = document.createElement('option');
    slotoption.value = slot;
    slotoption.textContent = slot;
    choice.appendChild(slotoption);
    });
    for (i=min_par;i<=max_par;i++) {
        const partoption = document.createElement('option');
        partoption.textContent = i+" participants";
        partoption.value = i;
        parchoice.appendChild(partoption);
    }
}

function capturebookinginfo () {
    /* const name_booking = document.querySelector('#nameinput').textContent;
const email_booking = document.querySelector('#emailinput').textContent;
const slot_booking = document.querySelector('#dates').value;

    if (!name_booking) {
        alert("name");
    }
    else {
        if (!email_booking) {
            alert("emaail");
        }
        else {
            if (!slot_booking) {
                alert("slot");
            }
            else { */
                bookobj.challenge = id;
                bookobj.name = name_booking;
                bookobj.email = email_booking;
                bookobj.date = datum;
                bookobj.slot = slot_booking;
                //bookobj.partic = document.querySelector('#parchoice').value;
                console.log(bookobj);

            }
        //}
   // }

//}
checkit.addEventListener('click', fetch_slots);
conf.addEventListener('click', capturebookinginfo);



