<?php
require_once "auth.php";
redirecionarSeLogado();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro - Tcc Dinossaurinho</title>
    <link rel="stylesheet" href="cadastro.css">
</head>
<body>
    <div id="cadastro">
        <h1>Criar conta</h1>
        <form action="processar_cadastro.php" method="POST">
            <input type="text" name="nome" placeholder="Nome" required>
            <input type="email" name="email" placeholder="Email" required>
            <input type="password" name="senha" placeholder="Senha" required>
            <button type="submit">Cadastrar</button>
        </form>
        <p>Já tem uma conta?</p>
        <a class="voltar" href="login.php">Voltar para o login</a>
    </div>
</body>
</html>