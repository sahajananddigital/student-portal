<?php
header("Content-Type: application/json");

require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../vendor/autoload.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

function sendJsonResponse($statusCode, $data)
{
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

$headers = function_exists('getallheaders') ? getallheaders() : [];
$authHeader = $headers['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
$token = str_replace("Bearer ", "", $authHeader);

if (!$token) {
    sendJsonResponse(401, ["status" => "error", "message" => "Missing token"]);
}

try {
    $decodedToken = JWT::decode(trim($token), new Key($_ENV["JWT_SECRET_KEY"], 'HS256'));
} catch (Throwable $e) {
    sendJsonResponse(401, ["status" => "error", "message" => "Invalid token"]);
}

if (!isset($decodedToken->role) || $decodedToken->role !== "user") {
    sendJsonResponse(403, ["status" => "error", "message" => "Access Denied"]);
}
$userId = $decodedToken->sub ?? null;
if (!$userId) {
    sendJsonResponse(400, ["status" => "error", "message" => "Invalid token payload"]);
}

try {
    $stmt = $conn->prepare("SELECT * FROM tasks WHERE assignedTo = :user_id");
    $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
    $stmt->execute();
    $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    sendJsonResponse(200, [
        "success" => true,
        "tasks" => $tasks
    ]);
} catch (PDOException $e) {
    sendJsonResponse(500, ["status" => "error", "message" => "Database error"]);
}
