const displayTime = document.querySelector(".display-time");
const settingsTime = document.querySelector(".settings-session-time");
const breakTime = document.querySelector(".settings-break-time");
const sessionUpBtn = document.querySelector(".session-up-btn");
const sessionDownBtn = document.querySelector(".session-down-btn");
const breakUpBtn = document.querySelector(".break-up-btn");
const breakDownBtn = document.querySelector(".break-down-btn");
const setTimeClass = "settings-session-time"; // Used in increment/decrement functions to ensure data and view consistency

// Object to bind data with DOM element. Updates element when data changes.
class DataBinder {
    constructor(element, data) {
        this.data = data;
        this.element = element;
        element.textContent = data;
        element.addEventListener("change", this, false);
    }
    handleEvent(event) {
        switch (event.type) {
            case "change":
                this.change(this.element.value);
        }
    }
    change(value) {
        this.data = value;
        this.element.textContent = value;
    }
}

let settingsTimeBinder = new DataBinder(settingsTime, 25);
let breakTimeBinder = new DataBinder(breakTime, 5);
let sessionTimeBinder = new DataBinder(displayTime, "25:00")

sessionUpBtn.addEventListener("click", function() {
    incrementTime(settingsTimeBinder); 
});

sessionDownBtn.addEventListener("click", function() {
    decrementTime(settingsTimeBinder);
});

breakUpBtn.addEventListener("click", function() {
    incrementTime(breakTimeBinder);
});

breakDownBtn.addEventListener("click", function() {
    decrementTime(breakTimeBinder);
});

function incrementTime(binder) {
    // Ensures consistency of settings time and session time
    if (binder.element.className === setTimeClass) {
        binder.change(binder.data + 1); 
        sessionTimeBinder.change(`${binder.data}:00`);
    } else {
        binder.change(binder.data + 1);
    }
}

function decrementTime(binder) {
    if (binder.data > 1) {
        if (binder.element.className === setTimeClass){
            binder.change(binder.data - 1);
            sessionTimeBinder.change(`${binder.data}:00`);
        } else {
            binder.change(binder.data - 1);
        }
    }
}

// TODO: prevent calling initTimer() more than one time
// Starts a 25 minute timer (hardcoded for now)
function initTimer(sessionTime) {
    let currentTime = new Date().getTime();
    let targetTime = new Date(currentTime + sessionTime * 60000).getTime();

    startTimer(targetTime);
}

function startTimer(targetTime) {
    let countdownId = setInterval(function() {
        let currentTime = new Date().getTime();
        let remaining = targetTime - currentTime;
        let minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        if (remaining > 10000){
            sessionTimeBinder.change(`${minutes}:${seconds}`);
        } else if (remaining > 0) {
            sessionTimeBinder.change(`${minutes}:0${seconds}`);
        } else if (remaining < 0) {
            clearInterval(countdownId);
            sessionTimeBinder.change("0:00")
        }
        console.log(remaining);
    }, 1000)
}