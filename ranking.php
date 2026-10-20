<?php
require_once "auth.php";
require_once "icones.php";
exigirLogin();

$top = [];
$minhaPos = null;
$minhaPontuacao = 0;
$erro = false;

try {
    require "config.php";
    $meuId = idUsuarioLogado();

    $res = $conexao->query("SELECT id, nome, maior_pontuacao FROM usuarios WHERE maior_pontuacao > 0 ORDER BY maior_pontuacao DESC, id ASC LIMIT 10");
    while ($linha = $res->fetch_assoc()) {
        $top[] = $linha;
    }

    // se o jogador não está no top 10, mostra a posição dele embaixo
    $estaNoTop = false;
    foreach ($top as $t) {
        if ((int)$t["id"] === (int)$meuId) { $estaNoTop = true; }
    }
    if (!$estaNoTop) {
        $stmt = $conexao->prepare("SELECT maior_pontuacao FROM usuarios WHERE id = ?");
        $stmt->bind_param("i", $meuId);
        $stmt->execute();
        $minhaPontuacao = (int)($stmt->get_result()->fetch_assoc()["maior_pontuacao"] ?? 0);
        if ($minhaPontuacao > 0) {
            $stmt = $conexao->prepare("SELECT COUNT(*) + 1 AS pos FROM usuarios WHERE maior_pontuacao > ?");
            $stmt->bind_param("i", $minhaPontuacao);
            $stmt->execute();
            $minhaPos = (int)$stmt->get_result()->fetch_assoc()["pos"];
        }
    }
} catch (Throwable $e) {
    $erro = true;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ranking - TCC Dinossaurinho</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="tema.css">
    <link rel="stylesheet" href="login.css">
</head>
<body class="tela">
    <div class="cenario"></div>
    <div class="solo"></div>

    <main class="centro">
        <section class="painel">
            <h1>Ranking</h1>
            <p class="sub">Os melhores jogadores</p>

            <?php if ($erro): ?>
                <p class="vazio">Não foi possível carregar o ranking.<br>Confira o banco de dados.</p>
            <?php elseif (count($top) === 0): ?>
                <p class="vazio">Ninguém pontuou ainda.<br>Seja o primeiro!</p>
            <?php else: ?>
                <table class="tabela">
                    <thead>
                        <tr><th class="pos">#</th><th>Usuário</th><th class="num">Pontuação</th></tr>
                    </thead>
                    <tbody>
                    <?php foreach ($top as $i => $t): ?>
                        <tr class="<?= ((int)$t["id"] === (int)idUsuarioLogado()) ? 'eu' : '' ?>">
                            <td class="pos"><?= $i === 0 ? icone("coroa") : $i + 1 ?></td>
                            <td><?= htmlspecialchars($t["nome"]) ?></td>
                            <td class="num"><?= (int)$t["maior_pontuacao"] ?></td>
                        </tr>
                    <?php endforeach; ?>
                    <?php if ($minhaPos !== null): ?>
                        <tr class="eu">
                            <td class="pos"><?= $minhaPos ?></td>
                            <td><?= htmlspecialchars(nomeUsuarioLogado()) ?></td>
                            <td class="num"><?= $minhaPontuacao ?></td>
                        </tr>
                    <?php endif; ?>
                    </tbody>
                </table>
            <?php endif; ?>

            <a class="btn btn-centro" href="home.php"><?= icone("voltar") ?> Voltar</a>
        </section>
    </main>
</body>
</html>