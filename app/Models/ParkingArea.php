<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ParkingArea extends Model
{
  protected $fillable = [
    'area_id',
    'name',
  ];

  public function area(): BelongsTo
  {
    return $this->belongsTo(Area::class);
  }

  public function cameras(): HasMany
  {
    return $this->hasMany(Camera::class);
  }

  public function parkingSpots(): HasMany
  {
    return $this->hasMany(ParkingSpot::class);
  }
}
