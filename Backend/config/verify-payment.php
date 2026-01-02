<?php
header("Content-Type: application/json");

require_once "./razorpay.php";

$data = json_decode(file_get_contents("php://input"), true);

try {
    $api->utility->verifyPaymentSignature([
        'razorpay_order_id' => $data['razorpay_order_id'],
        'razorpay_payment_id' => $data['razorpay_payment_id'],
        'razorpay_signature' => $data['razorpay_signature']
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Payment Successful"
    ]);

} catch (Throwable $th) {
    echo json_encode([
        "success" => false,
        "message" => "Payment Verification Failed"
    ]);
}
