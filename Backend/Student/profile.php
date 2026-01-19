<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/db.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../'); // fixed path
$dotenv->safeLoad();

try {
    $secretKey = $_ENV['JWT_SECRET_KEY'] ?? null;

    if (!$secretKey) {
        throw new Exception("JWT_SECRET_KEY not set in .env");
    }

    // Get headers
    $headers = getallheaders();

    if (!isset($headers['Authorization'])) {
        throw new Exception("Authorization header missing");
    }

    // Extract token from header
    if (!preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
        throw new Exception("Bearer token not found");
    }

    $token = $matches[1];

    // Decode JWT
    $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));
    $userId = $decoded->sub ?? null;

    if (!$userId) {
        throw new Exception("Invalid token: user ID not found");
    }

    // Fetch user data
    $stmt = $conn->prepare("
        SELECT u.id AS user_id, u.email, u.role, s.*
        FROM users AS u
        LEFT JOIN students AS s ON u.id = s.user_id
        WHERE u.id = :id
        LIMIT 1
    ");
    $stmt->execute([':id' => $userId]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$data) {
        throw new Exception("User not found");
    }

    echo json_encode([
        "status" => "success",
        "user" => [
            "id" => $data['user_id'],
            "email" => $data['email'],
            "role" => $data['role'],
            "password" => $data['role']
        ],
        "student" => $data['role'] === 'student' ? $data : null
    ]);

} catch (Exception $e) {
    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}