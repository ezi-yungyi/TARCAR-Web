<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TokenHistory extends Model
{
  protected $fillable = [
    'parking_user_id',
    'method',
    'quantity',
    'created_at'
  ];

  public function parkingUser(): BelongsTo
  {
    return $this->belongsTo(ParkingUser::class);
  }
}
