<?php

namespace App\Http\Controllers;

use App\Models\Camera;
use App\Models\ParkingArea;
use App\Models\ParkingSpot;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
  public function index(Request $request)
  {
    $total_areas = ParkingArea::count();
    $total_spots = ParkingSpot::count();
    $total_camera = Camera::count();

    return Inertia::render('Dashboard', [
      'total_areas' => $total_areas,
      'total_spots' => $total_spots,
      'total_camera' => $total_camera,
    ]);
  }
}
