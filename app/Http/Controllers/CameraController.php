<?php

namespace App\Http\Controllers;

use App\Models\Camera;
use App\Models\ParkingArea;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CameraController extends Controller
{
  /**
   * Display a listing of the cameras.
   *
   * @return
   */
  public function index()
  {
    $cameras = Camera::all();
    $parkingAreas = ParkingArea::all();

    return Inertia::render('Camera/Index', [
      'cameras' => $cameras,
      'parkingAreas' => $parkingAreas
    ]);
  }

  /**
   * Display the specified camera.
   *
   * @param  \App\Models\Camera $camera
   * @return \Illuminate\Http\Response
   */
  public function show(Camera $camera)
  {
    return response()->json([
      'camera' => $camera
    ]);
  }


  #SECTION - Camera CUD
  /**
   * Store a newly created camera in storage.
   *
   * @param  \Illuminate\Http\Request $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request)
  {
    $validatedData = $request->validate([
      'index' => 'nullable|string|unique:cameras,index',
      'parking_area_id' => 'required|exists:parking_areas,id',
      'type' => 'required|string|max:255',
    ]);

    $camera = Camera::create([
      'index' => $validatedData['index'],
      'parking_area_id' => $validatedData['parking_area_id'],
      'type' => $validatedData['type'],
      'status' => 'Setup',
    ]);

    return response()->json([
      'message' => 'Camera created successfully',
      'camera' => $camera
    ], 201);
  }

  /**
   * Update the specified camera in storage.
   *
   * @param  \Illuminate\Http\Request $request
   * @param  \App\Models\Camera  $camera
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, $camera_id)
  {
    $camera = Camera::findOrFail($camera_id);


    $validatedData = $request->validate([
      'index' => 'nullable|string|unique:cameras,index',
      'parking_area_id' => 'required|exists:parking_areas,id',
      'type' => 'required|string|max:255',
      'status' => 'required|string|max:255',
      'source' => 'nullable|string|max:255',
    ]);

    $camera->update([
      'index' => $validatedData['index'],
      'parking_area_id' => $validatedData['parking_area_id'],
      'type' => $validatedData['type'],
      'status' => $validatedData['status'],
      'source' => $validatedData['source'] ?? null,
    ]);

    return response()->json([
      'message' => 'Camera updated successfully',
      'camera' => $camera
    ]);
  }

  /**
   * Remove the specified camera from storage.
   *
   * @param  \App\Models\Camera $camera
   * @return \Illuminate\Http\Response
   */
  public function destroy(Camera $camera)
  {
    $camera->delete();

    return response()->json([
      'message' => 'Camera deleted successfully'
    ]);
  }
  #!SECTION
}
