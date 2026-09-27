<?php
require_once "auth.php";

exigirLogin();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Início - Tcc Dinossaurinho</title>
    <link rel="stylesheet" href="home.css">
</head>
<body>
    <div id="home">
        <h1>Olá, <?php echo htmlspecialchars(nomeUsuarioLogado()); ?>!</h1>
        <nav id="menu">
            <a href="index.php">Jogar</a>
            <a href="logout.php">Sair</a>
        </nav>
    </div>
</body>
</html>