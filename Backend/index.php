<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . "./Db/Dbconfig.php";
require_once __DIR__ . "/vendor/autoload.php";

use Dotenv\Dotenv;
use Razorpay\Api\Api;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$keyId = $_ENV['RAZ_KEY'] ?? "";
$keySecret = $_ENV['KEY_SECRET'] ?? "";

$api = new Api($keyId, $keySecret);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS')
    exit(200);

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

// payment
$fees = floatval($_POST['fees'] ?? 0);
$razorpay_payment_id = trim($_POST['razorpay_payment_id'] ?? '');

if (!$razorpay_payment_id) {
    echo json_encode(["success" => false, "message" => "Payment not completed"]);
    exit;
}

if ($fees <= 0) {
    echo json_encode(["success" => false, "message" => "Invalid fees"]);
    exit;
}

try {
    $payment = $api->payment->fetch($razorpay_payment_id);

    // Debug: Log payment details
    error_log("Payment ID: " . $razorpay_payment_id);
    error_log("Payment Status: " . $payment->status);
    error_log("Payment Amount: " . $payment->amount);

    if ($payment->status !== 'captured') {
        echo json_encode([
            'success' => false,
            "message" => "Payment not captured",
            "status" => $payment->status,  // This will tell you the actual status
            "payment_id" => $razorpay_payment_id
        ]);
        exit;
    }
} catch (\Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Payment verification failed",
        "error" => $e->getMessage()
    ]);
    exit;
}

$uploadDir = 'uploads/';

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$address_proof = '';
if (isset($_FILES['addressproof'])) {
    $file = $_FILES['addressproof'];
    $address_proof = $uploadDir . uniqid() . '-' . str_replace(' ', '', $file['name']);
    move_uploaded_file($file['tmp_name'], $address_proof);
}

$resume_path = '';
if (isset($_FILES['resumefile'])) {
    $file = $_FILES['resumefile'];
    $resume_path = $uploadDir . uniqid() . '-' . str_replace(' ', '', $file['name']);
    move_uploaded_file($file['tmp_name'], $resume_path);
}



try {
    $insertStudent = "INSERT INTO STUDENTS 
    (name,middlename,surname,address_proof,resume_path,email,phone,education,collegename,enrolmentnumber,birthdate,interestedtechnology,startdate,enddate,parentphone,parentaddressproof,agree,fees, razorpay_payment_id)
    VALUES 
    ('$name','$middlename','$surname','$address_proof','$resume_path','$email','$phone','$education','$collegename','$enrolmentnumber','$birthdate','$interestedtechnology','$startdate','$enddate','$parentphone','$parentaddressproof','$agree','$fees', '$razorpay_payment_id')";

    $student = $conn->prepare($insertStudent);
    $student->execute();
    echo json_encode([
        "success" => true,
        "message" => "Student added successfully"
    ]);
} catch (Throwable $th) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Student added failed",
        "error" => $th->getMessage()
    ]);
}

