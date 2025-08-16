document.addEventListener("DOMContentLoaded", () => {
  const descricaoInput = document.getElementById("descricaoRonda");
  const tempoInput = document.getElementById("tempoRonda");
  const btnProgramar = document.getElementById("btnProgramar");
  const btnZerar = document.getElementById("btnZerar");
  const btnSalvar = document.getElementById("btnSalvar");
  const btnLimparHistorico = document.getElementById("btnLimparHistorico");
  const cronometroDisplay = document.getElementById("cronometro");
  const finalizacao = document.getElementById("finalizacao");
  const observacoesInput = document.getElementById("observacoes");
  const historicoList = document.getElementById("historico");

  const alertaSom = new Audio("alerta1.mp3");

  let countdownInterval, countupInterval;
  let tempoRestante, tempoProgramado;
  let contandoRegressivo = false;
  let contandoProgressivo = false;
  let segundosDecorridos = 0;

  // Atualiza exibição do tempo
  function atualizarDisplay(segundos) {
    const min = String(Math.floor(segundos / 60)).padStart(2, "0");
    const sec = String(segundos % 60).padStart(2, "0");
    cronometroDisplay.textContent = `${min}:${sec}`;
  }

  // Reproduz 3 alertas sonoros
  function tocarTresBipes() {
    let contador = 0;
    function tocar() {
      if (contador < 3) {
        alertaSom.currentTime = 0;
        alertaSom.play();
        contador++;
        setTimeout(tocar, 1000); // intervalo de 1s entre bipes
      }
    }
    tocar();
  }

  // Inicia contagem regressiva
  function iniciarRegressiva() {
    const descricao = descricaoInput.value.trim();
    tempoProgramado = Math.min(Math.max(parseInt(tempoInput.value) || 1, 1), 60) * 60;
    tempoRestante = tempoProgramado;

    if (!descricao) {
      alert("Informe uma descrição para a ronda!");
      return;
    }

    contandoRegressivo = true;
    atualizarDisplay(tempoRestante);

    countdownInterval = setInterval(() => {
      tempoRestante--;
      atualizarDisplay(tempoRestante);

      // Aviso nos 10% finais
      if (tempoRestante === Math.floor(tempoProgramado * 0.1)) {
        tocarTresBipes();
      }

      if (tempoRestante <= 0) {
        clearInterval(countdownInterval);
        contandoRegressivo = false;
        iniciarProgressiva(descricao);
      }
    }, 1000);
  }

  // Inicia contagem progressiva
  function iniciarProgressiva(descricao) {
    contandoProgressivo = true;
    segundosDecorridos = 0;
    finalizacao.classList.remove("d-none");

    countupInterval = setInterval(() => {
      segundosDecorridos++;
      atualizarDisplay(segundosDecorridos);
    }, 1000);
  }

  // Zerar cronômetro
  function zerarCronometro() {
    clearInterval(countdownInterval);
    clearInterval(countupInterval);
    contandoRegressivo = false;
    contandoProgressivo = false;
    segundosDecorridos = 0;
    finalizacao.classList.add("d-none");
    atualizarDisplay(0);
  }

  // Salvar ronda no histórico
  function salvarRonda() {
    const descricao = descricaoInput.value.trim();
    const observacoes = observacoesInput.value.trim();
    const hora = new Date().toLocaleTimeString();

    if (!descricao) {
      alert("Descrição da ronda é obrigatória!");
      return;
    }

    const item = document.createElement("li");
    item.className = "list-group-item";
    item.textContent = `🕒 ${hora} - ${descricao} | Tempo: ${segundosDecorridos}s | Obs: ${observacoes}`;
    historicoList.appendChild(item);

    salvarHistoricoLocal();
    zerarCronometro();
    descricaoInput.value = "";
    observacoesInput.value = "";
  }

  // Salvar histórico no localStorage
  function salvarHistoricoLocal() {
    const itens = [];
    historicoList.querySelectorAll("li").forEach(li => itens.push(li.textContent));
    localStorage.setItem("historicoRondas", JSON.stringify(itens));
  }

  // Carregar histórico salvo
  function carregarHistorico() {
    const itens = JSON.parse(localStorage.getItem("historicoRondas")) || [];
    itens.forEach(texto => {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.textContent = texto;
      historicoList.appendChild(li);
    });
  }

  // Limpar histórico
  function limparHistorico() {
    if (confirm("Deseja realmente limpar todo o histórico de rondas?")) {
      localStorage.removeItem("historicoRondas");
      historicoList.innerHTML = "";
    }
  }

  // Eventos
  btnProgramar.addEventListener("click", iniciarRegressiva);
  btnZerar.addEventListener("click", zerarCronometro);
  btnSalvar.addEventListener("click", salvarRonda);
  btnLimparHistorico.addEventListener("click", limparHistorico);

  // Inicialização
  atualizarDisplay(0);
  carregarHistorico();
});
