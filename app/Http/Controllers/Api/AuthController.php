<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function index()
    {
        return response()->json(['message'=>'API TEST']);
    }

    // Login
   public function login(Request $request)
{
    $request->validate([
        'email'     => 'required|email',
        'password'  => 'required'
    ]);

    $user = User::get()->first(function ($u) use ($request) {
        try {
            return decrypt($u->email) === $request->email;
        } catch (\Exception $e) {
            return false; 
        }
    });

    if (! $user || ! Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }

    try {
        $user->email = decrypt($user->email);
    } catch (\Exception $e) {}

    $token = $user->createToken('api-token')->plainTextToken;

    return response()->json([
        'access_token' => $token,
        'token_type'   => 'Bearer',
        'user'         => $user
    ]);
}

}
