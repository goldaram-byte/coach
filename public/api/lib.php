<?php
require_once __DIR__ . '/config.php';

// ---------- JSON helpers ----------

function json_out($data, int $code = 200): void {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function json_error(string $message, int $code = 400): void {
    json_out(['error' => $message], $code);
}

function read_json(): array {
    $raw = file_get_contents('php://input');
    if ($raw === '' || $raw === false) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

// ---------- Database ----------

function db(): PDO {
    static $pdo = null;
    if ($pdo instanceof PDO) return $pdo;

    $opts = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];

    if (DB_DRIVER === 'sqlite') {
        // Режим для локального тестирования (php -S)
        $pdo = new PDO('sqlite:' . __DIR__ . '/data.sqlite', null, null, $opts);
        $pdo->exec("CREATE TABLE IF NOT EXISTS coaches (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            is_admin INTEGER NOT NULL DEFAULT 0,
            status TEXT NOT NULL DEFAULT 'pending',
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )");
        $pdo->exec("CREATE TABLE IF NOT EXISTS coach_state (
            coach_id INTEGER PRIMARY KEY,
            data TEXT,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )");
        return $pdo;
    }

    if (DB_NAME === 'ЗАМЕНИТЕ_ИМЯ_БАЗЫ') {
        json_error('db_not_configured', 500);
    }

    try {
        $pdo = new PDO(
            'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
            DB_USER,
            DB_PASS,
            $opts
        );
    } catch (PDOException $e) {
        json_error('db_connection_failed', 500);
    }

    // status: pending — ждёт подтверждения владельцем, active — доступ открыт, blocked — доступ закрыт
    $pdo->exec("CREATE TABLE IF NOT EXISTS coaches (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(190) NOT NULL UNIQUE,
        name VARCHAR(190) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        is_admin TINYINT(1) NOT NULL DEFAULT 0,
        status VARCHAR(10) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $pdo->exec("CREATE TABLE IF NOT EXISTS coach_state (
        coach_id INT PRIMARY KEY,
        data MEDIUMTEXT,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    return $pdo;
}

// ---------- Session / auth ----------

function start_session(): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    session_set_cookie_params([
        'lifetime' => 60 * 60 * 24 * 30,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax',
        'secure' => !empty($_SERVER['HTTPS']),
    ]);
    session_name('wkfcoach_session');
    session_start();
}

function current_user(): ?array {
    start_session();
    if (empty($_SESSION['uid'])) return null;
    $stmt = db()->prepare('SELECT id, email, name, is_admin, status FROM coaches WHERE id = ?');
    $stmt->execute([$_SESSION['uid']]);
    $user = $stmt->fetch();
    return $user ?: null;
}

function require_auth(): array {
    $user = current_user();
    if (!$user) json_error('unauthorized', 401);
    return $user;
}

function require_active(): array {
    $user = require_auth();
    if ($user['status'] !== 'active') json_error('not_approved', 403);
    return $user;
}

function require_admin(): array {
    $user = require_active();
    if (!(int) $user['is_admin']) json_error('forbidden', 403);
    return $user;
}

function public_user(array $user): array {
    return [
        'id' => (int) $user['id'],
        'email' => $user['email'],
        'name' => $user['name'],
        'isAdmin' => (bool) (int) $user['is_admin'],
        'status' => $user['status'],
    ];
}
