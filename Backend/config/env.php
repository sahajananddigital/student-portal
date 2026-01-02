<?php
$envfile = __DIR__ . '/../.env';

if (!file_exists($envfile)) {
    die('.env file not found');
}
$lines = file($envfile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

foreach ($lines as $line) {
    if (str_starts_with(trim($line), '#'))
        continue;
    list($key, $value) = explode('=', $line, 2);
    $_ENV[trim($key)] = trim($value);
}