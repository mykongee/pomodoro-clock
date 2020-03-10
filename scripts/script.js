// Main sesssion display and control buttons
const displayTime = document.querySelector(".display-time");
const playPauseBtn = document.querySelector(".display-play-pause");
const stopBtn = document.querySelector(".display-stop");

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
let breakTimerFlag = false;

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

playPauseBtn.addEventListener("click", function() {
    play();
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
    
    // Change play button functionality and image to pause button
    playPauseBtn.addEventListener("click", function() {
        pause();
    })
    playPauseBtn.removeEventListener("click", function() {
        play();
    })
    playPauseBtn.src = "./images/icons8-pause.svg";
}

function pause() {
    isPaused = true;

    // Change pause button functionality and image back to play button
    playPauseBtn.addEventListener("click", function() {
        play();
    })
    playPauseBtn.removeEventListener("click", function() {
        pause();
    })
    playPauseBtn.src = "./images/icons8-play.svg";
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
        if (isPaused === false) {
            
            //let currentTime = new Date().getTime();
            //let remaining = targetTime - currentTime;
            remaining -= 1000;
            let minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((remaining % (1000 * 60)) / 1000);
            if (remaining > 10000){
                sessionTimeBinder.change(`${minutes}:${seconds}`);
            } else if (remaining > 0) {
                sessionTimeBinder.change(`${minutes}:0${seconds}`);
            } else if (remaining < 0 && breakTimerFlag === false) { // Switch to break timer
                clearInterval(countdownId);
                sessionTimeBinder.change("0:00");
                sessionTimerRunning = false;
                breakTimerFlag = true;
                displayTime.style.color = "green"; // Break session color
                initTimer(breakTimeBinder.data);
            } else if (remaining < 0 && breakTimerFlag === true) { // Switch back to work timer
                clearInterval(countdownId); 
                sessionTimeBinder.change("0:00");
                sessionTimerRunning = false;
                breakTimerFlag = false;
                displayTime.style.color = "rgba(69, 17, 212, 0.753)"; // Working session color
                initTimer(settingsTimeBinder.data);
            }
            console.log(remaining);
        } 
    }, 1000)
}

function incrementTime(binder) {
    // Disallow increasing time if pomodoro timer is running
    if (sessionTimerRunning === false) {

        // Ensures consistency of settings time and session time
        if (binder.element.className === setTimeClass) {
            binder.change(binder.data + 1); 
            sessionTimeBinder.change(`${binder.data}:00`);
        } else {
            binder.change(binder.data + 1);
        } 
    }

}

function decrementTime(binder) {
    // Disallow decreasing time if pomodoro timer is running
    if (sessionTimerRunning === false) {

        // Disallow negative timer numbers
        if (binder.data > 1) {
            if (binder.element.className === setTimeClass){
                binder.change(binder.data - 1);
                sessionTimeBinder.change(`${binder.data}:00`);
            } else {
                binder.change(binder.data - 1);
                }
        }
    }

}
