<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Camera extends Model
{
  protected $fillable = [
    'index',
    'parking_area_id',
    'source',
    'status',
    'type',
  ];

  public function parkingArea(): BelongsTo
  {
    return $this->belongsTo(ParkingArea::class);
  }

  public function parkingSpots(): HasMany
  {
    return $this->hasMany(ParkingSpot::class);
  }
}
