<?php
// CORS headers — must be the very first output, before any whitespace
@header("Access-Control-Allow-Origin: *");
@header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
@header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
@header("Access-Control-Max-Age: 86400");
@header("Content-Type: application/json; charset=UTF-8");

// Handle OPTIONS preflight — return 200 immediately with CORS headers
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    echo '{}';
    exit();
}

// Read raw POST data
$inputData = file_get_contents("php://input");
$data = json_decode($inputData, true);

$rawAmount = isset($data['amount']) ? $data['amount'] : 50;
$cleanAmount = preg_replace('/[^\d]/', '', (string)$rawAmount);
$amountNum = max(0, (int)$cleanAmount);

if ($amountNum <= 0) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid amount. Must be greater than zero."]);
    exit();
}

$amountInPaise = $amountNum;
if (empty($data['amount_in_paise']) && $amountNum < 100000) {
    // Treat values as rupees and convert to paise, since Razorpay expects paise.
    $amountInPaise = $amountNum * 100;
}

$currency = isset($data['currency']) ? $data['currency'] : 'INR';
$receipt = isset($data['receipt']) ? $data['receipt'] : 'rcpt_' . time();

// Load .env file — check multiple possible locations
$envPaths = [
    __DIR__ . '/.env',
    dirname(__DIR__) . '/.env',
    dirname(__DIR__) . DIRECTORY_SEPARATOR . '.env'
];

foreach ($envPaths as $envPath) {
    if (file_exists($envPath)) {
        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos(trim($line), '#') === 0) continue;
            if (strpos($line, '=') === false) continue;
            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value, " \t\n\r\0\x0B\"'");
            putenv("{$name}={$value}");
            $_ENV[$name] = $value;
        }
        break;
    }
}

// Verified Live Razorpay keys
$keyId     = getenv('VITE_RAZORPAY_KEY_ID')     ?: getenv('RAZORPAY_KEY_ID')     ?: 'rzp_live_ToYUfQM1T3GlJh';
$keySecret = getenv('VITE_RAZORPAY_KEY_SECRET') ?: getenv('RAZORPAY_KEY_SECRET') ?: 'yLnUTTe0dcnF0kKwVT1AAxeg';

// Call Razorpay API to create an Order
$url = "https://api.razorpay.com/v1/orders";
$postFields = json_encode([
    "amount"          => $amountInPaise,
    "currency"        => $currency,
    "receipt"         => $receipt,
    "payment_capture" => 1,
    "notes"           => [
        "generated_by" => "realjob-portal-backend"
    ]
]);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Basic " . base64_encode($keyId . ":" . $keySecret)
]);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

$response       = curl_exec($ch);
$httpStatusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError      = curl_error($ch);
curl_close($ch);

$responseData = json_decode($response, true);

// Razorpay returned a valid order — send it back
if ($httpStatusCode === 200 && isset($responseData['id'])) {
    $responseData['is_live'] = true;
    http_response_code(200);
    echo json_encode($responseData);
    exit();
}

// API call failed — return a structured error
$errorDescription = $responseData['error']['description'] ?? ($curlError ?: 'Unknown error');
$errorCode        = $responseData['error']['code']        ?? 'API_ERROR';

http_response_code(502);
echo json_encode([
    "error"       => true,
    "code"        => $errorCode,
    "description" => $errorDescription,
    "http_status" => $httpStatusCode
]);
?>
