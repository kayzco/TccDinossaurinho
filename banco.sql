
CREATE DATABASE IF NOT EXISTS tcc_dinossaurinho
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_general_ci;

USE tcc_dinossaurinho;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    maior_pontuacao INT DEFAULT 0
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
