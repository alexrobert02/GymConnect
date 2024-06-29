package com.gymconnect.workoutservice.controller;

import com.gymconnect.workoutservice.dto.UserExerciseDto;
import com.gymconnect.workoutservice.model.UserExercise;
import com.gymconnect.workoutservice.model.WorkoutDay;
import com.gymconnect.workoutservice.service.UserExerciseService;
import com.gymconnect.workoutservice.service.WorkoutDayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

//@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/userExercise")
@RequiredArgsConstructor
public class UserExerciseController {
    private final WorkoutDayService workoutDayService;
    private final UserExerciseService userExerciseService;

    @PostMapping
    public ResponseEntity<?> createUserExercise(@RequestBody UserExerciseDto userExerciseDto) {
        if (userExerciseDto.getReps().size() != userExerciseDto.getSets()) {
            String errorMessage = "Size of sets must match the number of reps provided.";
            return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
        }

        Optional<WorkoutDay> optionalWorkout = workoutDayService.findById(userExerciseDto.getWorkoutDayId());
        if (optionalWorkout.isPresent()) {
            WorkoutDay workoutDay = optionalWorkout.get();
            UserExercise userExercise = new UserExercise(userExerciseDto.getExerciseId(), userExerciseDto.getSets(), userExerciseDto.getReps(), userExerciseDto.getWeight(), userExerciseDto.getRest());
            workoutDay.addUserExercise(userExercise);
            workoutDayService.updateWorkoutDay(workoutDay);
            return new ResponseEntity<>(userExercise, HttpStatus.CREATED);
        } else {
            String errorMessage = "Workout with id " + userExerciseDto.getWorkoutDayId() + " not found.";
            return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserExercise(@PathVariable UUID id, @RequestBody UserExerciseDto userExerciseDto) {
        UserExercise userExercise = userExerciseService.findById(id);
        if (userExercise != null) {
            // Update exercise details
            userExercise.setExerciseId(userExerciseDto.getExerciseId());
            userExercise.setSets(userExerciseDto.getSets());
            userExercise.setReps(userExerciseDto.getReps());
            userExercise.setWeight(userExerciseDto.getWeight());
            userExercise.setRest(userExerciseDto.getRest());

            // Update exercise in database
            userExerciseService.updateUserExercise(userExercise);
            return new ResponseEntity<>(userExercise, HttpStatus.OK);
        } else {
            String errorMessage = "User exercise with id " + id + " not found.";
            return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserExercise> getUserExerciseById(@PathVariable UUID id) {
        UserExercise userExercise = userExerciseService.findById(id);
        if (userExercise == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(userExercise, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUserExercise(@PathVariable("id") UUID id) {
        UserExercise existingUserExercise = userExerciseService.findById(id);
        if (existingUserExercise == null) {
            String errorMessage = "UserExercise not found.";
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }

        userExerciseService.deleteUserExercise(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Workout deleted successfully");
    }
}
