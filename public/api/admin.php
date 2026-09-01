<?php
require_once __DIR__ . '/lib.php';

$admin = require_admin();
$pdo = db();
$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'users') {
    $rows = $pdo->query(
        'SELECT id, email, name, is_admin, status, created_at
         FROM coaches ORDER BY created_at DESC'
    )->fetchAll();

    $users = array_map(static function (array $r): array {
        return [
            'id' => (int) $r['id'],
            'email' => $r['email'],
            'name' => $r['name'],
            'isAdmin' => (bool) (int) $r['is_admin'],
            'status' => $r['status'],
            'createdAt' => $r['created_at'],
        ];
    }, $rows);

    json_out(['users' => $users]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'set_status') {
    $body = read_json();
    $id = (int) ($body['id'] ?? 0);
    $status = (string) ($body['status'] ?? '');

    if (!in_array($status, ['active', 'pending', 'blocked'], true)) json_error('invalid_status');
    if ($id === (int) $admin['id']) json_error('cannot_change_self');

    $stmt = $pdo->prepare('SELECT id FROM coaches WHERE id = ?');
    $stmt->execute([$id]);
    if (!$stmt->fetch()) json_error('not_found', 404);

    $pdo->prepare('UPDATE coaches SET status = ? WHERE id = ?')->execute([$status, $id]);
    json_out(['ok' => true]);
}

json_error('unknown_action', 404);
