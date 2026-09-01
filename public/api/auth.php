<?php
require_once __DIR__ . '/lib.php';

$action = $_GET['action'] ?? '';

if ($action === 'me') {
    $user = current_user();
    if (!$user) json_error('unauthorized', 401);
    json_out(['user' => public_user($user)]);
}

if ($action === 'logout') {
    start_session();
    $_SESSION = [];
    session_destroy();
    json_out(['ok' => true]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('method_not_allowed', 405);
}

$body = read_json();

if ($action === 'login') {
    $email = mb_strtolower(trim($body['email'] ?? ''));
    $password = (string) ($body['password'] ?? '');
    if ($email === '' || $password === '') json_error('missing_fields');

    $stmt = db()->prepare('SELECT * FROM coaches WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        json_error('invalid_credentials', 401);
    }
    if ($user['status'] === 'blocked') {
        json_error('blocked', 403);
    }

    start_session();
    session_regenerate_id(true);
    $_SESSION['uid'] = (int) $user['id'];
    json_out(['user' => public_user($user)]);
}

if ($action === 'register') {
    $name = trim($body['name'] ?? '');
    $email = mb_strtolower(trim($body['email'] ?? ''));
    $password = (string) ($body['password'] ?? '');

    if ($name === '' || $email === '' || $password === '') json_error('missing_fields');
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) json_error('invalid_email');
    if (mb_strlen($password) < 6) json_error('password_too_short');

    $pdo = db();

    $exists = $pdo->prepare('SELECT id FROM coaches WHERE email = ?');
    $exists->execute([$email]);
    if ($exists->fetch()) json_error('email_taken', 409);

    // Первый зарегистрированный аккаунт становится владельцем (админом)
    // и сразу активен. Все последующие получают статус pending и ждут
    // подтверждения владельцем в админ-панели.
    $total = (int) $pdo->query('SELECT COUNT(*) AS c FROM coaches')->fetch()['c'];
    $isAdmin = $total === 0 ? 1 : 0;
    $status = $isAdmin ? 'active' : 'pending';

    $stmt = $pdo->prepare(
        'INSERT INTO coaches (email, name, password_hash, is_admin, status) VALUES (?, ?, ?, ?, ?)'
    );
    $stmt->execute([$email, $name, password_hash($password, PASSWORD_DEFAULT), $isAdmin, $status]);
    $uid = (int) $pdo->lastInsertId();

    start_session();
    session_regenerate_id(true);
    $_SESSION['uid'] = $uid;

    json_out([
        'user' => [
            'id' => $uid,
            'email' => $email,
            'name' => $name,
            'isAdmin' => (bool) $isAdmin,
            'status' => $status,
        ],
    ]);
}

json_error('unknown_action', 404);
