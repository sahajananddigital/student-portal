<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, PUT, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$request = trim($_GET['action'] ?? '');

if (!isset($_GET['action'])) {
    echo json_encode([
        "status" => "ok",
        "message" => "Hello from server Backend is alive"
    ]);
    exit;
}

switch ($request) {
    // Authentication
    case "student-register":
        require __DIR__ . "/auth/student-register.php";
        break;

    case "login":
        require __DIR__ . "/auth/login.php";
        break;

    // Student
    case "admin-students":
        require __DIR__ . "/middleware/adminAuth.php";
        require __DIR__ . "/Student/getStudents.php";
        break;

    case "update-students":
        require __DIR__ . "/Student/updateStudent.php";
        break;

    case "create-admin":
        require __DIR__ . "/admin/create_admin.php";
        break;

    case "student-profile":
        require __DIR__ . "/Student/profile.php";
        break;

    // Attendance
    case "student-attendance":
        require __DIR__ . "/Student/attendance.php";
        break;

    case "get-attendance":
        require __DIR__ . "/Student/getAttendance.php";
        break;

    // Certificate
    case "issue-certificate":
        require __DIR__ . "/Certificate/issue_certificate.php";
        break;

    case "verificate-certificate":
        require __DIR__ . "/Certificate/verify_certificate.php";
        break;

    default:
        http_response_code(404);
        echo json_encode([
            "status" => "error",
            "message" => "Invalid API request",
            "received_action" => $request
        ]);
}
