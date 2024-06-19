package com.gymconnect.openaiservice.openai;

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
