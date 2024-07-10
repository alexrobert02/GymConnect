package com.gymconnect.exerciseservice.controller;

import com.gymconnect.exerciseservice.dto.ExerciseDto;
import com.gymconnect.exerciseservice.service.ExerciseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/exercises")
@RequiredArgsConstructor
public class ExerciseController {
    private final ExerciseService exerciseService;

    @GetMapping("/getAll")
    public ResponseEntity<List<ExerciseDto>> getAllExerciseData() {
        List<ExerciseDto> result = exerciseService.getAllExercises();
        if (result != null) {
            return ResponseEntity.ok(result);
        } else {
            // Handle other types of results or unexpected cases
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<List<ExerciseDto>> getExerciseByName(@PathVariable String name, @RequestParam(defaultValue = "10") String limit) {
        List<ExerciseDto> result = exerciseService.getExerciseByName(name, limit);
        if (result != null) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/target/{target}")
    public ResponseEntity<List<ExerciseDto>> getRandomExercisesByTarget(@PathVariable String target, @RequestParam(defaultValue = "20") String limit) {
        List<ExerciseDto> result = exerciseService.getRandomExercisesByTarget(target, limit);
        if (result != null) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/equipment/{type}")
    public ResponseEntity<List<ExerciseDto>> getRandomExercisesByEquipment(@PathVariable String type, @RequestParam(defaultValue = "20") String limit) {
        List<ExerciseDto> result = exerciseService.getRandomExercisesByEquipment(type, limit);
        if (result != null) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExerciseDto> getExerciseById(@PathVariable String id) {
        ExerciseDto exercise = exerciseService.getExerciseById(id);
        if (exercise != null) {
            return ResponseEntity.ok(exercise);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/bodyPartList")
    public ResponseEntity<List<String>> getBodyPartList() {
        List<String> result = exerciseService.getBodyPartList();
        if (result != null) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/bodyPart/{bodyPart}")
    public ResponseEntity<List<ExerciseDto>> getExercisesByBodyPart(@PathVariable String bodyPart, @RequestParam(defaultValue = "10") String limit) {
        List<ExerciseDto> result = exerciseService.getExercisesByBodyPart(bodyPart, limit);
        if (result != null) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}