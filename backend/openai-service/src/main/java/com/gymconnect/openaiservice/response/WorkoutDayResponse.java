package com.gymconnect.openaiservice.response;

import lombok.Data;

import java.util.List;

@Data
public class WorkoutDayResponse {
    private String day;
    private List<UserExerciseResponse> userExercises;
}
