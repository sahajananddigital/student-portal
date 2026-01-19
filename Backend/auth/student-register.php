<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\JWT;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Invalid request"]);
    exit;
}

$passwordHash = password_hash($_POST['password'], PASSWORD_DEFAULT);
$stmt = $conn->prepare("INSERT INTO users (email, password) VALUES (:email, :password)");
$stmt->execute([
    ':email' => $_POST['email'],
    ':password' => $passwordHash
]);

$user_id = $conn->lastInsertId();


$addressproof = file_get_contents($_FILES['addressproof']['tmp_name']);
$resume = file_get_contents($_FILES['resumefile']['tmp_name']);


$student_sql = "INSERT INTO students (
    user_id, name, middlename, surname, phone,
    education, collegename, enrolmentnumber, birthdate,
    addressproof, resumefile, interestedtechnology,
    fees, startdate, enddate,
    linkedin, github, othersocial,
    parentphone, parentemail, parentaddressproof,
    agree, razorpay_payment_id
) VALUES (
    :user_id, :name, :middlename, :surname, :phone,
    :education, :collegename, :enrolmentnumber, :birthdate,
    :addressproof, :resumefile, :interestedtechnology,
    :fees, :startdate, :enddate,
    :linkedin, :github, :othersocial,
    :parentphone, :parentemail, :parentaddressproof,
    :agree, :razorpay_payment_id
)";

$stmt = $conn->prepare($student_sql);
$stmt->execute([
    ':user_id' => $user_id,
    ':name' => $_POST['name'],
    ':middlename' => $_POST['middlename'],
    ':surname' => $_POST['surname'],
    ':phone' => $_POST['phone'],
    ':education' => $_POST['education'],
    ':collegename' => $_POST['collegename'],
    ':enrolmentnumber' => $_POST['enrolmentnumber'],
    ':birthdate' => $_POST['birthdate'],
    ':addressproof' => $addressproof,
    ':resumefile' => $resume,
    ':interestedtechnology' => $_POST['interestedtechnology'],
    ':fees' => $_POST['fees'],
    ':startdate' => $_POST['startdate'],
    ':enddate' => $_POST['enddate'],
    ':linkedin' => $_POST['linkedin'],
    ':github' => $_POST['github'],
    ':othersocial' => $_POST['othersocial'],
    ':parentphone' => $_POST['parentphone'],
    ':parentemail' => $_POST['parentemail'],
    ':parentaddressproof' => $_POST['parentaddressproof'],
    ':agree' => $_POST['agree'],
    ':razorpay_payment_id' => $_POST['razorpay_payment_id']
]);

$payload = [
    'iss' => 'student-portal',
    'sub' => $user_id,
    'email' => $_POST['email'],
    'role' => 'student',
    'iat' => time(),
    'exp' => time() + (60 * 60 * 24) // 1 day
];

$secretKey = $_ENV['JWT_SECRET_KEY'];

$token = JWT::encode($payload, $secretKey, 'HS256');
echo json_encode([
    "status" => "success",
    "message" => "Student registered successfully",
    "token" => $token,
    "user" => [
        "id" => $user_id,
        "email" => $_POST['email'],
        "role" => "student"
    ]
]);
