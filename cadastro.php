<?php

require "config.php";

$conexao = new mysqli($servidor, $usuario, $senha, $banco);

if ($conexao->connect_error) {
    die("Erro na conexão com o banco de dados.");
}

$nome = trim($_POST["nome"] ?? "");
$email = trim($_POST["email"] ?? "");
$senhaDigitada = $_POST["senha"] ?? "";

if ($nome === "" || $email === "" || $senhaDigitada === "") {
    echo "<script> alert('Preencha todos os campos!'); window.history.back(); </script>";
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "<script> alert('E-mail inválido!'); window.history.back(); </script>";
    exit;
}

if (strlen($senhaDigitada) < 4) {
    echo "<script> alert('A senha deve ter pelo menos 4 caracteres!'); window.history.back(); </script>";
    exit;
}

$senhaHash = password_hash($senhaDigitada, PASSWORD_DEFAULT);

// Prepared statement: evita SQL Injection (o cadastro antigo não tinha isso)
$sql = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";
$stmt = $conexao->prepare($sql);
$stmt->bind_param("sss", $nome, $email, $senhaHash);

if ($stmt->execute()) {
    echo "<script> alert('Cadastro realizado com sucesso!'); window.location.href='login.html'; </script>";
} else {
    // Código 1062 = violação de UNIQUE (e-mail já cadastrado)
    if ($conexao->errno === 1062) {
        echo "<script> alert('Esse e-mail já está cadastrado!'); window.history.back(); </script>";
    } else {
        echo "<script> alert('Erro ao realizar o cadastro.'); window.history.back(); </script>";
    }
}

$stmt->close();
$conexao->close();

?>


