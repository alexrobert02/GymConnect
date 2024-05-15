package com.gymconnect.authserver.exercises;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/exercises")
@RequiredArgsConstructor
public class ExercisesController {
    private final ExercisesService exercisesService;

    @GetMapping("/getAll")
    public ResponseEntity<List<ExerciseDTO>> getAllExerciseData() {
        List<ExerciseDTO> result = exercisesService.getAllExercises();
        if (result != null) {
            return ResponseEntity.ok(result);
        } else { 
            // Handle other types of results or unexpected cases
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<List<ExerciseDTO>> getExerciseByName(@PathVariable String name, @RequestParam(defaultValue = "10") String limit) {
        List<ExerciseDTO> result = exercisesService.getExerciseByName(name, limit);
        if (result != null) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExerciseDTO> getExerciseById(@PathVariable String id) {
        ExerciseDTO exercise = exercisesService.getExerciseById(id);
        if (exercise != null) {
            return ResponseEntity.ok(exercise);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}