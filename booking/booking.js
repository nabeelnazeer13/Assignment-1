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
    fetch_slots(res_url)
        .then((Response) => {
        change_modal_step();});
}}

function change_modal_step() {
    const active_modal_stage = document.querySelector('.booking-step-active').id;
    console.log(active_modal_stage);
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
   
    if (!name_booking.value) {
        alert("name");
    }
    else {
        if (!email_booking.value) {
            alert("emaail");
        }
        else {
            if (!time_booking.value) {
                alert("slot");
            }
            else { 
                final_booking_object.challenge = challenge_selected.id;
                final_booking_object.name = name_booking.value;
                final_booking_object.email = email_booking.value;
                final_booking_object.date = date_booking.value;
                final_booking_object.time = time_booking.value;
                final_booking_object.participants = Number(participants_booking.value);
                console.log(final_booking_object);//testing
                post_booking ()
                .then((Response) => {
                    change_modal_step();});
                }
            }
            }}

async function post_booking () {
    const res = await fetch('https://lernia-sjj-assignments.vercel.app/api/booking/reservations', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(final_booking_object),
});
const data = await res.json();
console.log(data);
}

searchslots_button.addEventListener('click', create_fetch_url);
makebooking_button.addEventListener('click', capturebookinginfo);

//Back to all.html
const backtoChallenges_button = document.querySelector("#booking-close");
backtoChallenges_button.addEventListener('click', () => {

window.location.href = "/all.html";
});

