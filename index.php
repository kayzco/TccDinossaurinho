<?php
session_start();

// Protege o jogo: sem login, não entra
if (!isset($_SESSION["usuario_id"])) {
    header("Location: login.html");
    exit;
}
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
        <span id="nomeJogador">Olá, <?php echo htmlspecialchars($_SESSION["nome"]); ?></span>
        <a id="sair" href="logout.php">Sair</a>
    </div>
</div>

    <script src="script.js"></script>

</body>

</html>
