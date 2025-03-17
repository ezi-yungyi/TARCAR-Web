<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetectedDoubleParked extends Model
{
  public $timestamps = false;
  protected $table = 'detected_double_parked';

  protected $fillable = [
    'parking_spot_id',
    'double_parked_by',
    'parked_at',
    'leave_at',
    'detected_at',
  ];

  public function parkingSpot(): BelongsTo
  {
    return $this->belongsTo(ParkingSpot::class);
  }

  public function doubleParkedBy(): BelongsTo
  {
    return $this->belongsTo(Vehicle::class, 'double_parked_by');
  }
}
