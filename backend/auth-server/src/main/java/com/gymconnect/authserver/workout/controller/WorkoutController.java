package com.gymconnect.authserver.workout.controller;

import com.gymconnect.authserver.workout.dto.WorkoutDayDto;
import com.gymconnect.authserver.workout.dto.WorkoutDayFromApi;
import com.gymconnect.authserver.workout.dto.WorkoutDto;
import com.gymconnect.authserver.workout.dto.WorkoutFromApi;
import com.gymconnect.authserver.workout.model.Day;
import com.gymconnect.authserver.workout.model.Workout;
import com.gymconnect.authserver.workout.model.WorkoutDay;
import com.gymconnect.authserver.workout.service.WorkoutDayService;
import com.gymconnect.authserver.workout.service.WorkoutService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.EnumUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/workout")
@RequiredArgsConstructor
public class WorkoutController {
    private final WorkoutService workoutService;

    @PostMapping
    public ResponseEntity<?> createWorkout(@RequestBody WorkoutDto workoutDto) {
          UUID userId = workoutDto.getUserId();
          String name = workoutDto.getName();

        List<Workout> existingWorkoutDays = workoutService.findByUserIdAndName(userId, name);
        if (!existingWorkoutDays.isEmpty()) {
            String errorMessage = "A workout already exists for the user with this name.";
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorMessage);
        }

        Workout createdWorkout = workoutService.createWorkout(workoutDto);
        return new ResponseEntity<>(createdWorkout, HttpStatus.CREATED);
    }

//    @GetMapping("/day")
//    public ResponseEntity<List<Workout>> getWorkoutsByUserAndDay(@RequestParam UUID userId, @RequestParam Day day) {
//        List<Workout> workouts = workoutService.findByUserIdAndDay(userId, day);
//        return new ResponseEntity<>(workouts, HttpStatus.OK);
//    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WorkoutFromApi>> getAllWorkoutsByUserId(@PathVariable("userId") UUID userId) {
        List<WorkoutFromApi> workouts = workoutService.findByUserId(userId);
        return new ResponseEntity<>(workouts, HttpStatus.OK);
    }

//    @GetMapping("/remaining-days/user/{userId}")
//    public ResponseEntity<List<Day>> getRemainingWorkoutDaysByUserId(@PathVariable("userId") UUID userId) {
//        List<Day> remainingDays = workoutDayService.findRemainingWorkoutDaysByUserId(userId);
//        return new ResponseEntity<>(remainingDays, HttpStatus.OK);
//    }

    @DeleteMapping("/{workoutId}")
    public ResponseEntity<?> deleteWorkoutDay(@PathVariable("workoutId") UUID id) {
        Optional<Workout> existingWorkout = workoutService.findById(id);
        if (existingWorkout.isEmpty()) {
            String errorMessage = "Workout not found.";
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }

        workoutService.deleteWorkout(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Workout deleted successfully");
    }

//    @PutMapping("/{id}")
//    public ResponseEntity<?> updateWorkout(@PathVariable UUID id, @RequestBody WorkoutDto workoutDto) {
//        Optional<Workout> existingWorkout = workoutService.findById(id);
//        if (existingWorkout.isPresent()) {
//            // Update exercise details
//            Workout workout = existingWorkout.get();
//            workoutDay.setDay(Day.valueOf(workoutDayDto.getDay()));
//
//            workoutService.updateWorkout(workout);
//            return new ResponseEntity<>(workoutDay, HttpStatus.OK);
//        } else {
//            String errorMessage = "Workout not found.";
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
//        }
//    }
}
