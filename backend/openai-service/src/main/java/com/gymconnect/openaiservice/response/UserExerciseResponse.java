package com.gymconnect.openaiservice.response;

import lombok.Data;

import java.util.List;

@Data
public class UserExerciseResponse {
    private ExerciseResponse exercise;
    private int sets;
    private List<Integer> reps;
    private int weight;
    private int rest;
}
