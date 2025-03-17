<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use App\Models\VehiclePass;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class VehicleController extends Controller
{
  /**
   * Display a listing of the vehicles.
   *
   * @return
   */
  public function index()
  {
    $vehicles = Vehicle::all();

    return Inertia::render('Vehicle/Index', [
      'vehicles' => $vehicles,
    ]);
  }

  /**
   * Display the specified vehicle.
   *
   * @param  \App\Models\Vehicle $vehicle
   * @return \Illuminate\Http\Response
   */
  public function show(Vehicle $vehicle)
  {
    return response()->json([
      'vehicle' => $vehicle
    ]);
  }

  #SECTION - Vehicle
  /**
   * Store a newly created vehicle in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request)
  {
    $validatedData = $request->validate([
      'license_plate' => 'required|string|max:255|unique:vehicles',
      'color' => 'required|string|max:255',
      'type' => 'required|string|max:255',
    ]);

    $vehicle = Vehicle::create($validatedData);

    return response()->json([
      'message' => 'Vehicle created successfully',
      'vehicle' => $vehicle
    ], 201);
  }

  /**
   * Update the specified vehicle in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \App\Models\Vehicle  $vehicle
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, Vehicle $vehicle)
  {
    $validatedData = $request->validate([
      'license_plate' => 'required|string|max:255|unique:vehicles,license_plate,' . $vehicle->id,
      'color' => 'required|string|max:255',
      'type' => 'required|string|max:255',
    ]);

    $vehicle->update($validatedData);

    return response()->json([
      'message' => 'Vehicle updated successfully',
      'vehicle' => $vehicle
    ]);
  }

  /**
   * Remove the specified vehicle from storage.
   *
   * @param  \App\Models\Vehicle  $vehicle
   * @return \Illuminate\Http\Response
   */
  public function destroy(Vehicle $vehicle)
  {
    $vehicle->delete();

    return response()->json([
      'message' => 'Vehicle deleted successfully'
    ]);
  }
  #!SECTION

  #SECTION - Vehicle Pass
  /**
   * Display a listing of the vehicles.
   *
   * @return
   */
  public function indexVehiclePass()
  {
    $vehiclesPasses = VehiclePass::all();

    // dd($vehiclesPasses);

    return Inertia::render('VehiclePass/Index', [
      'vehiclePasses' => $vehiclesPasses,
    ]);
  }

  /**
   * Display the specified vehicle.
   *
   * @param  \App\Models\Vehicle $vehicle
   * @return \Illuminate\Http\Response
   */
  public function showVehiclePass(Vehicle $vehicle)
  {
    return response()->json([
      'vehicle' => $vehicle
    ]);
  }

  /**
   * Store a newly created vehicle pass in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
  public function storeVehiclePass(Request $request)
  {
    // Validate the incoming data
    $validatedData = $request->validate([
      'parking_user_id' => 'required|exists:parking_users,id',
      'vehicle_id' => 'required|exists:vehicles,id',
      'verified_at' => 'required|date',
      'duration' => 'required|numeric',
      'status' => 'required|string|max:255',
    ]);

    // Create a new vehicle pass record
    $vehiclePass = VehiclePass::create([
      'parking_user_id' => $validatedData['parking_user_id'],
      'vehicle_id' => $validatedData['vehicle_id'],
      'verified_at' => $validatedData['verified_at'],
      'duration' => $validatedData['duration'],
      'status' => $validatedData['status'],
    ]);

    // Return the newly created vehicle pass with a success message
    return response()->json([
      'message' => 'Vehicle pass created successfully',
      'vehicle_pass' => $vehiclePass
    ], 201);
  }

  /**
   * Update the specified vehicle pass in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \App\Models\VehiclePass  $vehiclePass
   * @return \Illuminate\Http\Response
   */
  public function updateVehiclePass(Request $request, VehiclePass $vehiclePass)
  {
    // Validate the incoming data
    $validatedData = $request->validate([
      'parking_user_id' => 'required|exists:parking_users,id',
      'vehicle_id' => 'required|exists:vehicles,id',
      'verified_at' => 'required|date',
      'duration' => 'required|numeric',
      'status' => 'required|string|max:255',
    ]);

    // Update the vehicle pass record
    $vehiclePass->update([
      'parking_user_id' => $validatedData['parking_user_id'],
      'vehicle_id' => $validatedData['vehicle_id'],
      'verified_at' => $validatedData['verified_at'],
      'duration' => $validatedData['duration'],
      'status' => $validatedData['status'],
    ]);

    // Return the updated vehicle pass with a success message
    return response()->json([
      'message' => 'Vehicle pass updated successfully',
      'vehicle_pass' => $vehiclePass
    ]);
  }

  /**
   * Remove the specified vehicle pass from storage.
   *
   * @param  \App\Models\VehiclePass  $vehiclePass
   * @return \Illuminate\Http\Response
   */
  public function destroyVehiclePass(VehiclePass $vehiclePass)
  {
    // Delete the vehicle pass record
    $vehiclePass->delete();

    // Return a success message after deletion
    return response()->json([
      'message' => 'Vehicle pass deleted successfully'
    ]);
  }
  #!SECTION
}
