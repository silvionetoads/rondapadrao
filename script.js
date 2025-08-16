const btnIniciar = document.getElementById("btnIniciar");
const btnSalvar = document.getElementById("btnSalvar");
const cronometro = document.getElementById("cronometro");
const finalizacao = document.getElementById("finalizacao");
const historico = document.getElementById("historico");

let tempoRestante;
let intervalo;
let contando = false;

// Função para formatar tempo (MM:SS)
function formatarTempo(segundos) {
  const m = String(Math.floor(segundos / 60)).padStart(2, "0");
  const s = String(segundos % 60).padStart(2, "0");
  return `${m}:${s}`;
}

// Iniciar Ronda
btnIniciar.addEventListener("click", () => {
  const minutos = parseInt(document.getElementById("tempoRonda").value);
  const descricao = document.getElementById("descricaoRonda").value.trim();
  if (!descricao) {
    alert("Por favor, insira uma descrição da ronda!");
    return;
  }
  tempoRestante = minutos * 60;
  contando = "regressivo";

  clearInterval(intervalo);
  intervalo = setInterval(() => {
    if (tempoRestante > 0) {
      tempoRestante--;
      cronometro.textContent = formatarTempo(tempoRestante);

      // Alerta sonoro aos 10 minutos
      if (tempoRestante === 600) {
        let beep = new Audio("https://www.soundjay.com/button/beep-07.wav");
        beep.play();
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

// Salvar Ronda no histórico do navegador
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
