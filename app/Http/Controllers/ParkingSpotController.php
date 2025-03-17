<?php

namespace App\Http\Controllers;

use App\Http\Resources\CameraResource;
use App\Models\Camera;
use App\Models\ParkingSpot;
use Illuminate\Http\Request;
use Inertia\Inertia;

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

  public function spot(Request $request, string $camera_id)
  {
    $camera = Camera::with(['parkingSpots', 'parkingArea'])->findOrFail($camera_id);


    return Inertia::render('Parking/Spot', [
      'camera' => new CameraResource($camera),
    ]);
  }

  public function getSpot($camera_id)
  {
    $parkingSpots = ParkingSpot::where('camera_id', $camera_id)->get();

    return response()->json([
      'message' => 'Parking spots retrieved successfully',
      'parkingSpots' => $parkingSpots
    ]);
  }

  public function getAll()
  {
    $parkingSpots = ParkingSpot::all();

    return response()->json([
      'message' => 'Parking spots retrieved successfully',
      'parkingSpots' => $parkingSpots
    ]);
  }

  #SECTION - Parking Spot CUD
  /**
   * Store a newly created parking spot.
   */
  public function store(Request $request)
  {
    $validatedData = $request->validate([
      'index' => 'nullable|string|unique:parking_spots,index',
      'parking_area_id' => 'required|exists:parking_areas,id',
      'camera_id' => 'required|exists:cameras,id',
      'position' => 'required|json',
    ]);

    $parkingSpot = ParkingSpot::create([
      'index' => $validatedData['index'] ?? null,
      'parking_area_id' => $validatedData['parking_area_id'],
      'camera_id' => $validatedData['camera_id'],
      'position' => json_encode($validatedData['position']),
      'occupied' => False,
    ]);

    return response()->json([
      'message' => 'Parking spot created successfully',
      'parkingSpot' => $parkingSpot
    ], 201);
  }

    /**
   * Update the specified parking spot in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \App\Models\ParkingSpot  $parkingSpot
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, ParkingSpot $parkingSpot)
  {
    $validatedData = $request->validate([
      'index' => 'nullable|string',
      'parking_area_id' => 'required|exists:parking_areas,id',
      'camera_id' => 'required|exists:cameras,id',
      'position' => 'required|json',
      'occupied' => 'required|boolean',
      'user_leaving' => 'nullable|timestamp'
    ]);

    $parkingSpot->update([
      'index' => $validatedData['index'],
      'parking_area_id' => $validatedData['parking_area_id'],
      'camera_id' => $validatedData['camera_id'],
      'position' => json_encode($validatedData['position']),
      'occupied' => $validatedData['occupied'],
      'user_leaving' => $validatedData['user_leaving'] ?? null,
    ]);

    return response()->json([
      'message' => 'Parking Spot updated successfully',
      'parkingSpot' => $parkingSpot
    ]);
  }

  /**
   * Remove the specified parking spot from storage.
   *
   * @param  \App\Models\ParkingSpot  $parkingSpot
   * @return \Illuminate\Http\Response
   */
  public function destroy($parking_spot_id)
  {
    $parkingSpot = ParkingSpot::findOrFail($parking_spot_id);
    $parkingSpot->delete();

    return response()->json([
      'message' => 'Parking Spot deleted successfully'
    ]);
  }
}
#!SECTION
