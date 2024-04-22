package com.gymconnect.authserver.workout.controller;

import com.gymconnect.authserver.exercises.ExerciseDTO;
import com.gymconnect.authserver.exercises.ExercisesService;
import com.gymconnect.authserver.user.User;
import com.gymconnect.authserver.workout.dto.UserExerciseDto;
import com.gymconnect.authserver.workout.model.UserExercise;
import com.gymconnect.authserver.workout.model.Workout;
import com.gymconnect.authserver.workout.service.UserExerciseService;
import com.gymconnect.authserver.workout.service.WorkoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/userExercise")
@RequiredArgsConstructor
public class UserExerciseController {
    private final WorkoutService workoutService;
    private final UserExerciseService userExerciseService;

    @PostMapping
    public ResponseEntity<?> createUserExercise(@RequestBody UserExerciseDto userExerciseDto) {
        if (userExerciseDto.getReps().size() != userExerciseDto.getSets()) {
            String errorMessage = "Size of sets must match the number of reps provided.";
            return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
        }

        Optional<Workout> optionalWorkout = workoutService.findById(userExerciseDto.getWorkoutId());
        if (optionalWorkout.isPresent()) {
            Workout workout = optionalWorkout.get();
            UserExercise userExercise = new UserExercise(userExerciseDto.getExerciseId(), userExerciseDto.getSets(), userExerciseDto.getReps(), userExerciseDto.getWeights(), userExerciseDto.getRest());
            workout.addUserExercise(userExercise);
            workoutService.updateWorkout(workout);
            return new ResponseEntity<>(userExercise, HttpStatus.CREATED);
        } else {
            String errorMessage = "Workout with id " + userExerciseDto.getWorkoutId() + " not found.";
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
            userExercise.setWeights(userExerciseDto.getWeights());
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
