package com.gymconnect.authserver.workout.dto;


import com.gymconnect.authserver.exercises.ExerciseDTO;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class UserExerciseFromApi {

    private UUID id;
    private ExerciseDTO exercise;
    private Integer sets;
    private List<Integer> reps;
    private Double weights;
    private Integer rest;
}
