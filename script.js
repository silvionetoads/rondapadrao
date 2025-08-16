document.addEventListener("DOMContentLoaded", () => {
  const timerDisplay = document.getElementById("timerDisplay");
  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const resetBtn = document.getElementById("resetBtn");
  const setTimerBtn = document.getElementById("setTimerBtn");
  const timeInput = document.getElementById("timeInput");
  const alertMessage = document.getElementById("alertMessage");
  const confirmRondaBtn = document.getElementById("confirmRondaBtn");
  const historyList = document.getElementById("historyList");
  const clearHistoryBtn = document.getElementById("clearHistoryBtn");
  const printHistoryBtn = document.getElementById("printHistoryBtn");
  const alertSound = document.getElementById("alertSound");

  let timer;
  let timeRemaining = 0;
  let isRunning = false;

  function updateDisplay() {
    let minutes = Math.floor(timeRemaining / 60);
    let seconds = timeRemaining % 60;
    timerDisplay.textContent = 
      `${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`;
  }

  function startTimer() {
    if (timeRemaining > 0 && !isRunning) {
      isRunning = true;
      timer = setInterval(() => {
        timeRemaining--;
        updateDisplay();

        if (timeRemaining <= 0) {
          clearInterval(timer);
          isRunning = false;
          triggerAlert();
        }
      }, 1000);
    }
  }

  function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
  }

  function resetTimer() {
    pauseTimer();
    timeRemaining = 0;
    updateDisplay();
  }

  function setTimer() {
    const minutes = parseInt(timeInput.value);
    if (!isNaN(minutes) && minutes > 0) {
      timeRemaining = minutes * 60;
      updateDisplay();
    }
  }

  function triggerAlert() {
    alertMessage.classList.remove("hidden");
    alertSound.play();
  }

  function confirmRonda() {
    const now = new Date();
    const timestamp = now.toLocaleString("pt-BR");
    const li = document.createElement("li");
    li.textContent = `Ronda iniciada em: ${timestamp}`;
    historyList.appendChild(li);

    alertMessage.classList.add("hidden");
    setTimer();
  }

  function clearHistory() {
    historyList.innerHTML = "";
  }

  function printHistory() {
    let content = "Histórico de Ronda:\n\n";
    document.querySelectorAll("#historyList li").forEach(item => {
      content += item.textContent + "\n";
    });

    const win = window.open("", "_blank");
    win.document.write("<pre>" + content + "</pre>");
    win.print();
  }

  startBtn.addEventListener("click", startTimer);
  pauseBtn.addEventListener("click", pauseTimer);
  resetBtn.addEventListener("click", resetTimer);
  setTimerBtn.addEventListener("click", setTimer);
  confirmRondaBtn.addEventListener("click", confirmRonda);
  clearHistoryBtn.addEventListener("click", clearHistory);
  printHistoryBtn.addEventListener("click", printHistory);

  updateDisplay();
});
