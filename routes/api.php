<?php

use App\Http\Controllers\APIParkingController;
use App\Http\Controllers\ParkingSpotController;
use App\Http\Controllers\ScheduleController;
use Illuminate\Support\Facades\Route;

Route::prefix('api')->middleware('api.token')->group(function() {
  Route::get('testing', function() {return 'testing get';});
  Route::post('testing', function() {return 'testing post';});
  Route::put('testing', function() {return 'testing put';});
  Route::delete('testing', function() {return 'testing delete';});
  Route::get('all_parking_spots', [ParkingSpotController::class, 'getAll']);
  Route::post('/parking/spot', [APIParkingController::class, 'update']);

  Route::get('/parking/spot/{spot_id}', [APIParkingController::class, 'check_double_parked']);


  Route::post('/parking/spot/{spot_id}/{occupied}', [APIParkingController::class, 'spot']);
});

// Route::prefix('api')->group(function() {
//   Route::post('schedule', [ScheduleController::class, 'store'])->name('schedule.store');
//   Route::put('schedule/{schedule}', [ScheduleController::class, 'update'])->name('schedule.update');
//   Route::delete('schedule/{schedule}', [ScheduleController::class, 'destroy'])->name('schedule.destroy');
// })->middleware('api-token');
