<?php

namespace App\Http\Controllers;

use App\Models\Area;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AreaController extends Controller
{
  /**
   * Display a listing of the areas.
   *
   * @return
   */
  public function index()
  {
    $areas = Area::all();

    return Inertia::render('Area/Index', [
      'areas' => $areas,
    ]);


  }

  /**
   * Display the specified area.
   *
   * @param  \App\Models\Area $area
   * @return \Illuminate\Http\Response
   */
  public function show(Area $area)
  {
    return response()->json([
      'area' => $area
    ]);
  }

  #SECTION - Area CUD
  /**
   * Store a newly created area in storage.
   *
   * @param  \Illuminate\Http\Request $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request)
  {
    $validatedData = $request->validate([
      'name' => 'required|string|max:255',
      'campus_location' => 'required|string|max:255',
      'gps_location' => 'nullable|array', // gpsLocation should be an array
      'gps_location.*' => 'array', // Each item in gpsLocation should be an array
      'gps_location.*.0' => 'numeric', // lat is the first element of the array, and it should be numeric
      'gps_location.*.1' => 'numeric', // lng is the second element of the array, and it should be numeric
      'near_by' => 'nullable|array',  // Ensure near_by is an array if provided
      'near_by.*' => 'numeric',  // Ensure each element in the near_by array is a numeric
    ]);

    $area = Area::create([
      'name' => $validatedData['name'],
      'campus_location' => $validatedData['campus_location'],
      'gps_location' => json_encode($validatedData['gps_location'] ?? []),  // Store gps_location as JSON (default to empty array if not provided)
      'near_by' => json_encode($validatedData['near_by'] ?? []),  // Store near_by as JSON (default to empty array if not provided)
    ]);

    // Return the newly created area with a success message
    return response()->json([
      'message' => 'Area created successfully',
      'area' => $area
    ], 201);
  }

  /**
   * Update the specified area in storage.
   *
   * @param  \Illuminate\Http\Request $request
   * @param  \App\Models\Area  $area
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, Area $area)
  {
    $validatedData = $request->validate([
      'name' => 'required|string|max:255',
      'campus_location' => 'required|string|max:255',
      'gps_location' => 'nullable|array', // gps_location should be an array
      'gps_location.*' => 'array', // Each item in gps_location should be an array
      'gps_location.*.0' => 'numeric', // lat is the first element of the array, and it should be numeric
      'gps_location.*.1' => 'numeric', // lng is the second element of the array, and it should be numeric
      'near_by' => 'nullable|array',  // Ensure near_by is an array if provided
      'near_by.*' => 'numeric',  // Ensure each element in the near_by array is a numeric
    ]);

    $area->update([
      'name' => $validatedData['name'],
      'campus_location' => $validatedData['campus_location'],
      'gps_location' => $validatedData['gps_location'] ?? [],  // Update gps_location as JSO (default to empty array if not provided)N
      'near_by' => $validatedData['near_by'] ?? [],  // Update near_by as JSON (default to empty array if not provided)
    ]);

    return response()->json([
      'message' => 'Area updated successfully',
      'area' => $area
    ]);
  }

  /**
   * Remove the specified area from storage.
   *
   * @param  \App\Models\Area $area
   * @return \Illuminate\Http\Response
   */
  public function destroy(Area $area)
  {
    $area->delete();

    return response()->json([
      'message' => 'Area deleted successfully'
    ]);
  }
  #!SECTION
}
