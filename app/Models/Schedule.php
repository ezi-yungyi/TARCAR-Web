<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Schedule extends Model
{
  protected $fillable = [
    'parking_user_id',
    'title',
    'location',
    'start_at',
    'end_at',
    'repeat',
    'end_repeat',
  ];

  public function parkingUser(): BelongsTo
  {
    return $this->belongsTo(ParkingUser::class);
  }

  public function location(): HasOne
  {
    return $this->hasOne(Area::class, 'location');
  }
}
