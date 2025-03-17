<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

class Vehicle extends Model
{
  protected $fillable = [
    'license_plate',
    'color',
    'type',
  ];

  public function parkingUser(): HasOneThrough
  {
    return $this->hasOneThrough(ParkingUser::class, VehiclePass::class)
      ->where('vehicle_passes.status', 'active');
  }

  public function vehiclePasses(): HasMany
  {
    return $this->hasMany(VehiclePass::class);
  }

  public function detectedParked(): HasOne
  {
    return $this->hasOne(DetectedParked::class)->whereNull('leave_at');
  }

  public function detectedDoubleParked(): HasMany
  {
    return $this->hasMany(DetectedDoubleParked::class, 'double_parked_by')->whereNull('leave_at');
  }

  public function parkedHistory(): HasMany
  {
    return $this->hasMany(related: DetectedParked::class)->whereNotNull('leave_at');
  }

  public function doubleParkedHistory(): HasMany
  {
    return $this->hasMany(DetectedDoubleParked::class, 'double_parked_by')->whereNotNull('leave_at');
  }
}
