const MODES = {
    pomodoro: { duration: 25* 60, label: "Pomodoro"},
    shortBreak: { duration: 5* 60, label: "short Break"},
    longBreak: { duration: 30* 60, label: "Long Break"}
};

let mode = "pomodoro";
let cycle = 0;
let timer = null;
let timeLeft = MODES[mode].duration;

const timerDisplay = document.querySelector(".timer-display");
const startButton = document.querySelector(".start-btn");
const stopButton = document.querySelector(".stop-btn");
const resetButton = document.querySelector(".reset-btn");

function updateDisplay() {
    const min = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const sec = String(timeLeft % 60).padStart(2, '0');
    timerDisplay.textContent = `${min}:${sec}`;
}

function notify(message) {
    if (window.Notification && Notification.Permissions === "granted") {
        new Notification(message);
    } else {
        alert(message);
    }
}

function switchMode(newmode) {
    mode = newmode;
    timeLeft = MODES[mode].duration;
    updateDisplay();
    notify(`Mode: ${MODES[mode].label} started!`);
}

function handleTimerEnd() {
    if (mode === "pomodoro"){
        cycle++;
        if (cycle < 4) {
            switchMode("shortBreak");
            startTimer();
        } else {
            switchMode("longBreak");
            cycle = 0;
            startTimer();
        }
    } else if (mode === "shortBreak") {
        switchMode("pomodoro");
        startTimer();
    } else if (mode === "longBreak") {
        switchMode("pomodoro");
    }
}

function startTimer() {
    if (timer) return;
    timer = setInterval(() => {
        timeLeft--;
        updateDisplay();
        if (timeLeft <= 0) {
            clearInterval(timer);
            timer = null;
            handleTimerEnd();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
    timer = null;
}

function resetTimer() {
    stopTimer();
    mode = "pomodoro";
    cycle = 0;
    timeLeft = MODES[mode].duration;
    updateDisplay();
}

startButton.addEventListener("click", startTimer);
stopButton.addEventListener("click", stopTimer);
resetButton.addEventListener("click", resetTimer);

// Notify permission request
if (window.Notification && Notification.permission !== "granted") {
    Notification.requestPermission();
}

updateDisplay();