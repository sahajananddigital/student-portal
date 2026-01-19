<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/db.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

try {
    $secretKey = $_ENV['JWT_SECRET_KEY'] ?? null;
    if (!$secretKey) {
        throw new Exception("JWT_SECRET_KEY not set");
    }

    $headers = getallheaders();
    if (empty($headers['Authorization'])) {
        throw new Exception("Authorization header missing");
    }

    if (!preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
        throw new Exception("Invalid Bearer token");
    }

    $token = $matches[1];
    $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));

    $userId = $decoded->sub ?? null;
    if (!$userId) {
        throw new Exception("Invalid token payload");
    }

    $stmt = $conn->prepare("
    SELECT 
        u.id AS user_id,
        u.email,
        u.role,
        s.id AS student_table_id,
        s.name,
        s.middlename,
        s.surname,
        s.phone,
        s.birthdate,
        s.education,
        s.collegename,
        s.enrolmentnumber,
        s.interestedtechnology,
        s.startdate,
        s.enddate,
        s.linkedin,
        s.github,
        s.parentphone,
        s.parentemail,
        s.parentaddressproof,
        s.fees
    FROM users u
    LEFT JOIN students s ON u.id = s.user_id
    WHERE u.id = :id
    LIMIT 1
");
    $stmt->execute([':id' => $userId]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "user" => [
            "id" => $data['user_id'],
            "email" => $data['email'],
            "role" => $data['role']
        ],
        "student" => $data['student_table_id'] ? [
            "name" => $data['name'],
            "middlename" => $data['middlename'],
            "surname" => $data['surname'],
            "student_id" => $data['enrolmentnumber'],
            "phone" => $data['phone'],
            "dob" => $data['birthdate'],
            "major" => $data['interestedtechnology'],
            "education" => $data['education'],
            "college" => $data['collegename'],
            "enrolmentnumber" => $data['enrolmentnumber'],
            "start_date" => $data['startdate'],
            "end_date" => $data['enddate'],
            "linkedin" => $data['linkedin'],
            "github" => $data['github'],
            "parent_phone" => $data['parentphone'],
            "parent_email" => $data['parentemail'],
            "parentaddressproof" => $data['parentaddressproof'],
            "fees" => $data['fees']
        ] : null
    ]);


} catch (Exception $e) {
    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
