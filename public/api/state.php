<?php
require_once __DIR__ . '/lib.php';

$user = require_active();
$pdo = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->prepare('SELECT data, updated_at FROM coach_state WHERE coach_id = ?');
    $stmt->execute([$user['id']]);
    $row = $stmt->fetch();
    json_out([
        'data' => $row ? $row['data'] : null,
        'updatedAt' => $row ? $row['updated_at'] : null,
    ]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = read_json();
    $data = $body['data'] ?? null;
    if (!is_string($data) || $data === '') json_error('missing_data');
    if (strlen($data) > 8 * 1024 * 1024) json_error('state_too_large', 413);

    // Проверяем, что это валидный JSON, прежде чем сохранять
    json_decode($data);
    if (json_last_error() !== JSON_ERROR_NONE) json_error('invalid_json');

    $exists = $pdo->prepare('SELECT coach_id FROM coach_state WHERE coach_id = ?');
    $exists->execute([$user['id']]);
    if ($exists->fetch()) {
        $pdo->prepare('UPDATE coach_state SET data = ?, updated_at = CURRENT_TIMESTAMP WHERE coach_id = ?')
            ->execute([$data, $user['id']]);
    } else {
        $pdo->prepare('INSERT INTO coach_state (coach_id, data) VALUES (?, ?)')
            ->execute([$user['id'], $data]);
    }
    json_out(['ok' => true]);
}

json_error('method_not_allowed', 405);
