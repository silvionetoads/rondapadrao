const btnProgramar = document.getElementById("btnProgramar");
const btnZerar = document.getElementById("btnZerar");
const btnSalvar = document.getElementById("btnSalvar");
const btnLimparHistorico = document.getElementById("btnLimparHistorico");
const cronometro = document.getElementById("cronometro");
const finalizacao = document.getElementById("finalizacao");
const historico = document.getElementById("historico");

let tempoRestante;
let intervalo;
let contando = false;
let tempoTotal = 0;

// Formata o tempo para MM:SS
function formatarTempo(segundos) {
  const m = String(Math.floor(segundos / 60)).padStart(2, "0");
  const s = String(segundos % 60).padStart(2, "0");
  return `${m}:${s}`;
}

// Programar Ronda (inicia regressivo)
btnProgramar.addEventListener("click", () => {
  const minutos = parseInt(document.getElementById("tempoRonda").value);
  const descricao = document.getElementById("descricaoRonda").value.trim();

  if (!descricao) {
    alert("Por favor, insira uma descrição da ronda!");
    return;
  }

  tempoRestante = minutos * 60;
  tempoTotal = tempoRestante;
  contando = "regressivo";

  clearInterval(intervalo);
  intervalo = setInterval(() => {
    if (tempoRestante > 0) {
      tempoRestante--;
      cronometro.textContent = formatarTempo(tempoRestante);

      // Alerta sonoro quando atingir 10% do tempo
      if (tempoRestante === Math.floor(tempoTotal * 0.1)) {
        let beep = new Audio("https://www.soundjay.com/button/beep-07.wav");
        // tocar 3 bipes
        beep.play();
        setTimeout(() => beep.play(), 700);
        setTimeout(() => beep.play(), 1400);
      }
    } else {
      clearInterval(intervalo);
      iniciarProgressivo();
    }
  }, 1000);
});

// Inicia cronômetro progressivo
function iniciarProgressivo() {
  contando = "progressivo";
  let tempo = 0;
  intervalo = setInterval(() => {
    tempo++;
    cronometro.textContent = formatarTempo(tempo);
  }, 1000);
  finalizacao.classList.remove("d-none");
}

// Zerar cronômetro (reset total)
btnZerar.addEventListener("click", () => {
  clearInterval(intervalo);
  cronometro.textContent = "00:00";
  finalizacao.classList.add("d-none");
  contando = false;
});

// Salvar Ronda no histórico
btnSalvar.addEventListener("click", () => {
  const descricao = document.getElementById("descricaoRonda").value;
  const obs = document.getElementById("observacoes").value;
  const data = new Date().toLocaleString();

  const registro = `${data} - ${descricao} | Observações: ${obs}`;

  let rondas = JSON.parse(localStorage.getItem("rondas")) || [];
  rondas.push(registro);
  localStorage.setItem("rondas", JSON.stringify(rondas));

  carregarHistorico();
  alert("Ronda salva com sucesso!");
  finalizacao.classList.add("d-none");
});

// Limpar histórico
btnLimparHistorico.addEventListener("click", () => {
  if (confirm("⚠️ Deseja realmente apagar todo o histórico de rondas?")) {
    localStorage.removeItem("rondas");
    carregarHistorico();
    alert("Histórico de rondas apagado!");
  }
});

// Carregar histórico
function carregarHistorico() {
  historico.innerHTML = "";
  let rondas = JSON.parse(localStorage.getItem("rondas")) || [];
  rondas.forEach(r => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = r;
    historico.appendChild(li);
  });
}
carregarHistorico();
