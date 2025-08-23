let timer;
let tempoRestante;
let emContagem = false;

const cronometro = document.getElementById("cronometro");
const play = document.getElementById("play");
const zerar = document.getElementById("zerar");
const finalizar = document.getElementById("finalizar");
const relatorio = document.getElementById("relatorio");
const alerta = document.getElementById("alerta");
const confirmarRonda = document.getElementById("confirmarRonda");
const somAlerta = document.getElementById("somAlerta");
const listaHistorico = document.getElementById("listaHistorico");
const imprimir = document.getElementById("imprimir");
const limpar = document.getElementById("limpar");

function formatarTempo(segundos) {
    const min = String(Math.floor(segundos / 60)).padStart(2, "0");
    const sec = String(segundos % 60).padStart(2, "0");
    return `${min}:${sec}`;
}

play.addEventListener("click", () => {
    const tempo = parseInt(document.getElementById("tempo").value) * 60;
    if (isNaN(tempo) || tempo <= 0) return;

    tempoRestante = tempo;
    emContagem = true;

    play.disabled = true;
    zerar.disabled = true;
    relatorio.disabled = true;
    finalizar.disabled = true;

    timer = setInterval(() => {
        tempoRestante--;
        cronometro.textContent = formatarTempo(tempoRestante);

        if (tempoRestante <= 0) {
            clearInterval(timer);
            somAlerta.play();
            alerta.classList.remove("hidden");
        }
    }, 1000);
});

confirmarRonda.addEventListener("click", () => {
    alerta.classList.add("hidden");
    finalizar.disabled = false;
});

finalizar.addEventListener("click", () => {
    emContagem = false;
    play.disabled = false;
    zerar.disabled = false;
    relatorio.disabled = false;
    finalizar.disabled = true;

    const posto = document.getElementById("posto").value || "Sem Nome";
    const obs = document.getElementById("observacao").value || "Sem Observação";
    const data = new Date().toLocaleString();

    const item = document.createElement("li");
    item.textContent = `[${data}] Posto: ${posto} | Observação: ${obs}`;
    listaHistorico.appendChild(item);
});

zerar.addEventListener("click", () => {
    clearInterval(timer);
    cronometro.textContent = "00:00";
    emContagem = false;
    play.disabled = false;
});

imprimir.addEventListener("click", () => {
    const conteudo = document.getElementById("historico").innerHTML;
    const w = window.open("", "", "width=600,height=400");
    w.document.write("<h1>Histórico de Rond as</h1>" + conteudo);
    w.print();
});

limpar.addEventListener("click", () => {
    listaHistorico.innerHTML = "";
});
