<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require "db.php";

$id = $_GET["id"] ?? "";

$stmt = $pdo->prepare("SELECT * FROM certificates WHERE certificate_id = ?");
$stmt->execute([$id]);

$data = $stmt->fetch();

if (!$data) {
    echo json_encode(["verified" => false]);
    exit;
}

echo json_encode([
    "verified" => true,
    "data" => $data
]);
