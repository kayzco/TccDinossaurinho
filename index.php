<?php
session_start();
require_once "auth.php";
require_once "icones.php";
exigirLogin();

// recorde atual do jogador (mostrado no "fim de jogo")
$recorde = 0;
try {
    require "config.php";
    $stmt = $conexao->prepare("SELECT maior_pontuacao FROM usuarios WHERE id = ?");
    $id = idUsuarioLogado();
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $recorde = (int)($stmt->get_result()->fetch_assoc()["maior_pontuacao"] ?? 0);
} catch (Throwable $e) {
    $recorde = 0;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>TCC Dinossaurinho</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="tema.css">
    <link rel="stylesheet" href="style.css">
</head>

<body>

<div id="jogo">
    <div id="fundo"></div>
    <div id="chao"></div>
    <img id="bolinha" src="dinossauro.png">
    <div id="pontos">00000</div>
    <div id="mensagemInicio">Pressione espaço para começar</div>

    <div id="hud">
        <span id="nomeJogador">Olá, <?php echo htmlspecialchars(nomeUsuarioLogado()); ?></span>
        <button id="btnPausa" class="btn btn-mini" type="button"><?= icone("pause") ?> Pausar</button>
        <a class="btn btn-mini" href="home.php"><?= icone("home") ?> Início</a>
        <a class="btn btn-mini" href="logout.php"><?= icone("exit") ?> Sair</a>
    </div>

   
    <div id="overlay" class="oculto">
        <section class="painel">
            <h2 id="overlayTitulo">Pausado</h2>
            <p id="overlayTexto" class="sub"></p>

            <div id="grupoPausa" class="botoes">
                <button id="btnContinuar" class="btn btn-verde" type="button"><?= icone("play") ?> Continuar</button>
                <span class="btn desativado" title="Em breve"><?= icone("gear") ?> Configurações</span>
                <a class="btn" href="home.php"><?= icone("home") ?> Menu principal</a>
            </div>

            <div id="grupoFim" class="botoes oculto">
                <button id="btnReiniciar" class="btn btn-verde" type="button"><?= icone("play") ?> Jogar de novo</button>
                <a class="btn" href="ranking.php"><?= icone("trophy") ?> Ranking</a>
                <a class="btn" href="home.php"><?= icone("home") ?> Menu principal</a>
            </div>
        </section>
    </div>
</div>

    <script>const RECORDE_INICIAL = <?php echo (int)$recorde; ?>;</script>
    <script src="script.js"></script>

</body>

</html>
