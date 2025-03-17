<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Laravel\Sanctum\HasApiTokens;

class ParkingUser extends Model
{
  use HasApiTokens;
  
  protected $fillable = [
    'uni_id',
    'name',
    'email',
    'phone',
    'token',
  ];

  public function vehicle(): HasOneThrough
  {
    return $this->hasOneThrough(Vehicle::class, VehiclePass::class)
    ->where('vehicle_passes.status', 'active');
  }

  public function tokenHistories(): HasMany
  {
    return $this->hasMany(TokenHistory::class);
  }

  public function schedules(): HasMany
  {
    return $this->hasMany(Schedule::class);
  }

  public function vehiclePass(): HasMany
  {
    return $this->hasMany(VehiclePass::class);
  }
}
