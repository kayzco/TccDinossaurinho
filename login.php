
<?php

session_start();

$servidor = "localhost";
$usuario = "root";
$senha = "";
$banco = "tcc_dinossaurinho";

$conexao = new mysqli($servidor, $usuario, $senha, $banco);

if ($conexao->connect_error) {
    die("Erro na conexão com o banco de dados.");
}

$email = $_POST["email"];
$senhaDigitada = $_POST["senha"];

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

        header("Location: index.html");
        exit;

    } else {

        echo "Senha incorreta.";

    }

} else {

    echo "Usuário não encontrado.";

}

$stmt->close();
$conexao->close();

?>




