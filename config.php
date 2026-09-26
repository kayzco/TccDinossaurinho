<?php

$servidor = "localhost";
$usuario  = "root";
$senhaBanco = "";
$banco    = "tcc_dinossaurinho";

$conexao = new mysqli($servidor, $usuario, $senhaBanco, $banco);

if ($conexao->connect_error) {
    die("Erro na conexão com o banco de dados.");
}

$conexao->set_charset("utf8mb4");