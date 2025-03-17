<?php

namespace App\Http\Controllers;

use App\Events\ParkingSpotUpdate;
use App\Events\WebServerNotification;
use App\Models\ParkingSpot;
use Illuminate\Http\Request;

class APIParkingController extends Controller
{
  public function update(Request $request)
  {
    $licensePlate = $request->input('license_plate');
    $spotId = $request->input('spot_id');
    $status = $request->input('status');

    $data = [
      'licensePlate' => $licensePlate,
      'spotId' => $spotId,
      'status' => $status,
    ];

    broadcast(new ParkingSpotUpdate('check_db', true));
    // broadcast(new WebServerNotification($data));

    return response()->json([
      'status' => 'success',
    ]);
  }

  public function spot($spot_id, $occupied) {
    $data = [
      'spot_id' => $spot_id,
      'occupied' => $occupied,
    ];

    broadcast(new WebServerNotification($data));

    return response()->json(['status' => 'Message Sent']);
  }

  public function check_double_parked($spot_id) {
    $parking_spot = ParkingSpot::findOrFail($spot_id);

    $double_parking = $parking_spot->detectedDoubleParked;

    return response()->json(['double_parked' => $double_parking]);
  }
}
