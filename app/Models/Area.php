<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Area extends Model
{
  protected $fillable = [
    'name',
    'campus_location',
    'gps_location',
    'near_by'
  ];

  public function parkingAreas(): HasMany
  {
    return $this->hasMany(ParkingArea::class);
  }

  public function relatedSchedules(): HasMany
  {
    return $this->hasMany(Schedule::class, 'location');
  }
}
