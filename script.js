let timerElement = document.getElementById("timer");
let statusElement = document.getElementById("status");
let startButton = document.getElementById("startButton");
let resetButton = document.getElementById("resetButton");
let clearHistoryButton = document.getElementById("clearHistory");
let historyList = document.getElementById("historyList");
let alertSound = document.getElementById("alertSound");

let countdown;
let stopwatch;
let timeDeclared = 60; // valor padrão de ronda (60s)
let remainingTime;
let elapsedTime = 0;
let isCountingDown = false;
let isCountingUp = false;

// Carregar histórico salvo
window.onload = () => {
    let savedHistory = JSON.parse(localStorage.getItem("rondas")) || [];
    savedHistory.forEach(item => addToHistory(item));
};

function updateTimerDisplay(time) {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    timerElement.textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2,'0')}`;
}

function startCountdown() {
    isCountingDown = true;
    remainingTime = timeDeclared;
    updateTimerDisplay(remainingTime);
    statusElement.textContent = "⏳ Contagem regressiva...";
    clearInterval(stopwatch);

    countdown = setInterval(() => {
        remainingTime--;
        updateTimerDisplay(remainingTime);

        if (remainingTime <= Math.floor(timeDeclared * 0.1)) {
            alertSound.play(); // alerta sonoro
        }

        if (remainingTime <= 0) {
            clearInterval(countdown);
            startStopwatch();
        }
    }, 1000);
}

function startStopwatch() {
    isCountingDown = false;
    isCountingUp = true;
    elapsedTime = 0;
    statusElement.textContent = "🔵 Ronda em andamento...";

    stopwatch = setInterval(() => {
        elapsedTime++;
        updateTimerDisplay(elapsedTime);
    }, 1000);
}

function resetTimer() {
    clearInterval(countdown);
    clearInterval(stopwatch);
    isCountingDown = false;
    isCountingUp = false;
    elapsedTime = 0;
    updateTimerDisplay(0);
    statusElement.textContent = "⚪ Cronômetro zerado.";
}

function addToHistory(entry) {
    let li = document.createElement("li");
    li.textContent = entry;
    historyList.appendChild(li);
}

function saveHistory(entry) {
    let history = JSON.parse(localStorage.getItem("rondas")) || [];
    history.push(entry);
    localStorage.setItem("rondas", JSON.stringify(history));
}

startButton.addEventListener("click", () => {
    if (!isCountingDown && !isCountingUp) {
        let now = new Date().toLocaleTimeString();
        saveHistory(`Ronda programada às ${now}`);
        addToHistory(`Ronda programada às ${now}`);
        startCountdown();
    }
});

resetButton.addEventListener("click", resetTimer);

clearHistoryButton.addEventListener("click", () => {
    if (confirm("Deseja realmente limpar todo o histórico de rondas?")) {
        localStorage.removeItem("rondas");
        historyList.innerHTML = "";
    }
});
