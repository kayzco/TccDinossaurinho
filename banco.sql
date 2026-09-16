CREATE DATABASE tcc_dinossaurinho;

USE tcc_dinossaurinho;
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    maior_pontuacao INT DEFAULT 0
);