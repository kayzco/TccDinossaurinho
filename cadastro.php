<?php
require_once "auth.php";
require_once "icones.php";
redirecionarSeLogado();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro - TCC Dinossaurinho</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="tema.css">
    <link rel="stylesheet" href="login.css">
</head>
<body class="tela">
    <div class="cenario"></div>
    <div class="solo"></div>

    <div class="dino-balao">
        <span class="balao">&hearts;</span>
        <img class="dino-menu" src="dinossauro.png" alt="">
    </div>

    <main class="centro">
        <section class="painel">
            <h1>Criar conta</h1>
            <p class="sub">Preencha os dados para jogar</p>

            <form class="form" action="processar_cadastro.php" method="POST">
                <label class="campo"><?= icone("user") ?>
                    <input type="text" name="nome" placeholder="Nome" required>
                </label>
                <label class="campo"><?= icone("mail") ?>
                    <input type="email" name="email" placeholder="E-mail" required>
                </label>
                <label class="campo"><?= icone("lock") ?>
                    <input type="password" name="senha" placeholder="Senha" required>
                </label>
                <button class="btn btn-verde btn-centro" type="submit">Cadastrar</button>
            </form>

            <p class="ou">ou</p>
            <a class="btn btn-centro" href="login.php"><?= icone("voltar") ?> Voltar</a>
        </section>
    </main>
</body>
</html>