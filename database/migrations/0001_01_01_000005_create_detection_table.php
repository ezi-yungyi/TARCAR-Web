<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('detected_parked', function (Blueprint $table) {
      $table->id();
      $table->foreignId('vehicle_id')->constrained('vehicles');
      $table->foreignId('parking_spot_id')->constrained('parking_spots');
      $table->timestamp('parked_at');
      $table->timestamp('leave_at');
      $table->timestamp('detected_at');
    });

    Schema::create('detected_double_parked', function (Blueprint $table) {
      $table->id();
      $table->foreignId('double_parked_by')->constrained('vehicles');
      $table->foreignId('parking_spot_id')->constrained('parking_spots');
      $table->timestamp('parked_at');
      $table->timestamp('leave_at');
      $table->timestamp('detected_at');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('detected_parked');
    Schema::dropIfExists('detected_double_parked');
  }
};
