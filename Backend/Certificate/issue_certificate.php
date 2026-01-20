<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require __DIR__ . "/../config/db.php"; // This provides $conn

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "No data received"]);
    exit;
}

$certificateId = "CERT-" . time();

try {
    // ✅ CHANGED: Used $conn instead of $pdo
    $stmt = $conn->prepare("
            INSERT INTO certificates 
            (certificate_id, full_name, position, start_date, end_date, issue_date)
            VALUES (?, ?, ?, ?, ?, ?)
        ");

    $stmt->execute([
        $certificateId,
        $data["fullName"],
        $data["position"],
        $data["startDate"],
        $data["endDate"],
        $data["currentDate"]
    ]);

    echo json_encode([
        "success" => true,
        "certificateId" => $certificateId
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database query failed",
        "error" => $e->getMessage()
    ]);
}
?>