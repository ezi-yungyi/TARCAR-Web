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
    Schema::create('vehicles', function (Blueprint $table) {
      $table->id();
      $table->string('license_plate')->unique()->index();
      $table->string('color');
      $table->string('type');
      $table->timestamps();
    });

    Schema::create('vehicle_passes', function (Blueprint $table) {
      $table->id();
      $table->foreignId('parking_user_id')->constrained('parking_users');
      $table->foreignId('vehicle_id')->constrained('vehicles');
      $table->timestamp('verified_at');
      $table->float('duration');
      $table->string('status');
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('vehicles');
    Schema::dropIfExists('vehicle_passes');
  }
};
