package com.gymconnect.workoutservice.controller;

import com.gymconnect.workoutservice.dto.WorkoutDayDto;
import com.gymconnect.workoutservice.model.Day;
import com.gymconnect.workoutservice.model.Workout;
import com.gymconnect.workoutservice.model.WorkoutDay;
import com.gymconnect.workoutservice.service.WorkoutDayService;
import com.gymconnect.workoutservice.service.WorkoutService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.EnumUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/workoutDay")
@RequiredArgsConstructor
public class WorkoutDayController {
    private final WorkoutDayService workoutDayService;
    private final WorkoutService workoutService;

    @PostMapping
    public ResponseEntity<?> createWorkoutDay(@RequestBody WorkoutDayDto workoutDayDto) {

        if (!EnumUtils.isValidEnum(Day.class, workoutDayDto.getDay())) {
            String errorMessage = "Invalid day provided. Please provide a valid day of the week.";
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
        }
        UUID workoutId = workoutDayDto.getWorkoutId();
        Day day = Day.valueOf(workoutDayDto.getDay());

        Optional<WorkoutDay> existingWorkoutDays = workoutDayService.findByWorkoutIdAndDay(workoutId, day);
        if (existingWorkoutDays.isPresent()) {
            String errorMessage = "A workout already exists for the workout on this day.";
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorMessage);
        }

        Optional<Workout> existingWorkout = workoutService.findById(workoutId);
        if (existingWorkout.isEmpty()) {
            String errorMessage = "Workout with id " + workoutId + " not found.";
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorMessage);
        }

        Workout workout = existingWorkout.get();
        WorkoutDay workoutDay = new WorkoutDay(Day.valueOf(workoutDayDto.getDay()));
        workout.addWorkoutDay(workoutDay);
        workoutService.updateWorkout(workout);

        return new ResponseEntity<>(workoutDay, HttpStatus.CREATED);
    }

    @GetMapping("/remaining-days/workout/{workoutId}")
    public ResponseEntity<List<Day>> getRemainingWorkoutDaysByUserId(@PathVariable("workoutId") UUID userId) {
        List<Day> remainingDays = workoutDayService.findRemainingWorkoutDaysByWorkoutId(userId);
        return new ResponseEntity<>(remainingDays, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWorkoutDay(@PathVariable("id") UUID id) {
        Optional<WorkoutDay> existingWorkout = workoutDayService.findById(id);
        if (existingWorkout.isEmpty()) {
            String errorMessage = "WorkoutDay not found.";
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }

        workoutDayService.deleteWorkout(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("WorkoutDay deleted successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateWorkoutDay(@PathVariable UUID id, @RequestBody WorkoutDayDto workoutDayDto) {
        Optional<WorkoutDay> existingWorkout = workoutDayService.findById(id);
        if (existingWorkout.isPresent()) {
            // Update exercise details
            WorkoutDay workoutDay = existingWorkout.get();
            workoutDay.setDay(Day.valueOf(workoutDayDto.getDay()));

            workoutDayService.updateWorkoutDay(workoutDay);
            return new ResponseEntity<>(workoutDay, HttpStatus.OK);
        } else {
            String errorMessage = "Workout not found.";
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }
    }
}
