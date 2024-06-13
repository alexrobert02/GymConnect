package com.gymconnect.workoutservice.controller;

import com.gymconnect.workoutservice.dto.WorkoutDto;
import com.gymconnect.workoutservice.dto.WorkoutFromApi;
import com.gymconnect.workoutservice.model.Workout;
import com.gymconnect.workoutservice.service.WorkoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

//@CrossOrigin(origins = "http://localhost:3000")
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

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WorkoutFromApi>> getAllWorkoutsByUserId(@PathVariable("userId") UUID userId) {
        List<WorkoutFromApi> workouts = workoutService.findByUserId(userId);
        return new ResponseEntity<>(workouts, HttpStatus.OK);
    }

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
}

