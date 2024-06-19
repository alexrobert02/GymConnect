package com.gymconnect.openaiservice.openai;

import lombok.Data;

@Data
public class UserExerciseDto {
    private String exercise;
    private String sets;
    private String reps;
    private String weight;
    private String rest;
}
