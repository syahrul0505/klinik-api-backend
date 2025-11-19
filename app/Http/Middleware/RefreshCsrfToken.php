<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RefreshCsrfToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        // Memperbarui token CSRF sebelum pemrosesan permintaan
        $response = $next($request);

        if ($response->status() === 419) {
            // Jika token CSRF expired, perbarui token dan coba lagi
            csrf_token();
            $response->headers->set('X-CSRF-Token', csrf_token());
        }

        return $response;
    }
}
