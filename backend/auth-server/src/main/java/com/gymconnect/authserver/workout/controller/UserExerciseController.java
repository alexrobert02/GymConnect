package com.gymconnect.authserver.workout.controller;

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



    @GetMapping("/{id}")
    public ResponseEntity<UserExercise> getUserExerciseById(@PathVariable UUID id) {
        UserExercise userExercise = userExerciseService.getUserExerciseById(id);
        if (userExercise == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(userExercise, HttpStatus.OK);
    }
}
