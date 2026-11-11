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
let estrelasEl = document.getElementById("estrelas");
let infoEl = document.getElementById("infoEstrela");
let infoTextoEl = document.getElementById("infoEstrelaTexto");
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

// --- estrelinhas (colecionáveis com curiosidades sobre a Era Jurássica) ---
const ESTRELA_IMAGEM = "estrela.png";   // troque pelo seu PNG quando quiser
const ESTRELA_TAMANHO = 60;
const ESTRELA_ALTURA_MIN = 120;          // distância acima do chão (px)
const ESTRELA_ALTURA_MAX = 300;
const ESTRELA_DISTANCIA_MIN = 1800;      // distância percorrida entre uma estrela e outra
const ESTRELA_DISTANCIA_MAX = 4200;
const ESTRELA_BONUS = 50;
const INFO_DURACAO_MS = 7000;

const CURIOSIDADES = [
    "A Era Jurássica durou de cerca de 201 a 145 milhões de anos atrás.",
    "O nome Jurássico vem das montanhas do Jura, entre a França e a Suíça, onde rochas dessa época foram estudadas.",
    "O T. rex NÃO viveu no Jurássico! Ele é do Cretáceo, e está mais perto de nós no tempo do que do Stegosaurus.",
    "No Jurássico, o supercontinente Pangeia começou a se partir, abrindo caminho para o Oceano Atlântico.",
    "O Archaeopteryx, uma das primeiras aves conhecidas, viveu há cerca de 150 milhões de anos, no fim do Jurássico.",
    "Os saurópodes, como Diplodocus e Brachiosaurus, eram gigantes de pescoço comprido que comiam plantas e chegavam a mais de 20 metros.",
    "O Stegosaurus tinha placas nas costas e espinhos na cauda para se defender de predadores como o Allosaurus.",
    "O Allosaurus era um dos maiores predadores do Jurássico e caçava em terra firme.",
    "Pterossauros, ictiossauros e plesiossauros não eram dinossauros: eram répteis que voavam ou viviam no mar.",
    "O clima do Jurássico era quente e úmido, e as florestas eram de samambaias, cicas e coníferas.",
    "Ainda não existiam flores no Jurássico! As plantas com flores só surgiram depois, no Cretáceo.",
    "Enquanto os dinossauros dominavam a Terra, os mamíferos eram pequenininhos e viviam escondidos."
];

let estrelas = [];
let proximaEstrelaEm = 0;
let estrelasColetadas = 0;
let fatosRestantes = [];
let infoTimer = null;

function sortearEstrela() {
    proximaEstrelaEm = ESTRELA_DISTANCIA_MIN + Math.random() * (ESTRELA_DISTANCIA_MAX - ESTRELA_DISTANCIA_MIN);
}
sortearEstrela();

function proximoFato() {
    if (fatosRestantes.length == 0) fatosRestantes = CURIOSIDADES.slice();
    let i = Math.floor(Math.random() * fatosRestantes.length);
    return fatosRestantes.splice(i, 1)[0];
}

function criarEstrela() {
    let el = document.createElement("img");
    el.className = "estrela";
    el.src = ESTRELA_IMAGEM;
    el.style.width = ESTRELA_TAMANHO + "px";
    el.style.height = ESTRELA_TAMANHO + "px";
    jogoEl.appendChild(el);
    let altura = ESTRELA_ALTURA_MIN + Math.random() * (ESTRELA_ALTURA_MAX - ESTRELA_ALTURA_MIN);
    estrelas.push({ el: el, x: jogoEl.offsetWidth, altura: altura });
}

function atualizarEstrelas() {
    proximaEstrelaEm -= velocidadeChao;
    if (proximaEstrelaEm <= 0) {
        // não nasce colada num obstáculo
        let livre = obstaculos.every(o => o.x < jogoEl.offsetWidth - 350);
        if (livre) {
            criarEstrela();
            sortearEstrela();
        } else {
            proximaEstrelaEm = 150;
        }
    }

    let d = bolinha.getBoundingClientRect();
    let j = jogoEl.getBoundingClientRect();
    let dino = {
        esq: d.left - j.left + caixaDino.esq * d.width,
        dir: d.left - j.left + caixaDino.dir * d.width,
        topo: d.top - j.top + caixaDino.topo * d.height,
        base: d.top - j.top + caixaDino.base * d.height
    };

    for (let i = estrelas.length - 1; i >= 0; i--) {
        let e = estrelas[i];
        e.x -= velocidadeChao;
        let topo = superficieChao() - e.altura - ESTRELA_TAMANHO / 2;
        e.el.style.left = e.x + "px";
        e.el.style.top = topo + "px";

        let pegou = dino.dir > e.x && dino.esq < e.x + ESTRELA_TAMANHO &&
                    dino.base > topo && dino.topo < topo + ESTRELA_TAMANHO;
        if (pegou) {
            e.el.remove();
            estrelas.splice(i, 1);
            coletarEstrela();
        } else if (e.x + ESTRELA_TAMANHO < -50) {
            e.el.remove();
            estrelas.splice(i, 1);
        }
    }
}

function coletarEstrela() {
    estrelasColetadas++;
    pontos += ESTRELA_BONUS;
    if (estrelasEl) estrelasEl.textContent = "★ " + estrelasColetadas;
    mostrarInfo(proximoFato());
}

function mostrarInfo(texto) {
    infoTextoEl.textContent = texto;
    infoEl.classList.remove("oculto");
    infoEl.classList.remove("entrando");
    void infoEl.offsetWidth;           // reinicia a animação
    infoEl.classList.add("entrando");
    clearTimeout(infoTimer);
    infoTimer = setTimeout(esconderInfo, INFO_DURACAO_MS);
}

function esconderInfo() {
    infoEl.classList.add("oculto");
}

function limparEstrelas() {
    estrelas.forEach(e => e.el.remove());
    estrelas = [];
    estrelasColetadas = 0;
    sortearEstrela();
    if (estrelasEl) estrelasEl.textContent = "★ 0";
    esconderInfo();
}

function terminarJogo() {
    jogoIniciado = false;
    fimDeJogo = true;
    momentoDaMorte = performance.now();
    velocidadeChao = 0;
    esconderInfo();

    let final = Math.floor(pontos);
    let novoRecorde = final > recorde;
    if (novoRecorde) recorde = final;

    mostrarOverlay(
        "Fim de jogo",
        "Pontos: " + final + "\nEstrelas: " + estrelasColetadas + "\nRecorde: " + recorde + (novoRecorde ? "\nNovo recorde!" : ""),
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
    limparEstrelas();
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
        atualizarEstrelas();

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