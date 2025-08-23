document.addEventListener("DOMContentLoaded", () => {
  const postoInput = document.getElementById("posto");
  const tempoPreparacaoInput = document.getElementById("tempoPreparacao");
  const iniciarBtn = document.getElementById("iniciarRonda");
  const statusDiv = document.getElementById("statusRonda");
  const cronometroDiv = document.getElementById("cronometro");
  const finalizarBtn = document.getElementById("finalizarRonda");
  const observacaoContainer = document.getElementById("observacaoContainer");
  const observacaoInput = document.getElementById("observacao");
  const salvarBtn = document.getElementById("salvarRonda");
  const relatorio = document.getElementById("relatorio");

  let tempoPreparacao;
  let tempoRonda = 0;
  let intervalo;
  let emPreparacao = false;
  let emRonda = false;

  function formatarTempo(segundos) {
    const min = Math.floor(segundos / 60);
    const sec = segundos % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  }

  iniciarBtn.addEventListener("click", () => {
    const posto = postoInput.value.trim();
    const minutos = parseInt(tempoPreparacaoInput.value);

    if (!posto) {
      alert("Por favor, informe o nome do posto.");
      return;
    }

    if (isNaN(minutos) || minutos <= 0) {
      alert("Por favor, informe o tempo de preparação válido.");
      return;
    }

    tempoPreparacao = minutos * 60;
    statusDiv.textContent = `Preparação iniciada no posto: ${posto}`;
    emPreparacao = true;

    iniciarBtn.disabled = true;
    cronometroDiv.textContent = formatarTempo(tempoPreparacao);

    intervalo = setInterval(() => {
      if (emPreparacao) {
        tempoPreparacao--;
        cronometroDiv.textContent = formatarTempo(tempoPreparacao);

        if (tempoPreparacao <= 0) {
          clearInterval(intervalo);
          iniciarRonda();
        }
      }
    }, 1000);
  });

  function iniciarRonda() {
    statusDiv.textContent = "Ronda em andamento...";
    emPreparacao = false;
    emRonda = true;
    tempoRonda = 0;
    finalizarBtn.classList.remove("hidden");

    intervalo = setInterval(() => {
      if (emRonda) {
        tempoRonda++;
        cronometroDiv.textContent = `⏱️ ${formatarTempo(tempoRonda)}`;
      }
    }, 1000);
  }

  finalizarBtn.addEventListener("click", () => {
    if (emRonda) {
      clearInterval(intervalo);
      emRonda = false;
      statusDiv.textContent = "Ronda finalizada. Preencha a observação.";
      finalizarBtn.classList.add("hidden");
      observacaoContainer.classList.remove("hidden");
    }
  });

  salvarBtn.addEventListener("click", () => {
    const posto = postoInput.value.trim();
    const observacao = observacaoInput.value.trim();

    if (!observacao) {
      alert("A observação da ronda é obrigatória.");
      return;
    }

    const registro = document.createElement("li");
    registro.textContent = `📍 Posto: ${posto} | ⏱️ Tempo de Ronda: ${formatarTempo(tempoRonda)} | Observação: ${observacao}`;

    relatorio.appendChild(registro);

    statusDiv.textContent = "Registro de ronda salvo com sucesso.";
    observacaoInput.value = "";
    observacaoContainer.classList.add("hidden");
    iniciarBtn.disabled = false;
    cronometroDiv.textContent = "";
  });
});
