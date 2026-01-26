<?php

$allowed_origins = ['http://localhost:5173', 'https://shikshaskills.gt.tc'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

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
        require __DIR__ . "/utils/Middleware/adminauth.php";
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

    // Task
    case "create-task":
        require __DIR__ . "/Task/create_task.php";
        break;

    case "get-tasks":
        require __DIR__ . "/Task/getTasks.php";
        break;

    // Dropdown
    case "get-dropdown-students":
        require __DIR__ . "/Task/getdropdownstuden.php";
        break;


    default:
        http_response_code(404);
        echo json_encode([
            "status" => "error",
            "message" => "Invalid API request",
            "received_action" => $request
        ]);
}
