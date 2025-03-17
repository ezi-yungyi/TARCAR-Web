<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class APITokenMiddleware
{
  /**
   * Handle an incoming request.
   *
   * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
   */
  public function handle(Request $request, Closure $next): Response
  {
    $apiToken = $request->header('X-API-TOKEN');

    $validApiToken = env('API_TOKEN');

    if (!$apiToken || $apiToken !== $validApiToken) {
      return response()->json(['message' => 'Unauthorized'], 401);
    }

    return $next($request);
  }
}
