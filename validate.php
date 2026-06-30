<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');

// 🔥 Keys stored in localStorage (GitHub Pages only supports GET)
// For full functionality, use a database. This uses a JSON file.

$key = $_GET['key'] ?? '';
$keysFile = 'keys.json';

// Agar keys.json exist nahi karta toh empty array
if (!file_exists($keysFile)) {
    echo json_encode(['valid' => false, 'reason' => 'No keys found']);
    exit;
}

$keys = json_decode(file_get_contents($keysFile), true);
if (!is_array($keys)) {
    $keys = [];
}

// Key search
$found = null;
foreach ($keys as &$k) {
    if ($k['key'] === $key) {
        $found = &$k;
        break;
    }
}

if (!$found) {
    echo json_encode(['valid' => false, 'reason' => 'Key not found']);
    exit;
}

// Status check
if ($found['status'] === 'used') {
    echo json_encode(['valid' => false, 'reason' => 'Key already used']);
    exit;
}

// Expiry check
$now = time();
$expires = strtotime($found['expires']);

if ($now > $expires) {
    $found['status'] = 'expired';
    file_put_contents($keysFile, json_encode($keys));
    echo json_encode(['valid' => false, 'reason' => 'Key expired']);
    exit;
}

// ✅ Key valid hai!
echo json_encode([
    'valid' => true,
    'key' => $found['key'],
    'duration' => $found['duration'],
    'expires' => $found['expires'],
    'days_left' => ceil(($expires - $now) / 86400)
]);
?>
