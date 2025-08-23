let contadorElement = document.getElementById("contador");
let ajustarBtn = document.getElementById("ajustar");
let iniciarBtn = document.getElementById("iniciar");
let pausarBtn = document.getElementById("pausar");
let zerarBtn = document.getElementById("zerar");
let finalizarBtn = document.getElementById("finalizar");
let gerarBtn = document.getElementById("gerar");
let salvarBtn = document.getElementById("salvar");
let imprimirBtn = document.getElementById("imprimir");
let limparRelatorios = document.getElementById("limpar-relatorios");

let observacaoContainer = document.getElementById("observacao-container");
let relatoriosContainer = document.getElementById("relatorios-container");
let relatoriosList = document.getElementById("relatorios");

let postoInput = document.getElementById("posto");
let tempoInput = document.getElementById("tempo");
let observacaoInput = document.getElementById("observacao");

let tempo = 0;
let intervalo;
let emPreparacao = false;
let emRonda = false;
let segundosRonda = 0;
let intervaloRonda;

ajustarBtn.addEventListener("click", () => {
    if (postoInput.value === "" || tempoInput.value <= 0) {
        alert("Preencha o nome do posto e o tempo corretamente!");
        return;
    }
    tempo = tempoInput.value * 60;
    atualizarDisplay(tempo);
    iniciarBtn.disabled = false;
});

iniciarBtn.addEventListener("click", () => {
    if (tempo > 0 && !emPreparacao) {
        emPreparacao = true;
        iniciarContagemRegressiva();
    }
});

function iniciarContagemRegressiva() {
    intervalo = setInterval(() => {
        tempo--;
        atualizarDisplay(tempo);

        if (tempo <= 0) {
            clearInterval(intervalo);
            emPreparacao = false;
            iniciarCronometroRonda();
        }
    }, 1000);

    iniciarBtn.disabled = true;
    pausarBtn.disabled = false;
    zerarBtn.disabled = false;
}

function iniciarCronometroRonda() {
    segundosRonda = 0;
    emRonda = true;
    finalizarBtn.disabled = false;

    intervaloRonda = setInterval(() => {
        segundosRonda++;
        atualizarDisplay(segundosRonda);
    }, 1000);
}

function atualizarDisplay(segundos) {
    let min = String(Math.floor(segundos / 60)).padStart(2, "0");
    let sec = String(segundos % 60).padStart(2, "0");
    contadorElement.textContent = `${min}:${sec}`;
}

pausarBtn.addEventListener("click", () => {
    if (emPreparacao) {
        clearInterval(intervalo);
        emPreparacao = false;
    } else if (emRonda) {
        clearInterval(intervaloRonda);
        emRonda = false;
    }
});

zerarBtn.addEventListener("click", () => {
    clearInterval(intervalo);
    clearInterval(intervaloRonda);
    contadorElement.textContent = "00:00";
    tempo = 0;
    segundosRonda = 0;
    emPreparacao = false;
    emRonda = false;
    iniciarBtn.disabled = true;
    pausarBtn.disabled = true;
    zerarBtn.disabled = true;
    finalizarBtn.disabled = true;
    gerarBtn.disabled = true;
    observacaoContainer.classList.add("hidden");
});

finalizarBtn.addEventListener("click", () => {
    clearInterval(intervaloRonda);
    emRonda = false;
    observacaoContainer.classList.remove("hidden");
});

salvarBtn.addEventListener("click", () => {
    if (observacaoInput.value.trim() === "") {
        alert("A observação da ronda é obrigatória!");
        return;
    }

    let posto = postoInput.value;
    let tempoRonda = `${String(Math.floor(segundosRonda / 60)).padStart(2, "0")}:${String(segundosRonda % 60).padStart(2, "0")}`;
    let observacao = observacaoInput.value;

    let registro = `Posto: ${posto} | Tempo de Ronda: ${tempoRonda} | Observação: ${observacao}`;

    let li = document.createElement("li");
    li.textContent = registro;
    relatoriosList.appendChild(li);

    relatoriosContainer.classList.remove("hidden");

    // Salva na memória local
    let registros = JSON.parse(localStorage.getItem("relatorios")) || [];
    registros.push(registro);
    localStorage.setItem("relatorios", JSON.stringify(registros));

    observacaoInput.value = "";
    observacaoContainer.classList.add("hidden");
    gerarBtn.disabled = false;
});

gerarBtn.addEventListener("click", () => {
    alert("Relatório consolidado pronto!");
});

imprimirBtn.addEventListener("click", () => {
    window.print();
});

limparRelatorios.addEventListener("click", () => {
    if (confirm("Deseja realmente limpar todos os relatórios?")) {
        localStorage.removeItem("relatorios");
        relatoriosList.innerHTML = "";
    }
});

// Recarregar registros salvos
window.addEventListener("load", () => {
    let registros = JSON.parse(localStorage.getItem("relatorios")) || [];
    if (registros.length > 0) {
        relatoriosContainer.classList.remove("hidden");
        registros.forEach(r => {
            let li = document.createElement("li");
            li.textContent = r;
            relatoriosList.appendChild(li);
        });
    }
});
