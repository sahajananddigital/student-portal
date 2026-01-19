<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once __DIR__ . "../config/db.php";
require_once __DIR__ . "../Middleware/adminauth.php";

$stml = $conn->query("SELECT * FROM users as u LEFT JOIN students as s ON u.id = s.user_id");
$students = $stml->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "status" => "success",
    "admin" => $GLOBALS['auth_user']->email,
    "data" => $students
]);