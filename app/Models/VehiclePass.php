<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VehiclePass extends Model
{
  protected $fillable = [
    'parking_user_id',
    'vehicle_id',
    'verified_at',
    'duration',
    'status',
  ];

  public function parkingUser(): BelongsTo
  {
    return $this->belongsTo(ParkingUser::class);
  }

  public function vehicle(): BelongsTo
  {
    return $this->belongsTo(Vehicle::class);
  }
}
