let bolinha = document.getElementById("bolinha");
let chaoEl = document.getElementById("chao");
let fundoEl = document.getElementById("fundo");

let posicaoX = 150;
let posicaoY = 0;
let velocidadeY = 0;
let gravidade = 0.5;
let forcaPulo = -16;
let noChao = true;


let jogoIniciado = false;
let tempoInicio = 0;


const VELOCIDADE_INICIAL = 6;
const ACELERACAO = 0.05;      
const VELOCIDADE_MAXIMA = 16; 

let velocidadeChao = 0;
let chaoOffset = 0;
let fundoOffset = 0;


let margemDino = 0;   
let caixaDino = { esq: 0, dir: 1, topo: 0, base: 1 };
let margemChao = 0;   // f

function medirMargem(img, lado) {
    try {
        let c = document.createElement("canvas");
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        let ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0);
        let dados = ctx.getImageData(0, 0, c.width, c.height).data;
        let linhaTemPixel = (y) => {
            for (let x = 0; x < c.width; x++) {
                if (dados[(y * c.width + x) * 4 + 3] > 20) return true;
            }
            return false;
        };
        let n = 0;
        if (lado == "baixo") {
            for (let y = c.height - 1; y >= 0 && !linhaTemPixel(y); y--) n++;
        } else {
            for (let y = 0; y < c.height && !linhaTemPixel(y); y++) n++;
        }
        return n / c.height;
    } catch (e) {
        return 0; 
    }
}


function medirCaixa(img) {
    try {
        let c = document.createElement("canvas");
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        let ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0);
        let d = ctx.getImageData(0, 0, c.width, c.height).data;
        let minX = c.width, maxX = 0, minY = c.height, maxY = 0;
        for (let y = 0; y < c.height; y++) {
            for (let x = 0; x < c.width; x++) {
                if (d[(y * c.width + x) * 4 + 3] > 20) {
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }
        if (maxX < minX) return caixaDino;
        return { esq: minX / c.width, dir: (maxX + 1) / c.width, topo: minY / c.height, base: (maxY + 1) / c.height };
    } catch (e) {
        return caixaDino;
    }
}

function carregarImagem(src, callback) {
    let img = new Image();
    img.onload = () => callback(img);
    img.src = src;
}

carregarImagem(bolinha.getAttribute("src"), (img) => {
    caixaDino = medirCaixa(img);
    margemDino = 1 - caixaDino.base;
    if (noChao) posicaoY = calcularChao();
});

let urlChao = getComputedStyle(chaoEl).backgroundImage.replace(/^url\(["']?|["']?\)$/g, "");
carregarImagem(urlChao, (img) => {
    margemChao = medirMargem(img, "cima");
    if (noChao) posicaoY = calcularChao();
});


const POSICAO_SUPERFICIE = 0.62;

/
const AFUNDAR_DINO = 70;

function posicionarChao() {
    let alturaTela = document.getElementById("jogo").offsetHeight;
    let topo = alturaTela * POSICAO_SUPERFICIE - chaoEl.offsetHeight * margemChao;
    chaoEl.style.top = topo + "px";
}

function calcularChao() {
    posicionarChao();
    let topoVisivelChao = chaoEl.offsetTop + chaoEl.offsetHeight * margemChao;
    let pesDino = bolinha.offsetHeight * (1 - margemDino);
    return topoVisivelChao - pesDino + AFUNDAR_DINO;
}

bolinha.style.left = posicaoX + "px";
posicaoY = calcularChao();
bolinha.style.top = posicaoY + "px";

// --- obstáculos ---
const OBSTACULO_IMAGEM = "obs1.png";   
const OBSTACULO_ALTURA_MIN = 100;
const OBSTACULO_ALTURA_MAX = 150;
const OBSTACULO_LARGURA = 50;
const DISTANCIA_MIN = 450;     
const DISTANCIA_MAX = 900;     

let caixaObstaculo = { esq: 0, dir: 1, topo: 0, base: 1 };
let proporcaoObstaculo = 0;    
if (OBSTACULO_IMAGEM) {
    carregarImagem(OBSTACULO_IMAGEM, (img) => {
        proporcaoObstaculo = img.naturalWidth / img.naturalHeight;
        caixaObstaculo = medirCaixa(img);
    });
}

let obstaculos = [];           
let proximoObstaculoEm = 0;    
let fimDeJogo = false;
let momentoDaMorte = 0;
let pontos = 0;

let jogoEl = document.getElementById("jogo");
let mensagemEl = document.getElementById("mensagemInicio");
let pontosEl = document.getElementById("pontos");
let overlayEl = document.getElementById("overlay");
let overlayTituloEl = document.getElementById("overlayTitulo");
let overlayTextoEl = document.getElementById("overlayTexto");
let grupoPausaEl = document.getElementById("grupoPausa");
let grupoFimEl = document.getElementById("grupoFim");

let pausado = false;
let pausadoEm = 0;
let recorde = (typeof RECORDE_INICIAL !== "undefined") ? RECORDE_INICIAL : 0;

function formatarPontos(n) {
    return String(Math.floor(n)).padStart(5, "0");
}

function mostrarOverlay(titulo, texto, modo) {
    overlayTituloEl.textContent = titulo;
    overlayTextoEl.textContent = texto;
    grupoPausaEl.classList.toggle("oculto", modo != "pausa");
    grupoFimEl.classList.toggle("oculto", modo != "fim");
    overlayEl.classList.remove("oculto");
}

function esconderOverlay() {
    overlayEl.classList.add("oculto");
}

function pausar() {
    if (!jogoIniciado || fimDeJogo || pausado) return;
    pausado = true;
    pausadoEm = performance.now();
    mostrarOverlay("Pausado", "", "pausa");
}

function continuar() {
    if (!pausado) return;
    
    tempoInicio += performance.now() - pausadoEm;
    pausado = false;
    esconderOverlay();
}

document.getElementById("btnPausa").addEventListener("click", function() {
    this.blur();
    pausar();
});
document.getElementById("btnContinuar").addEventListener("click", function() {
    this.blur();
    continuar();
});
document.getElementById("btnReiniciar").addEventListener("click", function() {
    this.blur();
    reiniciarJogo();
});
document.addEventListener("visibilitychange", () => { if (document.hidden) pausar(); });



const AFUNDAR_OBSTACULO = 5;

function superficieChao() {
    return chaoEl.offsetTop + chaoEl.offsetHeight * margemChao + AFUNDAR_DINO + AFUNDAR_OBSTACULO;
}

function criarObstaculo() {
    let altura = OBSTACULO_ALTURA_MIN + Math.random() * (OBSTACULO_ALTURA_MAX - OBSTACULO_ALTURA_MIN);
    let el = document.createElement("div");
    el.className = "obstaculo";
    let largura = proporcaoObstaculo ? altura * proporcaoObstaculo : OBSTACULO_LARGURA;
    el.style.width = largura + "px";
    el.style.height = altura + "px";
    if (OBSTACULO_IMAGEM) {
        el.style.backgroundImage = 'url("' + OBSTACULO_IMAGEM + '")';
        el.classList.add("com-imagem");
    }
    jogoEl.appendChild(el);
    obstaculos.push({ el: el, x: jogoEl.offsetWidth, largura: largura, altura: altura, caixa: caixaObstaculo });
}

function atualizarObstaculos() {
    proximoObstaculoEm -= velocidadeChao;
    if (proximoObstaculoEm <= 0) {
        criarObstaculo();
        let extra = velocidadeChao * 20; 
        proximoObstaculoEm = DISTANCIA_MIN + Math.random() * (DISTANCIA_MAX - DISTANCIA_MIN) + extra;
    }

    for (let i = obstaculos.length - 1; i >= 0; i--) {
        let o = obstaculos[i];
        o.x -= velocidadeChao;
        o.el.style.left = o.x + "px";
        
        o.el.style.top = (superficieChao() - o.altura * o.caixa.base) + "px";

        if (o.x + o.largura < -50) {
            o.el.remove();
            obstaculos.splice(i, 1);
        }
    }
}


function colidiu() {
    let d = bolinha.getBoundingClientRect();
    let j = jogoEl.getBoundingClientRect();
    let largVis = (caixaDino.dir - caixaDino.esq) * d.width;
    let altVis = (caixaDino.base - caixaDino.topo) * d.height;
    let dino = {
        esq: d.left - j.left + caixaDino.esq * d.width + largVis * 0.15,
        dir: d.left - j.left + caixaDino.dir * d.width - largVis * 0.15,
        topo: d.top - j.top + caixaDino.topo * d.height + altVis * 0.1,
        base: d.top - j.top + caixaDino.base * d.height - altVis * 0.05
    };
    for (let o of obstaculos) {
        let c = o.caixa;
        let topoArq = superficieChao() - o.altura * c.base;
        let visW = (c.dir - c.esq) * o.largura;
        let esqO = o.x + c.esq * o.largura + visW * 0.1;
        let dirO = o.x + c.dir * o.largura - visW * 0.1;
        let topoO = topoArq + c.topo * o.altura + (c.base - c.topo) * o.altura * 0.1;
        let baseO = topoArq + c.base * o.altura;
        if (dino.dir > esqO && dino.esq < dirO &&
            dino.base > topoO && dino.topo < baseO) {
            return true;
        }
    }
    return false;
}

function terminarJogo() {
    jogoIniciado = false;
    fimDeJogo = true;
    momentoDaMorte = performance.now();
    velocidadeChao = 0;

    let final = Math.floor(pontos);
    let novoRecorde = final > recorde;
    if (novoRecorde) recorde = final;

    mostrarOverlay(
        "Fim de jogo",
        "Pontos: " + final + "\nRecorde: " + recorde + (novoRecorde ? "\nNovo recorde!" : ""),
        "fim"
    );

    
    fetch("salvar_pontuacao.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "pontos=" + final
    }).catch(() => {});
}

function reiniciarJogo() {
    obstaculos.forEach(o => o.el.remove());
    obstaculos = [];
    proximoObstaculoEm = DISTANCIA_MIN;
    pontos = 0;
    fimDeJogo = false;
    esconderOverlay();
    if (pontosEl) pontosEl.textContent = formatarPontos(0);
    iniciarJogo();
}

function iniciarJogo() {
    jogoIniciado = true;
    tempoInicio = performance.now();
    velocidadeChao = VELOCIDADE_INICIAL; 
    proximoObstaculoEm = Math.max(proximoObstaculoEm, DISTANCIA_MIN);
    if (mensagemEl) mensagemEl.style.display = "none";
}

document.addEventListener("keydown", function(event) {
    if (event.key == "Escape" || event.code == "KeyP") {
        if (pausado) continuar(); else pausar();
        return;
    }
    if (pausado) return;

    if (event.key == "ArrowRight") posicaoX += 10;
    if (event.key == "ArrowLeft") posicaoX -= 10;

    let apertouPulo = (event.key == "ArrowUp" || event.code == "Space");
    if (apertouPulo) event.preventDefault();

    if (fimDeJogo) {
        
        if (apertouPulo && performance.now() - momentoDaMorte > 500) reiniciarJogo();
    } else if (apertouPulo && noChao) {
        if (!jogoIniciado) {
            iniciarJogo();
        }
        velocidadeY = forcaPulo;
        noChao = false;
    }

    bolinha.style.left = posicaoX + "px";
});

function loop(agora) {
    if (pausado) {
        requestAnimationFrame(loop);
        return;
    }

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
        let tempoDecorrido = (agora - tempoInicio) / 1000; 
        velocidadeChao = Math.min(
            VELOCIDADE_INICIAL + ACELERACAO * tempoDecorrido,
            VELOCIDADE_MAXIMA
        );

        chaoOffset -= velocidadeChao;
        chaoEl.style.backgroundPositionX = chaoOffset + "px";

        fundoOffset -= velocidadeChao * 0.1; 
        fundoEl.style.backgroundPositionX = fundoOffset + "px";

        atualizarObstaculos();

        pontos += velocidadeChao * 0.05;
        if (pontosEl) pontosEl.textContent = formatarPontos(pontos);

        if (colidiu()) terminarJogo();
    }

    requestAnimationFrame(loop);
}

window.addEventListener("resize", () => {
    if (noChao) posicaoY = calcularChao();
});

requestAnimationFrame(loop);