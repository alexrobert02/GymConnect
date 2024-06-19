package com.gymconnect.openaiservice.openai;

import lombok.Data;

import java.util.List;

@Data
public class WorkoutDayResponse {
    private String day;
    private List<UserExerciseResponse> userExercises;
}
