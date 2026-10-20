<?php
// Recebe a pontuação no fim da partida e guarda só se for o novo recorde.
require_once "auth.php";
header("Content-Type: application/json; charset=utf-8");

if (!estaLogado() || $_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(403);
    echo json_encode(["ok" => false]);
    exit;
}

$pontos = filter_var($_POST["pontos"] ?? null, FILTER_VALIDATE_INT, ["options" => ["min_range" => 0, "max_range" => 10000000]]);
if ($pontos === false || $pontos === null) {
    http_response_code(400);
    echo json_encode(["ok" => false]);
    exit;
}

try {
    require "config.php";
    $id = idUsuarioLogado();

    $stmt = $conexao->prepare("UPDATE usuarios SET maior_pontuacao = GREATEST(COALESCE(maior_pontuacao, 0), ?) WHERE id = ?");
    $stmt->bind_param("ii", $pontos, $id);
    $stmt->execute();

    $stmt = $conexao->prepare("SELECT maior_pontuacao FROM usuarios WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $recorde = (int)$stmt->get_result()->fetch_assoc()["maior_pontuacao"];

    echo json_encode(["ok" => true, "recorde" => $recorde]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["ok" => false]);
}