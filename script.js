let bolinha = document.getElementById("bolinha");
let chaoEl = document.getElementById("chao");
let fundoEl = document.getElementById("fundo");

let posicaoX = 150;
let posicaoY = 0;
let velocidadeY = 0;
let gravidade = 0.7;
let forcaPulo = -15;
let noChao = true;

let velocidadeChao = 5;
let chaoOffset = 0;

let velocidadeFundo = 0.5;   // bem mais lento que o chão
let fundoOffset = 0;

function calcularChao() {
    return chaoEl.offsetTop - bolinha.offsetHeight;
}

bolinha.style.left = posicaoX + "px";
posicaoY = calcularChao();
bolinha.style.top = posicaoY + "px";

document.addEventListener("keydown", function(event) {
    if (event.key == "ArrowRight") posicaoX += 10;
    if (event.key == "ArrowLeft") posicaoX -= 10;

    if ((event.key == "ArrowUp" || event.code == "Space") && noChao) {
        velocidadeY = forcaPulo;
        noChao = false;
    }

    bolinha.style.left = posicaoX + "px";
});

function loop() {
    velocidadeY += gravidade;
    posicaoY += velocidadeY;

    let chao = calcularChao();
    if (posicaoY >= chao) {
        posicaoY = chao;
        velocidadeY = 0;
        noChao = true;
    }

    bolinha.style.top = posicaoY + "px";

    chaoOffset -= velocidadeChao;
    chaoEl.style.backgroundPositionX = chaoOffset + "px";

    fundoOffset -= velocidadeFundo;
    fundoEl.style.backgroundPositionX = fundoOffset + "px";

    requestAnimationFrame(loop);
}

window.addEventListener("resize", () => {
    if (noChao) posicaoY = calcularChao();
});

loop();