let bolinha = document.getElementById("bolinha");

let posicaoX = 0;
let posicaoY = (window.innerHeight / 2) - (bolinha.offsetHeight / 2);

bolinha.style.left = posicaoX + "px";
bolinha.style.top = posicaoY + "px";

document.addEventListener("keydown", function(event) {

    if (event.key == "ArrowRight") {
        posicaoX = posicaoX + 10;
    }

    if (event.key == "ArrowLeft") {
        posicaoX = posicaoX - 10;
    }

    if (event.key == "ArrowUp") {
        posicaoY = posicaoY - 10;
    }

    if (event.key == "ArrowDown") {
        posicaoY = posicaoY + 10;
    }

    if (posicaoY > (window.innerHeight / 2) - (bolinha.offsetHeight / 2)) {
        posicaoY = (window.innerHeight / 2) - (bolinha.offsetHeight / 2);
    }

    bolinha.style.left = posicaoX + "px";
    bolinha.style.top = posicaoY + "px";

});