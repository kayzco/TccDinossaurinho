let bolinha = document.getElementById("bolinha");
let posicaoX = 150;
let posicaoY = 0;
let velocidadeY = 0;
let gravidade = 0.7;
let forcaPulo = -15;
let noChao = true;
bolinha.style.left = posicaoX + "px";
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

function pular() {
    velocidadeY += gravidade;
    posicaoY += velocidadeY;

    let chao = 572;
    if (posicaoY >= chao) {
        posicaoY = chao;
        velocidadeY = 0;
        noChao = true;
    }

    bolinha.style.top = posicaoY + "px";
    requestAnimationFrame(pular);
}

function atualizarPosicao() {
    bolinha.style.left = posicaoX + "px";
    bolinha.style.top = posicaoY + "px";
}

pular();