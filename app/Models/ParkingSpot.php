<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParkingSpot extends Model
{
  protected $fillable = [
    'position',
    'status',

  ];
}
