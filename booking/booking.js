// declare variables
let date_booking;
let name_booking;
let email_booking;
let time_booking;
let participants_booking;
let challenge_title1;
let challenge_title2;
let step_1;
let step_2;
let step_3;
let searchslots_button;
let makebooking_button;
let challenge_selected;
let slots = [];

//Initialise everything
//take in selected challenge details
// assign DOM elements and event listeners
//back to challenges
function initialiseBookingModal(ch) {
    challenge_selected = ch; 
    final_booking_object = {};
    date_booking = document.querySelector('#booking-date-input');
    name_booking = document.querySelector('#booking-name-input');
    email_booking = document.querySelector('#booking-email-input');
    time_booking = document.querySelector('#booking-time-select');
    participants_booking = document.querySelector('#booking-participants-select');
    challenge_title1 = document.querySelector('#booking-room-title-step1');
    challenge_title2 = document.querySelector('#booking-room-title-step2');
    step_1 = document.querySelector('#booking-step-1');
    step_2 = document.querySelector('#booking-step-2');
    step_3 = document.querySelector('#booking-step-3');
    searchslots_button = document.querySelector('#booking-step1-next');
    makebooking_button = document.querySelector('#booking-step2-next');
    backtoChallenges_button = document.querySelector("#booking-close");

    if (challenge_title1) challenge_title1.textContent = challenge_selected.title;
    if (challenge_title2) challenge_title2.textContent = challenge_selected.title;
    if (searchslots_button) searchslots_button.addEventListener('click', create_fetch_url);
    if (makebooking_button) makebooking_button.addEventListener('click', capturebookinginfo);
    
    if (backtoChallenges_button) {
        backtoChallenges_button.addEventListener('click', () => {
            window.location.href = "all.html";
        });
    }
};

//validate input and create url to fetch available slots
//calls fetch function
//call modal form step change function
function create_fetch_url () {
    const errorEl = document.querySelector('#booking-step1-error');
    if (errorEl) {
        errorEl.textContent = '';
    }
    if (!date_booking.value) {
        if (errorEl) {
            errorEl.textContent = 'Please select a date.';
        }
        return;
    }
    else {
        const date_url = date_booking.value;
        const res_url = `https://lernia-sjj-assignments.vercel.app/api/booking/available-times?date=${date_url}&challenge=${challenge_selected.id}`;
        console.log(res_url); //for testing
        fetch_slots(res_url)
        .then((Response) => {
        change_modal_step();});
}}

//navigate through modal functions
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

//function to fetch available slots using API
async function fetch_slots(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        slots = data.slots;
        populateslots();
    } catch (error) {
        console.error("Error fetching slots:", error);
        alert("Failed to load available slots. Please try again.");
    }
}


//function to show slots fetched from API to input box
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

//function to validate input and create object to send to backend for reservation
function capturebookinginfo () {
   
    if (!name_booking.value) {
        alert("please enter name");
    }
    else {
        if (!email_booking.value) {
            alert("please enter valid email");
        }
        else {
            if (!time_booking.value) {
                alert("choose a slot please");
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

//POST inputted object to backend
//Reservation success or failure
async function post_booking () {
    try {
        const res = await fetch('https://lernia-sjj-assignments.vercel.app/api/booking/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(final_booking_object),
        });
        if (!res.ok) throw new Error("Reservation failed! Status: " + res.status);
        const data = await res.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error booking reservation:", error);
        alert("Booking failed. Please try again.");
    }
}
