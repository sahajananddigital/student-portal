<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(200);
}

$name = trim($_POST['name'] ?? '');
$middlename = trim($_POST['middlename'] ?? '');
$surname = trim($_POST['surname'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$education = trim($_POST['education'] ?? '');
$collegename = trim($_POST['collegename'] ?? '');
$enrolmentnumber = trim($_POST['enrolmentnumber'] ?? '');
$birthdate = trim($_POST['birthdate'] ?? '');
$interestedtechnology = trim($_POST['interestedtechnology'] ?? '');
$startdate = trim($_POST['startdate'] ?? '');
$enddate = trim($_POST['enddate'] ?? '');
$parentphone = trim($_POST['parentphone'] ?? '');
$parentaddressproof = trim($_POST['parentaddressproof'] ?? '');
$agree = trim($_POST['agree'] ?? '');


$uploadDir = 'uploads/';

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true); 
}

$addressProofPath = '';
if (isset($_FILES['addressproof'])) {
    $file = $_FILES['addressproof'];
    $addressProofPath = $uploadDir . uniqid() . '-' . str_replace(' ', '', $file['name']);
    move_uploaded_file($file['tmp_name'], $addressProofPath);
}

$resumePath = '';
if (isset($_FILES['resumefile'])) {
    $file = $_FILES['resumefile'];
    $resumePath = $uploadDir . uniqid() . '-' . str_replace(' ', '', $file['name']);
    move_uploaded_file($file['tmp_name'], $resumePath);
}



echo json_encode([
    "success" => true,
    "data" => [
        "name" => $name,
        "middlename" => $middlename,
        "surname" => $surname,
        "addressproof" => $addressProofPath,
        "email" => $email,
        "phone" => $phone,
        "education" => $education,
        "collegename" => $collegename,
        "enrolmentnumber" => $enrolmentnumber,
        "birthdate" => $birthdate,
        "resumefile" => $resumePath,
        "interestedtechnology" => $interestedtechnology,
        "startdate" => $startdate,
        "enddate" => $enddate,
        "parentphone" => $parentphone,
        "parentaddressproof" => $parentaddressproof,
        "agree" => $agree
    ]
]);
