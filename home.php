<?php
require_once "auth.php";
require_once "icones.php";
exigirLogin();

// recorde do jogador (se o banco/coluna não existir, mostra 0)
$recorde = 0;
try {
    require "config.php";
    $stmt = $conexao->prepare("SELECT maior_pontuacao FROM usuarios WHERE id = ?");
    $id = idUsuarioLogado();
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $linha = $stmt->get_result()->fetch_assoc();
    $recorde = (int)($linha["maior_pontuacao"] ?? 0);
} catch (Throwable $e) {
    $recorde = 0;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Início - TCC Dinossaurinho</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="tema.css">
    <link rel="stylesheet" href="home.css">
</head>
<body class="tela">
    <div class="cenario"></div>
    <div class="solo"></div>
    <img class="dino-menu" src="dinossauro.png" alt="">

    <div class="saudacao">
        Olá, <?php echo htmlspecialchars(nomeUsuarioLogado()); ?><br>
        Recorde: <?php echo $recorde; ?>
    </div>

    <main id="inicio">
        <h1 class="logo">
            <span class="tcc">TCC</span>
            <span class="nome">Dinossaurinho</span>
        </h1>

        <nav class="botoes">
            <a class="btn btn-verde" href="index.php"><?= icone("play") ?> Jogar</a>
            <a class="btn" href="ranking.php"><?= icone("user") ?> Ranking</a>
            <span class="btn desativado" title="Em breve"><?= icone("gear") ?> Configurações</span>
            <a class="btn" href="logout.php"><?= icone("exit") ?> Sair</a>
        </nav>
    </main>
</body>
</html>