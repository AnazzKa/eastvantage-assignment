<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;

class UsersController extends Controller
{
    public function store(Request $request)
    {
        try {
            $request->validate([
                'fullName' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'roles' => 'required|array',
                'roles.*' => 'string|max:255',
            ]);

            $user = User::create([
                'fullname' => $request->fullName,
                'email' => $request->email,
                'roles' => json_encode($request->roles),
            ]);
            $respoce = [
                'code' => 200,
                'message' => "Users Create Succesfully",
                'data' => $user
            ];
            return response()->json($respoce, 200);
        } catch (Exception $exception) {
            $respoce = [
                'code' => 400,
                'message' => $exception->getMessage(),
                'data' => ''
            ];
            return response()->json(
                $respoce,
                400
            );
        }
    }
    public function index($id)
    {
        $users = User::where('id', $id)->first();
        $respoce = [
            'code' => 200,
            'message' => "Users Create Succesfully",
            'data' => $users
        ];
        return response()->json($respoce);
    }
    public function allUsers()
    {
        $users = User::all();
        $respoce = [
            'code' => 200,
            'message' => "Users Create Succesfully",
            'data' => $users
        ];
        return response()->json($respoce);
    }
}
