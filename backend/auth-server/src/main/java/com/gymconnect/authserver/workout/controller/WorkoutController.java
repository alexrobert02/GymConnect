package com.gymconnect.authserver.workout.controller;

import com.gymconnect.authserver.workout.dto.WorkoutDto;
import com.gymconnect.authserver.workout.model.Day;
import com.gymconnect.authserver.workout.model.Workout;
import com.gymconnect.authserver.workout.service.WorkoutService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.EnumUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/workout")
@RequiredArgsConstructor
public class WorkoutController {
    private final WorkoutService workoutService;

    @PostMapping
    public ResponseEntity<?> createWorkout(@RequestBody WorkoutDto workoutDto) {

        if (!EnumUtils.isValidEnum(Day.class, workoutDto.getDay())) {
            String errorMessage = "Invalid day provided. Please provide a valid day of the week.";
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
        }
        UUID userId = workoutDto.getUserId();
        Day day = Day.valueOf(workoutDto.getDay());

        List<Workout> existingWorkouts = workoutService.findByUserIdAndDay(userId, day);
        if (!existingWorkouts.isEmpty()) {
            String errorMessage = "A workout already exists for the user on this day.";
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

    @GetMapping("/user/{user-id}")
    public ResponseEntity<List<Workout>> getAllWorkoutsByUserId(@PathVariable("user-id") UUID userId) {
        List<Workout> workouts = workoutService.findByUserId(userId);
        return new ResponseEntity<>(workouts, HttpStatus.OK);

    }

    // Add more endpoints as needed
}
