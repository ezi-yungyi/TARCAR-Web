<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('areas', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->string('campus_location');
      $table->json('gps_location');
      $table->json('near_by');
      $table->timestamps();
    });

    Schema::create('parking_areas', function (Blueprint $table) {
      $table->id();
      $table->foreignId('area_id')->constrained('areas');
      $table->string('name');
      $table->json('front_end_graphic')->nullable();
      $table->timestamps();
    });

    Schema::create('cameras', function (Blueprint $table) {
      $table->id();
      $table->string('index')->unique()->index()->nullable();
      $table->foreignId('parking_area_id')->constrained('parking_areas');
      $table->string('source')->nullable();
      $table->string('status');
      $table->string('type');
      $table->timestamps();
    });

    Schema::create('parking_spots', function (Blueprint $table) {
      $table->id();
      $table->string('index')->unique()->index()->nullable();
      $table->foreignId('parking_area_id')->constrained('parking_areas');
      $table->foreignId('camera_id')->constrained('cameras');
      $table->json('position');
      $table->boolean('occupied');
      $table->timestamp('user_leaving')->nullable();
      $table->timestamps();
    });

    Schema::create('schedules', function (Blueprint $table) {
      $table->id();
      $table->foreignId('parking_user_id')->constrained('parking_users');
      $table->string('title');
      $table->foreignId('location')->constrained('areas');
      $table->dateTime('start_at');
      $table->dateTime('end_at');
      $table->string('repeat');
      $table->dateTime('end_repeat')->nullable();
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('areas');
    Schema::dropIfExists('schedules');
    Schema::dropIfExists('parking_areas');
    Schema::dropIfExists('cameras');
    Schema::dropIfExists('parking_spots');
  }
};
