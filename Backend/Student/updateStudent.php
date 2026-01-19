<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Only PUT allowed"]);
    exit;
}

$headers = getallheaders();

if (empty($headers['Authorization'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Authorization missing"]);
    exit;
}

if (!preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Invalid Bearer token"]);
    exit;
}

$token = $matches[1];
$secretKey = $_ENV['JWT_SECRET_KEY'];

try {
    $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));
    $user_id = $decoded->sub ?? null;

    if (!$user_id) {
        throw new Exception("Invalid token payload");
    }

    $input = json_decode(file_get_contents("php://input"), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON format");
    }

    $dataToUpdate = isset($input['student']) ? $input['student'] : $input;

    $check = $conn->prepare("SELECT id FROM students WHERE user_id = :user_id");
    $check->execute([":user_id" => $user_id]);
    if ($check->rowCount() === 0) {
        $insert = $conn->prepare("INSERT INTO students (user_id, created_at) VALUES (:user_id, NOW())");
        $insert->execute([":user_id" => $user_id]);
    }

    $allowedFields = [
        "name",
        "middlename",
        "surname",
        "phone",
        "education",
        "collegename",
        "enrolmentnumber",
        "birthdate",
        "interestedtechnology",
        "linkedin",
        "github",
        "parentphone",
        "parentemail",
        "fees",
        "startdate",
        "enddate",
        "parentaddressproof"
    ];

    $set = [];
    $params = [":user_id" => $user_id];

    foreach ($allowedFields as $field) {
        // We check $dataToUpdate instead of raw $input
        if (array_key_exists($field, $dataToUpdate)) {
            $set[] = "$field = :$field";
            $params[":$field"] = $dataToUpdate[$field];
        }
    }

    if (empty($set)) {
        echo json_encode(["status" => "success", "message" => "No changes detected"]);
        exit;
    }

    $sql = "UPDATE students SET " . implode(", ", $set) . " WHERE user_id = :user_id";
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    echo json_encode([
        "status" => "success",
        "message" => "Profile updated successfully"
    ]);

} catch (Throwable $e) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}