<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function estaLogado() {
    return isset($_SESSION["usuario_id"]);
}

function exigirLogin() {
    if (!estaLogado()) {
        header("Location: login.php");
        exit;
    }
}

function redirecionarSeLogado() {
    if (estaLogado()) {
        header("Location: home.php");
        exit;
    }
}

function idUsuarioLogado() {
    return $_SESSION["usuario_id"] ?? null;
}

function nomeUsuarioLogado() {
    return $_SESSION["nome"] ?? "";
}