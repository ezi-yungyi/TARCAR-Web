<?php

namespace App\Http\Controllers;

use App\Http\Requests\ParkingAreaRequest;
use App\Http\Resources\CameraResource;
use App\Http\Resources\ParkingAreaResource;
use App\Http\Resources\ParkingSpotResource;
use App\Models\Camera;
use App\Models\ParkingArea;
use App\Models\ParkingSpot;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ParkingAreaController extends Controller
{
  /**
   * Display a listing of the parking areas.
   *
   * @return
   */
  public function index()
  {
    $parkingArea = ParkingArea::paginate();

    return Inertia::render('Parking/Index', [
      'areas' => $parkingArea,
    ]);
  }

  /**
   * Display the specified area.
   *
   * @param  \App\Models\ParkingArea $area
   * @return
   */
  public function show($area_id)
  {
    $area = ParkingArea::with(['parkingSpots', 'cameras'])->findOrFail($area_id);

    return Inertia::render('Parking/Area', [
      'area' => new ParkingAreaResource($area),
    ]);
  }

  #SECTION - Parking Area CUD
  /**
   * Store a newly created parking area in storage.
   *
   * @param  \Illuminate\Http\Request $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request)
  {
    $validatedData = $request->validate([
      'area_id' => 'required|exists:areas,id',
      'name' => 'required|string|max:255',
    ]);


    $parkingArea = ParkingArea::create([
      'area_id' => $validatedData['area_id'],
      'name' => $validatedData['name'],
      'front_end_graphic' => []
    ]);

    return response()->json([
      'message' => 'Area created successfully',
      'area' => $parkingArea
    ], 201);

    // return redirect()->route('parking.areas')->with('success', 'Parking Area created successfully.');
  }

  /**
   * Update the specified parking area in storage.
   *
   * @param  \Illuminate\Http\Request $request
   * @param  \App\Models\ParkingArea $parkingArea
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, $parking_area_id)
  {
    $parkingArea = ParkingArea::findOrFail($parking_area_id);

    $validatedData = $request->validate([
      'area_id' => 'required|exists:areas,id',
      'name' => 'required|string|max:255',
      'front_end_graphic' => 'nullable|array',
    ]);

    $parkingArea->update([
      'area_id' => $validatedData['area_id'],
      'name' => $validatedData['name'],
      'front_end_graphic' => $validatedData['front_end_graphic'] ?? [],
    ]);

    return response()->json([
      'message' => 'Parking Area updated successfully',
      'parkingArea' => $parkingArea
    ]);
  }

  /**
   * Remove the specified parking area from storage.
   *
   * @param  \App\Models\ParkingArea $parkingArea
   * @return \Illuminate\Http\Response
   */
  public function destroy(ParkingArea $parkingArea)
  {
    $parkingArea->delete();

    return response()->json([
      'message' => 'Parking Area deleted successfully'
    ]);
  }
  #!SECTION
}
