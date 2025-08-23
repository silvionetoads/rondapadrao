// Estados e elementos
let countdownInterval = null;
let rondaInterval = null;

let tempoProgramadoSeg = 0;   // tempo ajustado (segundos)
let restanteSeg = 0;          // restante da regressiva
let rondaSeg = 0;             // cronômetro progressivo da ronda
let estado = "inicial";       // inicial | ajustado | regressivo | zerou | ronda

// Elementos da UI
const inputPosto = document.getElementById("posto");
const inputTempo = document.getElementById("tempo");
const inputObs   = document.getElementById("observacao");

const btnAjustar   = document.getElementById("btnAjustar");
const btnIniciar   = document.getElementById("btnIniciar");
const btnPausar    = document.getElementById("btnPausar");
const btnZerar     = document.getElementById("btnZerar");
const btnRelatorio = document.getElementById("btnRelatorio");

const display  = document.getElementById("display");
const alerta   = document.getElementById("alerta");
const btnConfirmarRonda = document.getElementById("btnConfirmarRonda");

const alertSound = document.getElementById("alertSound");

const listaRelatorios = document.getElementById("listaRelatorios");

const STORAGE_KEY = "relatoriosRondaV07";

// Util
function formatMMSS(totalSeg){
  const m = String(Math.floor(totalSeg / 60)).padStart(2,"0");
  const s = String(totalSeg % 60).padStart(2,"0");
  return `${m}:${s}`;
}

function setDisplay(seg){ display.textContent = formatMMSS(seg); }

// Controle de botões conforme estado
function applyState(newState){
  estado = newState;

  if(estado === "inicial"){
    btnAjustar.disabled = false;
    btnIniciar.disabled = true;
    btnPausar.disabled  = true;
    btnZerar.disabled   = true;
    btnRelatorio.disabled = true;
  }

  if(estado === "ajustado"){
    btnAjustar.disabled = false;
    btnIniciar.disabled = false;
    btnPausar.disabled  = true;
    btnZerar.disabled   = true;
    btnRelatorio.disabled = true;
  }

  if(estado === "regressivo"){
    btnAjustar.disabled = true;
    btnIniciar.disabled = true;
    // Especificação: manter pausar/zerar/relatório desabilitados durante regressivo
    btnPausar.disabled  = true;
    btnZerar.disabled   = true;
    btnRelatorio.disabled = true;
  }

  if(estado === "zerou"){
    // Tempo zerou: habilitar pausar/zerar/relatório
    btnAjustar.disabled = true;
    btnIniciar.disabled = true;
    btnPausar.disabled  = false;
    btnZerar.disabled   = false;
    btnRelatorio.disabled = false;
  }

  if(estado === "ronda"){
    // Em ronda (progressivo): pausar/zerar/relatório habilitados
    btnAjustar.disabled = true;
    btnIniciar.disabled = true;
    btnPausar.disabled  = false;
    btnZerar.disabled   = false;
    btnRelatorio.disabled = false;
  }
}

// Fluxo
function ajustarCronometro(){
  const min = parseInt(inputTempo.value, 10);
  if(isNaN(min) || min < 1) return;

  const san = Math.min(Math.max(min,1), 60); // clamp 1..60
  tempoProgramadoSeg = san * 60;
  restanteSeg = tempoProgramadoSeg;
  clearInterval(countdownInterval);
  clearInterval(rondaInterval);
  setDisplay(restanteSeg);
  alerta.classList.add("hidden");
  applyState("ajustado");
}

function iniciarRegressivo(){
  if(tempoProgramadoSeg <= 0) return;
  restanteSeg = tempoProgramadoSeg;
  setDisplay(restanteSeg);
  applyState("regressivo");

  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    restanteSeg--;
    setDisplay(restanteSeg);

    if(restanteSeg <= 0){
      clearInterval(countdownInterval);
      setDisplay(0);
      // toca som e mostra alerta de início de ronda
      try { alertSound.currentTime = 0; alertSound.play(); } catch(e){}
      alerta.classList.remove("hidden");
      applyState("zerou");
    }
  }, 1000);
}

function confirmarRonda(){
  alerta.classList.add("hidden");
  rondaSeg = 0;
  setDisplay(rondaSeg);
  applyState("ronda");

  clearInterval(rondaInterval);
  rondaInterval = setInterval(() => {
    rondaSeg++;
    setDisplay(rondaSeg);
  }, 1000);

  // Muda texto do botão pausar para alternar Pausar/Retomar
  btnPausar.textContent = "⏸️ Pausar";
  btnPausar.dataset.paused = "false";
}

function pausarOuRetomar(){
  if(estado !== "ronda") return;

  const paused = btnPausar.dataset.paused === "true";
  if(!paused){
    // Pausar
    clearInterval(rondaInterval);
    btnPausar.textContent = "▶ Retomar";
    btnPausar.dataset.paused = "true";
  } else {
    // Retomar
    clearInterval(rondaInterval);
    rondaInterval = setInterval(() => {
      rondaSeg++;
      setDisplay(rondaSeg);
    }, 1000);
    btnPausar.textContent = "⏸️ Pausar";
    btnPausar.dataset.paused = "false";
  }
}

function zerarTudo(){
  clearInterval(countdownInterval);
  clearInterval(rondaInterval);
  tempoProgramadoSeg = 0;
  restanteSeg = 0;
  rondaSeg = 0;
  setDisplay(0);
  alerta.classList.add("hidden");
  inputTempo.disabled = false;
  applyState("inicial");
}

function gerarRelatorio(){
  const posto = (inputPosto.value || "Sem nome").trim();
  const obs   = (inputObs.value || "Sem observações").trim();
  const minutosProgramados = Math.floor((tempoProgramadoSeg || 0)/60);

  const rel = {
    data: new Date().toLocaleString("pt-BR"),
    posto,
    tempoRondaMin: minutosProgramados,
    observacao: obs
  };

  const lista = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  lista.push(rel);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));

  renderRelatorios(lista);

  // feedback visual 90s (sem toast moderno)
  alert("Relatório salvo no navegador.");
}

function renderRelatorios(lista){
  listaRelatorios.innerHTML = "";
  lista.forEach((r, idx) => {
    const li = document.createElement("li");
    li.textContent = `[${r.data}] Posto: ${r.posto} | Tempo: ${r.tempoRondaMin} min | Obs: ${r.observacao}`;
    listaRelatorios.appendChild(li);
  });
}

// Eventos
btnAjustar.addEventListener("click", ajustarCronometro);
btnIniciar.addEventListener("click", iniciarRegressivo);
btnConfirmarRonda.addEventListener("click", confirmarRonda);
btnPausar.addEventListener("click", pausarOuRetomar);
btnZerar.addEventListener("click", zerarTudo);
btnRelatorio.addEventListener("click", gerarRelatorio);

// Inicialização
(function init(){
  setDisplay(0);
  applyState("inicial");
  const lista = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  renderRelatorios(lista);
})();
