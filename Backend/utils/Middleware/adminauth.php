<?php
require_once __DIR__ . '/../config/db.php';
header("Content-Type: application/json");


use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

$secretKey = $_ENV['JWT_SECRET_KEY'];


$headers = getallheaders();
if (!isset($headers['Authorization'])) {
    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "message" => "Unauthorized"
    ]);
    exit;
}

if (!preg_match('/^Bearer\s/', $headers['Authorization'], $matches)) {
    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "message" => "Unauthorized"
    ]);
    exit;
}
$token = $matches[1];

try {
    $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));
    if ($decoded->role !== 'admin') {
        http_response_code(401);
        echo json_encode([
            "status" => "error",
            "message" => "Unauthorized"
        ]);
        exit;
    }
    $GLOBALS['auth_user'] = $decoded;
} catch (Throwable $th) {
    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "message" => "Unauthorized",
    ]);
    exit;
}