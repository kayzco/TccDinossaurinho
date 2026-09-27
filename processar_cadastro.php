<?php
require "config.php";

$nome = trim($_POST["nome"] ?? "");
$email = trim($_POST["email"] ?? "");
$senhaDigitada = $_POST["senha"] ?? "";

if ($nome === "" || $email === "" || $senhaDigitada === "") {
    echo "<script> alert('Preencha todos os campos!'); window.location.href='cadastro.php'; </script>";
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "<script> alert('E-mail inválido!'); window.location.href='cadastro.php'; </script>";
    exit;
}

if (strlen($senhaDigitada) < 4) {
    echo "<script> alert('A senha deve ter pelo menos 4 caracteres!'); window.location.href='cadastro.php'; </script>";
    exit;
}

$senhaHash = password_hash($senhaDigitada, PASSWORD_DEFAULT);

$sql = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";
$stmt = $conexao->prepare($sql);
$stmt->bind_param("sss", $nome, $email, $senhaHash);

if ($stmt->execute()) {
    echo "<script> alert('Cadastro realizado com sucesso!'); window.location.href='login.php'; </script>";
} else {
    if ($conexao->errno === 1062) {
        echo "<script> alert('Esse e-mail já está cadastrado!'); window.location.href='cadastro.php'; </script>";
    } else {
        echo "<script> alert('Erro ao realizar o cadastro.'); window.location.href='cadastro.php'; </script>";
    }
}

$stmt->close();
$conexao->close();
?>
