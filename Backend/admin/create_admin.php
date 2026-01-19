<?php
require_once __DIR__ . '/../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Email and password required"
    ]);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare(
    "INSERT INTO users (email, password, role) VALUES (?, ?, 'admin')"
);
$stmt->execute([$email, $hashedPassword]);

echo json_encode([
    "status" => "success",
    "message" => "Admin created"
]);
