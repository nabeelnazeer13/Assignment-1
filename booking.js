/* Requirements from eventlistener on bookroom button

1. get selected challenge as object
2. add class on modal section booking-step-1 to booking-step-active

*/

//import {challenge_selected} from './main.js';

//remove when connecting actual challenge object
const challenge_selected = {id:1, 
            type:"onsite", 
            title: "Project: X of Doom",
            description: "Try your hardest and succeed. Or fail",
            minParticipants: 2,
            maxParticipants: 4,
            rating: 1,
            image: "https://placekitten.com/640/480",
            labels: ['linux, web, javascript']
        };
//declare array to store times available
let slots = [];

//declare variables to be used with DOM API
const date_booking =document.querySelector('#booking-date-input');
const name_booking = document.querySelector('#booking-name-input');
const email_booking = document.querySelector('#booking-email-input');
const time_booking = document.querySelector('#booking-time-select');
const participants_booking = document.querySelector('#booking-participants-select');
const challenge_title1 = document.querySelector('#booking-room-title-step1');
const challenge_title2 = document.querySelector('#booking-room-title-step2');
const active_modal_stage = document.querySelector('.booking-step-active').id;
const step_1 = document.querySelector('#booking-step-1');
const step_2 = document.querySelector('#booking-step-2');
const step_3 = document.querySelector('#booking-step-3');
const searchslots_button = document.querySelector('#booking-step1-next');
const makebooking_button = document.querySelector('#booking-step2-next');

const final_booking_object = {};

challenge_title1.textContent = challenge_selected.title;
challenge_title2.textContent = challenge_selected.title;

//validate input and create url to fetch available slots based on challenge id and date chosen - DOM interaction. 
//Also calls fetch function
//active on button click
function create_fetch_url () {
    if (!date_booking.value) {
        alert("the fuck");
    }
    else {
        const date_url = date_booking.value;
        const res_url = `https://lernia-sjj-assignments.vercel.app/api/booking/available-times?date=${date_url}&challenge=${challenge_selected.id}`;
    console.log(res_url); //for testing
    fetch_slots(res_url);
    change_modal_step();}
}

function change_modal_step() {
    console.log(step_1.classList);
    if (active_modal_stage == 'booking-step-1') {
        step_1.classList.remove('booking-step-active');
        step_2.classList.add('booking-step-active');
    }
    else if (active_modal_stage == 'booking-step-2') {
        step_2.classList.remove('booking-step-active');
        step_3.classList.add('booking-step-active');
    }
    else {
        step_3.classList.remove('booking-step-active');
    }
}

//function to fetch available slots
async function fetch_slots(url) {
    const res = await fetch(url);
    const data = await res.json();
    slots = data.slots;
    populateslots();
}

function populateslots() {
    slots.forEach(slot => {
    const slotoption = document.createElement('option');
    slotoption.value = slot;
    slotoption.textContent = slot;
    time_booking.appendChild(slotoption);
    });
    let i=0;
    for (i=challenge_selected.minParticipants;i<=challenge_selected.maxParticipants;i++) {
        const partoption = document.createElement('option');
        partoption.textContent = i+" participants";
        partoption.value = i;
        participants_booking.appendChild(partoption);
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
                bookobj.date = date_booking;
                bookobj.slot = time_booking;
                //bookobj.partic = document.querySelector('#participants_booking').value;
                console.log(bookobj);

            }
        //}
   // }

//}
searchslots_button.addEventListener('click', create_fetch_url);
makebooking_button.addEventListener('click', capturebookinginfo);



