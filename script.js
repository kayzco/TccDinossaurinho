let bolinha = document.getElementById("bolinha");
let posicao = 0;

document.addEventListener("keydown", function(event) {

    if (event.key == "ArrowRight") {
        posicao = posicao + 10;
    }

    if (event.key == "ArrowLeft") {
        posicao = posicao - 10;
    }

    bolinha.style.left = posicao + "px";

});