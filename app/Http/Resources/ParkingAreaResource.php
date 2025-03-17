<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ParkingAreaResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    return [
      'id' => $this->id,
      'name' => $this->name,
      'location' => $this->location,
      // 'total_spots' => $this->parking_spots->count(),

      'spots' => ParkingSpotResource::collection($this->whenLoaded('parkingSpots')),
      'cameras' => CameraResource::collection($this->whenLoaded('cameras')),
    ];
  }
}
