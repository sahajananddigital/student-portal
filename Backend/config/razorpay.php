<?php
require_once __DIR__ . '/../vendor/autoload.php';
use Dotenv\Dotenv;
use Razorpay\Api\Api;

$dotenv = Dotenv::createImmutable(__DIR__ . "/../");
$dotenv->load();

$keyId = $_ENV['RAZ_KEY'] ?? "";
$keySecret = $_ENV['KEY_SECRET'] ?? "";

$api = new Api($keyId, $keySecret);
try {
    $payment = $api->payment->fetch($razorpay_payment_id);

    if ($payment->status !== 'captured') {
        echo json_encode(['success' => false, "message" => "payment not completed"]);
        exit;
    }

} catch (\Exception $e) {
    echo json_encode(["success" => false, "message" => "payment verification failed"]);
    exit;
}