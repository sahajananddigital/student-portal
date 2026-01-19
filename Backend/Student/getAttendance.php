<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../config/db.php';

$studentId = isset($_GET['studentId']) ? (int) $_GET['studentId'] : 0;
$page = isset($_GET['page']) ? max(1, (int) $_GET['page']) : 1;
$limit = isset($_GET['limit']) ? max(1, (int) $_GET['limit']) : 4;
$offset = ($page - 1) * $limit;

if (empty($studentId)) {
    echo json_encode(["error" => "Student ID is required"]);
    exit;
}

$stmt = $conn->prepare("SELECT id FROM students WHERE id = ?");
$stmt->execute([$studentId]);
$student = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$student) {
    echo json_encode(["error" => "Student not found"]);
    exit;
}

$countStmt = $conn->prepare("SELECT COUNT(*) as total FROM attendance WHERE student_id = ?");
$countStmt->execute([$studentId]);
$totalCount = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

$stmt = $conn->prepare("
    SELECT 
        id,
        attendance_date as date,
        start_time as checkIn,
        end_time as checkOut,
        duration_minutes as durationMinutes
    FROM attendance 
    WHERE student_id = :studentId
    ORDER BY attendance_date DESC
    LIMIT $limit OFFSET $offset
");

$stmt->execute([
    ':studentId' => $studentId
]);

$records = $stmt->fetchAll(PDO::FETCH_ASSOC);

$formattedRecords = array_map(function ($record) {
    $durationMinutes = (int) $record['durationMinutes'];
    $hours = floor($durationMinutes / 60);
    $minutes = $durationMinutes % 60;

    $checkInFormatted = date("g:i A", strtotime($record['checkIn']));
    $checkOutFormatted = date("g:i A", strtotime($record['checkOut']));
    $dateFormatted = date("M d, Y", strtotime($record['date']));
    return [
        "id" => (int) $record['id'],
        "date" => $dateFormatted,
        "checkIn" => $checkInFormatted,
        "checkOut" => $checkOutFormatted,
        "duration" => "{$hours}h {$minutes}m",
        "rawDurationSeconds" => $durationMinutes * 60
    ];
}, $records);

$totalPages = ceil($totalCount / $limit);

echo json_encode([
    "status" => "success",
    "data" => $formattedRecords,
    "pagination" => [
        "currentPage" => $page,
        "totalPages" => $totalPages,
        "totalRecords" => (int) $totalCount,
        "limit" => $limit
    ]
]);
