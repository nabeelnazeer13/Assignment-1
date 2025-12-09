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
    phone_booking = document.querySelector('#booking-phone-input');
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
    closeBooking_button = document.querySelector("#booking-close-btn");


    if (challenge_title1) challenge_title1.textContent = challenge_selected.title;
    if (challenge_title2) challenge_title2.textContent = challenge_selected.title;
    if (searchslots_button) searchslots_button.addEventListener('click', create_fetch_url);
    if (makebooking_button) makebooking_button.addEventListener('click', validate_booking_input);

    if (backtoChallenges_button) {
        backtoChallenges_button.addEventListener('click', () => {
            window.location.href = "all.html";
        });
    }
    //Closing button in booking modal
    if (closeBooking_button) {
        closeBooking_button.addEventListener('click', () => {
            window.location.href = "all.html";
        });
    }

    if (participants_booking) {
        participants_booking.addEventListener('focus', () => {
            participants_booking.addEventListener('input', validate_participant_input);
        });
    }
}

function validate_date () {
    const selectedDate = new Date(date_booking.value);
    const today = new Date();
    // normalize to midnight for comparison
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    const errorEl = document.querySelector('#booking-step1-error');
    if (errorEl) {
        errorEl.textContent = '';
    }
    if (!date_booking.value) { //check if no date is entered
        if (errorEl) {
            errorEl.textContent = 'Please select a date.';
        }
        return false;
    }
    if (selectedDate < today) { //check if date is in past
        if (errorEl) {
            errorEl.textContent = 'Please choose a date in the future.';
        }
        return false;
    }
    else {
        return true;
}}

//validate input and create url to fetch available slots
//calls fetch function
//call modal form step change function
function create_fetch_url () {
        if (!validate_date ()) { return;} 
        const date_url = date_booking.value;
        const res_url = `https://lernia-sjj-assignments.vercel.app/api/booking/available-times?date=${date_url}&challenge=${challenge_selected.id}`;
        console.log(res_url); //for testing
        fetch_slots(res_url)
        .then((Response) => {
         const errorEl = document.querySelector('#booking-step1-error');

            if (!slots || slots.length === 0) {//check if time slots are available for selected challenge and date
                if (errorEl) {
                    errorEl.textContent = 'No available times for this date. Please choose another date.';
                }
                return; // 
            }
        if (errorEl) {
                errorEl.textContent = '';
            }
            change_modal_step();
        });
}

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
    const errorEl = document.querySelector('#booking-step1-error');
    if (errorEl) {
        errorEl.textContent = '';
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        slots = data.slots;
        populate_slots();
    } catch (error) {
        console.error("Error fetching slots:", error);
        errorEl.textContent = "Failed to load available slots. Please try again.";
        return;
    }
}}


//function to show slots fetched from API to input box
function populate_slots() {
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
    /*
    let i=0;
    for (i=challenge_selected.minParticipants;i<=challenge_selected.maxParticipants;i++) {
        const partoption = document.createElement('option');
        partoption.textContent = i + " participants";
        partoption.value = i;
        participants_booking.appendChild(partoption);
    }*/

}

function validate_participant_input() {
    const participant_value = participants_booking.value.trim();
    const participant_input = Number(participant_value);//changed from parseINT to accomodate decimal checks

    participants_booking_error.textContent = "";
    participants_booking.classList.remove('booking-input-invalid');

    if (
        !participant_value ||
        isNaN(participant_input) ||
        participant_input < challenge_selected.minParticipants ||
        participant_input > challenge_selected.maxParticipants
    ) {
        if (!Number.isInteger(participant_value)) {
            participants_booking_error.textContent =
                `People cannot be fractions. Please enter between ${challenge_selected.minParticipants} and ${challenge_selected.maxParticipants} participants`;
            participants_booking.classList.add('booking-input-invalid');
            return false;
        }
        else {
            participants_booking_error.textContent =
                `Please enter between ${challenge_selected.minParticipants} and ${challenge_selected.maxParticipants} participants`;
            participants_booking.classList.add('booking-input-invalid');
            return false;
        }
    }

    return true;
}

//function to validate input and create object to send to backend for reservation
function validate_booking_input() {

//variables to find DOM elements
const name_booking = document.querySelector('#booking-name-input');
const name_booking_error = document.querySelector('#booking-error-name');

const phone_booking = document.querySelector('#booking-phone-input');   
const phone_booking_error = document.querySelector('#booking-error-phone');

const email_booking = document.querySelector('#booking-email-input');
const email_booking_error = document.querySelector('#booking-error-email');

const time_booking = document.querySelector('#booking-time-select');
const time_booking_error = document.querySelector('#booking-error-time');

name_booking.classList.remove('booking-input-invalid');
phone_booking.classList.remove('booking-input-invalid');
email_booking.classList.remove('booking-input-invalid');
time_booking.classList.remove('booking-input-invalid');


name_booking.addEventListener('input', () => {
    name_booking.classList.remove('booking-input-invalid');
    name_booking_error.textContent = "";
});         
phone_booking.addEventListener('input', () => {
    phone_booking.classList.remove('booking-input-invalid');
    phone_booking_error.textContent = "";
});

email_booking.addEventListener('input', () => {
    email_booking.classList.remove('booking-input-invalid');
    email_booking_error.textContent = "";
} );

time_booking.addEventListener('input', () => {
    time_booking.classList.remove('booking-input-invalid');
    time_booking_error.textContent = "";
});

let valid = true;
//alerts replaces with text content error messages
    if (!name_booking.value.trim()) {
    name_booking_error.textContent = "Please enter your name.";
    name_booking.classList.add('booking-input-invalid');
    valid = false;
       
    }
    else {
        if (!phone_booking.value.trim()) {
         phone_booking_error.textContent = "Please enter your name.";
          phone_booking_.classList.add('booking-input-invalid');
           valid = false;
          
        }
        else {
            if (!email_booking.value.trim()) {
                email_booking_error.textContent = "Please enter your email.";
                email_booking.classList.add('booking-input-invalid');
                valid = false;
               
            }
            else {
                if (!time_booking.value.trim()) {
                    time_booking_error.textContent = "Please select a time.";
                    time_booking.classList.add('booking-input-invalid');
                    valid = false;
                  
                }
                else {
                    // final participants validation
                    const participantsValid = validate_participant_input();
                    if (!participantsValid) valid = false;

                    if (!valid) {

                        return false
                    }
                    else {
                        capture_booking_info();
                        return true;
                    }
                }
            }
        }
    }

    function capture_booking_info() {
        final_booking_object.challenge = challenge_selected.id;
        final_booking_object.name = name_booking.value;
        final_booking_object.email = email_booking.value;
        final_booking_object.date = date_booking.value;
        final_booking_object.time = time_booking.value;
        final_booking_object.participants = Number(participants_booking.value);
        console.log(final_booking_object);//testing
        post_booking()
            .then((Response) => {
                change_modal_step();
            });
    }


    //POST inputted object to backend
    //Reservation success or failure
    async function post_booking() {
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
}
