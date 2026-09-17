<?php

$servidor = "localhost";
$usuario = "root";
$senha = "";
$banco = "tcc_dinossaurinho";

$conexao = new mysqli($servidor, $usuario, $senha, $banco);

if ($conexao->connect_error) {
    die("Erro na conexão com o banco de dados.");
}

$nome = $_POST["nome"];
$email = $_POST["email"];
$senha = $_POST["senha"];

$senha = password_hash($senha, PASSWORD_DEFAULT);

$sql = "INSERT INTO usuarios (nome, email, senha)
        VALUES ('$nome', '$email', '$senha')";

if ($conexao->query($sql) === TRUE) {
    echo "Cadastro realizado com sucesso!";
} else {
    echo "Erro ao realizar o cadastro.";
}

$conexao->close();

?>