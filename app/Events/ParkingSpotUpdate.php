<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ParkingSpotUpdate implements ShouldBroadcast
{
  use Dispatchable, InteractsWithSockets, SerializesModels;

  public $spot_id;
  public $occupied;
  /**
   * Create a new event instance.
   */
  public function __construct($spot_id, $occupied)
  {
    $this->spot_id = $spot_id;
    $this->occupied = $occupied;
  }

  /**
   * Get the channels the event should broadcast on.
   *
   * @return array<int, \Illuminate\Broadcasting\Channel>
   */
  public function broadcastOn(): array
  {
    return [
      new Channel('parking-spot-status'),
    ];
  }
}
