<?php
require_once "auth.php";
require "config.php";

$email = trim($_POST["email"] ?? "");
$senhaDigitada = $_POST["senha"] ?? "";

if ($email === "" || $senhaDigitada === "") {
    echo "<script> alert('Preencha todos os campos!'); window.location.href='login.php'; </script>";
    exit;
}

$sql = "SELECT * FROM usuarios WHERE email = ?";
$stmt = $conexao->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows > 0) {
    $usuario = $resultado->fetch_assoc();

    if (password_verify($senhaDigitada, $usuario["senha"])) {
        $_SESSION["usuario_id"] = $usuario["id"];
        $_SESSION["nome"] = $usuario["nome"];
        header("Location: home.php");
        exit;
    } else {
        echo "<script> alert('Senha incorreta!'); window.location.href='login.php'; </script>";
    }
} else {
    echo "<script> alert('Usuário inexistente!'); window.location.href='login.php'; </script>";
}

$stmt->close();
$conexao->close();
?>

