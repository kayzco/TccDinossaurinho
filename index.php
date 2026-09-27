<?php
session_start();
require_once "auth.php";
exigirLogin();
?>
<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>versao 1</title>

    <link rel="stylesheet" href="style.css">
</head>

<body>

<div id="jogo">
    <div id="fundo"></div>
    <div id="chao"></div>
    <img id="bolinha" src="dino1.gif">

    <div id="hud">
    <span id="nomeJogador">Olá, <?php echo htmlspecialchars(nomeUsuarioLogado()); ?></span>
    <a id="sair" href="home.php">Início</a>
    <a id="sair" href="logout.php">Sair</a>
</div>
</div>

    <script src="script.js"></script>

</body>

</html>
