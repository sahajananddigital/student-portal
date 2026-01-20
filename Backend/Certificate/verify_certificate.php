<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once __DIR__ . "/../config/db.php";

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing certificate ID"]);
    exit;
}

$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

if ($id === false || $id === null) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid certificate ID"]);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM certificates WHERE certificate_id = :id");
$stmt->bindValue(':id', $id, PDO::PARAM_INT);
$stmt->execute();

$data = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$data) {
    echo json_encode(["verified" => false]);
    exit;
}

echo json_encode([
    "verified" => true,
    "data" => $data
]);
