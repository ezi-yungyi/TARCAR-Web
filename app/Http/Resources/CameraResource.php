<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class CameraResource extends JsonResource
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
      'index' => $this->index,
      'source' => $this->source ? Storage::url($this->source) : null,
      'status' => $this->status,
      'type' => $this->type,
      'parking_area_id' => $this->whenLoaded('parkingArea'),
      'spots' => ParkingSpotResource::collection($this->whenLoaded('parkingSpots')),
    ];
  }
}
