// declare variables
let date_booking;
let name_booking;
let email_booking;
let time_booking;
let participants_booking;
let participants_booking_label;
let participants_booking_error;
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
    //participants_booking = document.querySelector('#booking-participants-select')
    participants_booking = document.querySelector('#booking-input-participants');
    participants_booking_label = document.querySelector('#booking-label-participants');
    participants_booking_error = document.querySelector('#booking-error-participants');
    booking_input_participantschallenge_title1 = document.querySelector('#booking-room-title-step1'); //changed name from booking-input-participantschallenge_title1
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
    if (participants_booking) {
        participants_booking.addEventListener('input', validateparticipantinput);
};
}

//validate input and create url to fetch available slots
//calls fetch function
//call modal form step change function
function create_fetch_url () {
    if (!date_booking.value) {
        alert("please enter correct date");
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
    participants_booking_label.textContent = `Enter number of participants`;
    participants_booking.placeholder = ` ${challenge_selected.minParticipants} - ${challenge_selected.maxParticipants} participants`
    participants_booking.min = challenge_selected.minParticipants;
    participants_booking.max = challenge_selected.maxParticipants;
    validateparticipantinput();
    /*
    let i=0;
    for (i=challenge_selected.minParticipants;i<=challenge_selected.maxParticipants;i++) {
        const partoption = document.createElement('option');
        partoption.textContent = i+" participants";
        partoption.value = i;
        participants_booking.appendChild(partoption);
    }*/

}

function validateparticipantinput() {
    const participant_value = participants_booking.value.trim();
    const participant_input = parseInt(participant_value, 10);

    participants_booking_error.textContent = "";
    participants_booking.classList.remove('booking-input-invalid');

    if (
        !participant_value ||
        isNaN(participant_input) ||
        participant_input < challenge_selected.minParticipants ||
        participant_input > challenge_selected.maxParticipants
    ) {
        participants_booking_error.textContent =
            `Please enter between ${challenge_selected.minParticipants} and ${challenge_selected.maxParticipants} participants`;
        participants_booking.classList.add('booking-input-invalid');
        return false;
    }

    return true;
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
             // final participants validation
            const participantsValid = validateparticipantinput();
            if (!participantsValid) {
                alert("please enter valid number of participants");
                return;
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
