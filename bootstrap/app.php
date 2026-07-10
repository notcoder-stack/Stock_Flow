<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\HandleInertiaRequests;

// Override paths for read-only environments (like Vercel)
if (isset($_SERVER['VERCEL']) || isset($_ENV['VERCEL']) || (defined('PHP_OS_FAMILY') && PHP_OS_FAMILY !== 'Windows' && str_contains(__DIR__, 'var/task'))) {
    $vercelStorage = '/tmp/storage';
    foreach ([$vercelStorage . '/bootstrap/cache', $vercelStorage . '/framework/sessions', $vercelStorage . '/framework/views', $vercelStorage . '/framework/cache'] as $dir) {
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }
    }

    // Force Laravel to ignore the read-only build-time cache
    $_ENV['APP_CONFIG_CACHE'] = $vercelStorage . '/bootstrap/cache/config.php';
    $_ENV['APP_ROUTES_CACHE'] = $vercelStorage . '/bootstrap/cache/routes.php';
    $_ENV['APP_SERVICES_CACHE'] = $vercelStorage . '/bootstrap/cache/services.php';
    $_ENV['APP_PACKAGES_CACHE'] = $vercelStorage . '/bootstrap/cache/packages.php';
    
    putenv('APP_CONFIG_CACHE=' . $vercelStorage . '/bootstrap/cache/config.php');
    putenv('APP_ROUTES_CACHE=' . $vercelStorage . '/bootstrap/cache/routes.php');
    putenv('APP_SERVICES_CACHE=' . $vercelStorage . '/bootstrap/cache/services.php');
    putenv('APP_PACKAGES_CACHE=' . $vercelStorage . '/bootstrap/cache/packages.php');

    $_ENV['LOG_CHANNEL'] = 'errorlog';
    $_ENV['LOG_EMERGENCY_PATH'] = '/tmp/laravel-emergency.log';
    $_ENV['VIEW_COMPILED_PATH'] = $vercelStorage . '/framework/views';
    $_ENV['SESSION_DRIVER'] = 'cookie';
    $_ENV['CACHE_STORE'] = 'array';
    
    // Dynamically set system env vars as well
    putenv('LOG_CHANNEL=errorlog');
    putenv('LOG_EMERGENCY_PATH=/tmp/laravel-emergency.log');
    putenv('VIEW_COMPILED_PATH=' . $vercelStorage . '/framework/views');
    putenv('SESSION_DRIVER=cookie');
    putenv('CACHE_STORE=array');
}

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
