// Main sesssion display and control buttons
const displayTime = document.querySelector(".display-time");
const playBtn = document.querySelector(".display-play");
const pauseBtn = document.querySelector(".display-pause");
const stopBtn = document.querySelector(".display-stop");
const resetBtn = document.querySelector(".display-reset");

// Session settings time display and controls
const settingsTime = document.querySelector(".settings-session-time");
const sessionUpBtn = document.querySelector(".session-up-btn");
const sessionDownBtn = document.querySelector(".session-down-btn");

// Break time display and controls
const breakTime = document.querySelector(".settings-break-time");
const breakUpBtn = document.querySelector(".break-up-btn");
const breakDownBtn = document.querySelector(".break-down-btn");

const setTimeClass = "settings-session-time"; // Used in increment/decrement functions to ensure data and view consistency

// Timer control flags
let sessionTimerRunning = false;
let isPaused = false;

// Global setInterval() id to allow instant, flexible use of clearInterval();
let countdownId;

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

playBtn.addEventListener("click", function() {
    play();
})

pauseBtn.addEventListener("click", function() {
    pause();
})

stopBtn.addEventListener("click", function() {
    stop();
})

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

function play() {
    if (sessionTimerRunning === false) {
        initTimer(settingsTimeBinder.data);
    } 
    isPaused = false;
}

function pause() {
    isPaused = true;
}

function stop() {
    clearInterval(countdownId);
    sessionTimeBinder.change(`${settingsTimeBinder.data}:00`);
    sessionTimerRunning = false;
}

function initTimer(sessionTime) {
    if (sessionTimerRunning === false){
        sessionTimerRunning = true; // Ensures only one timer is running at a time
        
        let currentTime = new Date().getTime();
        let targetTime = new Date(currentTime + sessionTime * 60000).getTime();
        let interval = targetTime - currentTime;
        
        startTimer(interval);
    }
}

function startTimer(interval) {
    let remaining = interval;
    countdownId = setInterval(function() {
        if (isPaused === false && isStopped === false) {
            //let currentTime = new Date().getTime();
            //let remaining = targetTime - currentTime;
            remaining -= 1000;
            let minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((remaining % (1000 * 60)) / 1000);
            if (remaining > 10000){
                sessionTimeBinder.change(`${minutes}:${seconds}`);
            } else if (remaining > 0) {
                sessionTimeBinder.change(`${minutes}:0${seconds}`);
            } else if (remaining < 0) {
                clearInterval(countdownId);
                sessionTimeBinder.change("0:00")
                sessionTimerRunning = false;
            }
            console.log(remaining);
        } 
    }, 1000)
}

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
