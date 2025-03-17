<?php

use App\Events\ParkingSpotUpdate;
use App\Http\Controllers\AreaController;
use App\Http\Controllers\CameraController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ParkingAreaController;
use App\Http\Controllers\ParkingSpotController;
use App\Http\Controllers\ParkingUserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VehicleController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
  return redirect()->route('dashboard');
});

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth'])->group(function (): void {
  // Route::get('/areas', [ParkingAreaController::class, 'areas'])->name('parking.areas');
  // Route::post('/areas/store', [ParkingAreaController::class, 'store'])->name('parking.areas.store');

  // Route::get('/areas/{id}', [ParkingAreaController::class, 'show'])->name('parking.areas.show');

  Route::get('/spot/{camera_id}', [ParkingSpotController::class, 'spot'])->name('parking.areas.spot');
  Route::get('/parking-spots/{camera_id}', [ParkingSpotController::class, 'getSpot'])->name('spot.get');
  Route::post('/parking-spots/{camera_id}', [ParkingSpotController::class, 'storeSpot'])->name('spot.store');
  Route::delete('/parking-spots/{camera_id}/{spot_id}', [ParkingSpotController::class, 'destroySpot'])->name('spot.destroy');
});

Route::middleware('auth')->group(function () {
  Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
  Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
  Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

  Route::prefix('parking')->name('parking.')->group(function () {
    Route::resource('/area', ParkingAreaController::class);

    Route::post('/spot', [ParkingSpotController::class, 'store'])->name('spot.store');
    Route::put('/spot/{spot}', [ParkingSpotController::class, 'update'])->name('spot.update');
    Route::delete('/spot/{spot}', [ParkingSpotController::class, 'destroy'])->name(name: 'spot.destroy');

    Route::resource('/camera', CameraController::class);;
  });

  Route::resource('area', AreaController::class);
  Route::resource('user', ParkingUserController::class);
  Route::resource('vehicles', VehicleController::class);

  Route::get('vehicle-passes', [VehicleController::class, 'indexVehiclePass'])->name('vehicle.pass.index');
  Route::post('vehicle-passes', [VehicleController::class, 'storeVehiclePass'])->name('vehicle.pass.store');
  Route::put('vehicle-passes/{vehiclePass}', [VehicleController::class, 'updateVehiclePass'])->name('vehicle.pass.update');
  Route::delete('vehicle-passes/{vehiclePass}', [VehicleController::class, 'destroyVehiclePass'])->name('vehicle.pass.destroy');
});


Route::get('/update-parking-spot/{spot_id}/{occupied}', function ($spot_id, $occupied) {
  broadcast(new ParkingSpotUpdate($spot_id, $occupied));
  return response()->json(['status' => 'Message Sent']);
});

require __DIR__ . '/auth.php';
require __DIR__ . '/api.php';
