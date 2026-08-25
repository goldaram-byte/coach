<?php
require_once __DIR__ . '/lib.php';

// Общий контент (базовые блоки тренировок): читают все активные
// тренеры, изменяет только владелец.

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    require_active();
    $stmt = db()->prepare('SELECT data, updated_at FROM shared_content WHERE k = ?');
    $stmt->execute(['blocks']);
    $row = $stmt->fetch();
    json_out([
        'data' => $row ? $row['data'] : null,
        'updatedAt' => $row ? $row['updated_at'] : null,
    ]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_admin();
    $body = read_json();
    $data = $body['data'] ?? null;
    if (!is_string($data) || $data === '') json_error('missing_data');
    if (strlen($data) > 8 * 1024 * 1024) json_error('state_too_large', 413);

    json_decode($data);
    if (json_last_error() !== JSON_ERROR_NONE) json_error('invalid_json');

    $pdo = db();
    $exists = $pdo->prepare('SELECT k FROM shared_content WHERE k = ?');
    $exists->execute(['blocks']);
    if ($exists->fetch()) {
        $pdo->prepare('UPDATE shared_content SET data = ?, updated_at = CURRENT_TIMESTAMP WHERE k = ?')
            ->execute([$data, 'blocks']);
    } else {
        $pdo->prepare('INSERT INTO shared_content (k, data) VALUES (?, ?)')
            ->execute(['blocks', $data]);
    }
    json_out(['ok' => true]);
}

json_error('method_not_allowed', 405);
