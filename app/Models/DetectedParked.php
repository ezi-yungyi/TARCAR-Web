<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetectedParked extends Model
{
  public $timestamps = false;
  protected $table = 'detected_parked';
  protected $fillable = [
    'parking_spot_id',
    'vehicle_id',
    'parked_at',
    'leave_at',
    'detected_at',
  ];

  public function parkingSpot(): BelongsTo
  {
    return $this->belongsTo(ParkingSpot::class);
  }

  public function vehicle(): BelongsTo
  {
    return $this->belongsTo(Vehicle::class);
  }
}
