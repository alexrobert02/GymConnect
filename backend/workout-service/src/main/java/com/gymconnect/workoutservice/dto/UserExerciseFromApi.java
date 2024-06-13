package com.gymconnect.workoutservice.dto;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class UserExerciseFromApi {

    private UUID id;
    private ExerciseDto exercise;
    private Integer sets;
    private List<Integer> reps;
    private Double weights;
    private Integer rest;
}
