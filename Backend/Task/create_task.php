<?php
header("Content-Type: application/json");

require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../vendor/autoload.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

$headers = function_exists('getallheaders') ? getallheaders() : [];
$authHeader = $headers['Authorization']
    ?? $_SERVER['HTTP_AUTHORIZATION']
    ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
    ?? '';

$token = str_replace("Bearer ", "", $authHeader);

if (!$token) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Missing token"]);
    exit;
}

try {
    $decoded = JWT::decode(trim($token), new Key($_ENV["JWT_SECRET_KEY"], 'HS256'));

    if ($decoded->role !== "admin") {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => "Access Denied"]);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);

    $stmt = $conn->prepare("
        INSERT INTO tasks (title, description, due_date, assignedTo)
        VALUES (?, ?, ?, ?)
    ");

    $stmt->execute([
        $data["title"] ?? '',
        $data["description"] ?? '',
        $data["dueDate"] ?? null,
        $data["assignedTo"] ?? null
    ]);

    echo json_encode([
        "success" => true,
        "task_id" => $conn->lastInsertId()
    ]);

} catch (Throwable $e) {
    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "message" => "Invalid token",
        "debug" => $e->getMessage() // TEMP: remove in prod
    ]);
}
