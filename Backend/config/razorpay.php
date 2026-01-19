<?php
use Razorpay\Api\Api;

$keyId = $_ENV['RAZ_KEY'] ?? "";
$keySecret = $_ENV['KEY_SECRET'] ?? "";

$razorpay = new Api($keyId, $keySecret);
