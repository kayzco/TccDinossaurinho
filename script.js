let bolinha = document.getElementById("bolinha");
let chaoEl = document.getElementById("chao");
let fundoEl = document.getElementById("fundo");
let mensagemEl = document.getElementById("mensagemInicio");

let posicaoX = 150;
let posicaoY = 0;
let velocidadeY = 0;
let gravidade = 0.7;
let forcaPulo = -15;
let noChao = true;

// --- controle do estado do jogo ---
let jogoIniciado = false;
let tempoInicio = 0;

// --- velocidade do cenário (sempre parte do mesmo valor) ---
const VELOCIDADE_INICIAL = 3;
const ACELERACAO = 0.05;      // quanto ganha de velocidade por segundo
const VELOCIDADE_MAXIMA = 15; // teto pra não ficar impossível

let velocidadeChao = 0;
let chaoOffset = 0;
let fundoOffset = 0;

function calcularChao() {
    return chaoEl.offsetTop - bolinha.offsetHeight;
}

bolinha.style.left = posicaoX + "px";
posicaoY = calcularChao();
bolinha.style.top = posicaoY + "px";

function iniciarJogo() {
    jogoIniciado = true;
    tempoInicio = performance.now();
    velocidadeChao = VELOCIDADE_INICIAL; // sempre reinicia do mesmo ponto
    mensagemEl.style.display = "none";
}

document.addEventListener("keydown", function(event) {
    if (event.key == "ArrowRight") posicaoX += 10;
    if (event.key == "ArrowLeft") posicaoX -= 10;

    if ((event.key == "ArrowUp" || event.code == "Space") && noChao) {
        if (!jogoIniciado) {
            iniciarJogo();
        }
        velocidadeY = forcaPulo;
        noChao = false;
    }

    bolinha.style.left = posicaoX + "px";
});

function loop(agora) {
    velocidadeY += gravidade;
    posicaoY += velocidadeY;

    let chao = calcularChao();
    if (posicaoY >= chao) {
        posicaoY = chao;
        velocidadeY = 0;
        noChao = true;
    }

    bolinha.style.top = posicaoY + "px";

    if (jogoIniciado) {
        let tempoDecorrido = (agora - tempoInicio) / 1000; // em segundos
        velocidadeChao = Math.min(
            VELOCIDADE_INICIAL + ACELERACAO * tempoDecorrido,
            VELOCIDADE_MAXIMA
        );

        chaoOffset -= velocidadeChao;
        chaoEl.style.backgroundPositionX = chaoOffset + "px";

        fundoOffset -= velocidadeChao * 0.1; // fundo sempre 10% da velocidade do chão
        fundoEl.style.backgroundPositionX = fundoOffset + "px";
    }

    requestAnimationFrame(loop);
}

window.addEventListener("resize", () => {
    if (noChao) posicaoY = calcularChao();
});

requestAnimationFrame(loop);