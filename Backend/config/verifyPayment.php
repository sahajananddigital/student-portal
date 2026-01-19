<?php
require_once __DIR__ . "/../config/razorpay.php";

function verifyPayment($paymentId, $fees)
{
    global $razorpay;

    $payment = $razorpay->payment->fetch($paymentId);

    if ($payment->status === 'authorized') {
        $payment = $payment->capture([
            'amount' => $fees * 100,
            'currency' => 'INR'
        ]);
    }

    if ($payment->status !== 'captured') {
        throw new Exception("Payment not captured");
    }

    return true;
}
