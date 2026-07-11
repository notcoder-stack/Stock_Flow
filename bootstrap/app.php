<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\HandleInertiaRequests;

// Override storage paths for read-only serverless environments (Vercel/Lambda)
// These run unconditionally so they work even when VERCEL env var is not set
$_overrideStorage = '/tmp/storage';
foreach ([$_overrideStorage . '/logs', $_overrideStorage . '/bootstrap/cache', $_overrideStorage . '/framework/sessions', $_overrideStorage . '/framework/views', $_overrideStorage . '/framework/cache'] as $_dir) {
    if (!is_dir($_dir)) {
        @mkdir($_dir, 0755, true);
    }
}
unset($_overrideStorage, $_dir);

return Application::configure(basePath: dirname(__DIR__))
    ->useStoragePath('/tmp/storage')
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
