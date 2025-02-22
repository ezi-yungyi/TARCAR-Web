<?php

namespace App\Http\Controllers;

use App\Models\ParkingSpot;
use Illuminate\Http\Request;

class ParkingSpotController extends Controller
{
  public function index()
  {
    $parkingSpots = ParkingSpot::all();

    return response()->json([
      'message' => 'Parking spots retrieved successfully',
      'parkingSpots' => $parkingSpots
    ]);
  }

  /**
   * Store a newly created parking spot.
   */
  public function store(Request $request)
  {
    $request->validate([
      'code' => 'nullable|string',
      'position' => 'required|array',
      'status' => 'required|string'
    ]);

    $parkingSpot = ParkingSpot::create([
      'code' => $request->code,
      'position' => json_encode($request->position),
      'status' => $request->status
    ]);

    return response()->json([
      'message' => 'Parking spot created successfully',
      'parkingSpot' => $parkingSpot
    ], 201);
  }

  /**
   * Delete a parking spot by ID.
   */
  public function destroy($id)
  {
    $parkingSpot = ParkingSpot::find($id);

    if (!$parkingSpot) {
      return response()->json(['message' => 'Parking spot not found'], 404);
    }

    $parkingSpot->delete();

    return response()->json(['message' => 'Parking spot deleted successfully']);
  }
}
