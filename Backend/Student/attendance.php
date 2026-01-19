<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../config/db.php';

// read JSON input
$data = json_decode(file_get_contents("php://input"), true);

// validate input
if (
    empty($data['studentId']) ||
    empty($data['startTime']) ||
    empty($data['endTime'])
) {
    echo json_encode(["error" => "Invalid input"]);
    exit;
}

$studentId = (int) $data['studentId'];
$startTime = $data['startTime'];
$endTime = $data['endTime'];
$date = $data['date'] ?? date('Y-m-d');

// check student exists
$stmt = $conn->prepare("SELECT id FROM students WHERE id = ?");
$stmt->execute([$studentId]);
$student = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$student) {
    echo json_encode(["error" => "Student not found"]);
    exit;
}

// convert time to DB format
$startTimeDb = date("H:i:s", strtotime($startTime));
$endTimeDb = date("H:i:s", strtotime($endTime));

// calculate duration in minutes
$duration = round(
    (strtotime($endTimeDb) - strtotime($startTimeDb)) / 60
);

// prevent duplicate attendance for same date
$stmt = $conn->prepare("
    SELECT id FROM attendance 
    WHERE student_id = ? AND attendance_date = ?
");
$stmt->execute([$studentId, $date]);

if ($stmt->fetch()) {
    echo json_encode(["error" => "Attendance already marked for this date"]);
    exit;
}

// insert attendance
$stmt = $conn->prepare("
    INSERT INTO attendance
    (student_id, attendance_date, start_time, end_time, duration_minutes)
    VALUES (?, ?, ?, ?, ?)
");

$stmt->execute([
    $studentId,
    $date,
    $startTimeDb,
    $endTimeDb,
    $duration
]);

echo json_encode([
    "status" => "success",
    "studentId" => $studentId,
    "date" => $date,
    "startTime" => $startTimeDb,
    "endTime" => $endTimeDb,
    "durationMinutes" => $duration
]);
