<?php
require_once __DIR__ . '/lib.php';

// Загружать видео может только владелец (админ)
$admin = require_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('method_not_allowed', 405);
}

if (empty($_FILES['video']) || !is_uploaded_file($_FILES['video']['tmp_name'])) {
    // Частая причина: файл больше лимитов PHP (upload_max_filesize / post_max_size)
    json_error('no_file_or_too_large', 400);
}

$file = $_FILES['video'];
if ($file['error'] !== UPLOAD_ERR_OK) {
    json_error('upload_error_' . $file['error'], 400);
}

$maxBytes = 300 * 1024 * 1024; // 300 МБ
if ($file['size'] > $maxBytes) {
    json_error('file_too_large', 413);
}

$allowed = [
    'mp4' => 'video/mp4',
    'm4v' => 'video/x-m4v',
    'mov' => 'video/quicktime',
    'webm' => 'video/webm',
];

$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if (!isset($allowed[$ext])) {
    json_error('unsupported_format', 415);
}

$uploadDir = dirname(__DIR__) . '/uploads/videos';
if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true)) {
    json_error('cannot_create_upload_dir', 500);
}

// Запрещаем исполнение скриптов в папке загрузок
$htaccess = dirname(__DIR__) . '/uploads/.htaccess';
if (!file_exists($htaccess)) {
    file_put_contents(
        $htaccess,
        "<FilesMatch \"\\.(php|phtml|php\\d|cgi|pl|py)$\">\nRequire all denied\n</FilesMatch>\n"
    );
}

$name = bin2hex(random_bytes(16)) . '.' . $ext;
$dest = $uploadDir . '/' . $name;

if (!move_uploaded_file($file['tmp_name'], $dest)) {
    json_error('move_failed', 500);
}

json_out(['url' => '/uploads/videos/' . $name]);
