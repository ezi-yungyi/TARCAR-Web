<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ParkingSpot extends Model
{
  protected $fillable = [
    'index',
    'parking_area_id',
    'camera_id',
    'position',
    'occupied',
  ];

  public function parkingArea(): BelongsTo {
    return $this->belongsTo(ParkingArea::class);
  }

  public function camara(): BelongsTo {
    return $this->belongsTo(Camera::class);
  }

  public function detectedParked(): HasOne
  {
    return $this->hasOne(DetectedParked::class)->whereNull('leave_at');
  }

  public function detectedDoubleParked(): HasMany
  {
    return $this->hasMany(DetectedDoubleParked::class)->whereNull('leave_at');
  }

  public function parkedHistory(): HasMany
  {
    return $this->hasMany(related: DetectedParked::class)->whereNotNull('leave_at');
  }

  public function doubleParkedHistory(): HasMany
  {
    return $this->hasMany(DetectedDoubleParked::class)->whereNotNull('leave_at');
  }
}
