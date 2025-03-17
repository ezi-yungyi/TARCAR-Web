<?php

namespace App\Http\Controllers;

use App\Models\ParkingUser;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ParkingUserController extends Controller
{
  /**
   * Display a listing of the users.
   *
   * @return
   */
  public function index()
  {
    $users = ParkingUser::all();

    return Inertia::render('User/Index', [
      'users' => $users
    ]);
  }

  /**
   * Display the specified parkingUser.
   *
   * @param  \App\Models\ParkingUser $parkingUser
   * @return \Illuminate\Http\Response
   */
  public function show(ParkingUser $parkingUser)
  {
    return response()->json([
      'parkingUser' => $parkingUser
    ]);
  }

  /**
   * Store a newly created parking user in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request)
  {
    $validatedData = $request->validate([
      'uni_id' => 'required|string|max:255|unique:parking_users',
      'name' => 'required|string|max:255',
      'email' => 'required|email|max:255',
      'phone' => 'required|string|max:20',
    ]);

    $parkingUser = ParkingUser::create($validatedData);

    return response()->json([
      'message' => 'Parking user created successfully',
      'parking_user' => $parkingUser
    ], 201);
  }

  /**
   * Update the specified parking user in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \App\Models\ParkingUser  $parkingUser
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, $parking_user_id)
  {
    $user = ParkingUser::findOrFail($parking_user_id);

    $validatedData = $request->validate([
      'uni_id' => 'required|string|max:255|unique:parking_users,uni_id,' . $user->id,
      'name' => 'required|string|max:255',
      'email' => 'required|email|max:255',
      'phone' => 'required|string|max:20',
    ]);

    $user->update($validatedData);

    return response()->json([
      'message' => 'Parking user updated successfully',
      'parking_user' => $user
    ]);
  }

  /**
   * Remove the specified parking user from storage.
   *
   * @param  \App\Models\ParkingUser  $parkingUser
   * @return \Illuminate\Http\Response
   */
  public function destroy($parking_user_id)
  {
    $user = ParkingUser::findOrFail($parking_user_id);
    $user->delete();

    return response()->json([
      'message' => 'Parking user deleted successfully'
    ]);
  }
}
