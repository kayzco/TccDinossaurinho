<?php

session_start();
require "config.php";

$email = trim($_POST["email"] ?? "");
$senhaDigitada = $_POST["senha"] ?? "";

if ($email === "" || $senhaDigitada === "") {
    echo "<script> alert('Preencha todos os campos!'); window.history.back(); </script>";
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

        header("Location: index.php");
        exit;

    } else {
        echo "<script> alert('Senha incorreta!'); window.history.back(); </script>";
    }

} else {
    echo "<script> alert('Usuário inexistente!'); window.history.back(); </script>";
}

$stmt->close();
$conexao->close();

?>

