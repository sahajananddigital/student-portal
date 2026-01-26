<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../vendor/autoload.php';

use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Email and password required"]);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM users WHERE email = :email");
$stmt->execute([':email' => $email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($password, $user['password'])) {

    $payload = [
        'iss' => 'student-portal',
        'email' => $user['email'],
        'sub' => $user['id'],
        'role' => $user['role'],
        'iat' => time(),
        'exp' => time() + (60 * 60 * 24)
    ];

    $secretKey = $_ENV['JWT_SECRET_KEY'];

    $jwt = JWT::encode($payload, $secretKey, 'HS256');

    setcookie(
        "auth_token",
        $jwt,
        [
            "expires" => time() + (60 * 60 * 24),
            "path" => "/",
            "secure" => false,
            "httponly" => true,
            "samesite" => "Lax"
        ]
    );

    echo json_encode([
        "status" => "success",
        "token" => $jwt,
            "id" => $user["id"],
        "role" => $user['role']
    ]);
    exit;

} else {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
}
