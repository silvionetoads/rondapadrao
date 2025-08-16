document.addEventListener("DOMContentLoaded", () => {
    const timerDisplay = document.getElementById("timer");
    const timeInput = document.getElementById("timeInput");
    const startButton = document.getElementById("startButton");
    const resetButton = document.getElementById("resetButton");
    const historyList = document.getElementById("history");
    const clearHistoryButton = document.getElementById("clearHistoryButton");
    const alertSound = document.getElementById("alertSound");

    let countdownInterval;
    let countupInterval;
    let remainingTime = 0;
    let initialTime = 0;
    let isCountingUp = false;

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }

    function startCountdown() {
        clearInterval(countdownInterval);
        clearInterval(countupInterval);

        const minutes = parseInt(timeInput.value);
        if (isNaN(minutes) || minutes <= 0) {
            alert("Informe um tempo válido em minutos.");
            return;
        }

        remainingTime = minutes * 60;
        initialTime = remainingTime;
        isCountingUp = false;

        timerDisplay.textContent = formatTime(remainingTime);

        countdownInterval = setInterval(() => {
            remainingTime--;

            timerDisplay.textContent = formatTime(remainingTime);

            // 🔔 Alerta sonoro quando chegar nos 10%
            if (remainingTime === Math.floor(initialTime * 0.1)) {
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        alertSound.currentTime = 0;
                        alertSound.play();
                    }, i * 1000);
                }
            }

            if (remainingTime <= 0) {
                clearInterval(countdownInterval);
                startCountup();
            }
        }, 1000);
    }

    function startCountup() {
        isCountingUp = true;
        let elapsedTime = 0;
        countupInterval = setInterval(() => {
            elapsedTime++;
            timerDisplay.textContent = formatTime(elapsedTime);
        }, 1000);

        saveToHistory("Ronda iniciada às " + new Date().toLocaleTimeString());
    }

    function resetTimer() {
        clearInterval(countdownInterval);
        clearInterval(countupInterval);
        isCountingUp = false;
        timerDisplay.textContent = "00:00";
    }

    function saveToHistory(entry) {
        let history = JSON.parse(localStorage.getItem("rondaHistory")) || [];
        history.push(entry);
        localStorage.setItem("rondaHistory", JSON.stringify(history));
        renderHistory();
    }

    function renderHistory() {
        historyList.innerHTML = "";
        let history = JSON.parse(localStorage.getItem("rondaHistory")) || [];
        history.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            historyList.appendChild(li);
        });
    }

    function clearHistory() {
        if (confirm("Deseja realmente apagar todo o histórico de rondas?")) {
            localStorage.removeItem("rondaHistory");
            renderHistory();
        }
    }

    startButton.addEventListener("click", startCountdown);
    resetButton.addEventListener("click", resetTimer);
    clearHistoryButton.addEventListener("click", clearHistory);

    renderHistory();
});
