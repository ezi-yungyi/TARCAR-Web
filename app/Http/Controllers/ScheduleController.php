<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
  #SECTION - Schedule CUD
  /**
   * Store a newly created schedule in storage.
   *
   * @param  \Illuminate\Http\Request $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request)
  {
    $validatedData = $request->validate([
      'parking_user_id' => 'required|exists:parking_users,id',
      'title' => 'required|string|max:255',
      'location' => 'required|string|max:255',
      'start_at' => 'required|date',
      'end_at' => 'required|date',
      'repeat' => 'required|string',
      'end_repeat' => 'nullable|date',
    ]);

    $schedule = Schedule::create([
      'parking_user_id' => $validatedData['parking_user_id'],
      'title' => $validatedData['title'],
      'location' => $validatedData['location'],
      'start_at' => $validatedData['start_at'],
      'end_at' => $validatedData['end_at'],
      'repeat' => $validatedData['repeat'],
      'end_repeat' => $validatedData['end_repeat'] ?? null,
    ]);

    return response()->json([
      'message' => 'Shedule created successfully',
      'schedule' => $schedule
    ], 201);
  }

  /**
   * Update the specified schedule in storage.
   *
   * @param  \Illuminate\Http\Request $request
   * @param  \App\Models\Schedule  $schedule
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, Schedule $schedule)
  {
    $validatedData = $request->validate([
      'parking_user_id' => 'required|exists:parking_users,id',
      'title' => 'required|string|max:255',
      'location' => 'required|string|max:255',
      'start_at' => 'required|date',
      'end_at' => 'required|date',
      'repeat' => 'required|string',
      'end_repeat' => 'nullable|date',
    ]);

    $schedule->update(
      [
        'parking_user_id' => $validatedData['parking_user_id'],
        'title' => $validatedData['title'],
        'location' => $validatedData['location'],
        'start_at' => $validatedData['start_at'],
        'end_at' => $validatedData['end_at'],
        'repeat' => $validatedData['repeat'],
        'end_repeat' => $validatedData['end_repeat'] ?? null,
      ]
    );

    return response()->json([
      'message' => 'Schedule updated successfully',
      'schedule' => $schedule
    ]);
  }

  /**
   * Remove the specified schedule from storage.
   *
   * @param  \App\Models\Schedule $schedule
   * @return \Illuminate\Http\Response
   */
  public function destroy(Schedule $schedule)
  {
    $schedule->delete();

    return response()->json([
      'message' => 'Schedule deleted successfully'
    ]);
  }
  #!SECTION
}
