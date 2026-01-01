<?php
require_once __DIR__ . '/../config/env.php';
try {
    $dsn = $_ENV['DB_DRIVER'] .
        ":host=" . $_ENV['DB_HOST'] .
        ";dbname=" . $_ENV['DB_NAME'] .
        ";port=" . $_ENV['DB_PORT'] .
        ";charset=" . $_ENV['DB_CHARSET'];
    $pdo = new PDO(
        $dsn,
        $_ENV['DB_USER'],
        $_ENV['DB_PASS'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database Connection failed",
        "error" => $e->getMessage()
    ]);
    exit;
}