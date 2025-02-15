package com.gymconnect.workoutservice.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
public class WorkoutDayFromApi {
    private UUID id;
    private String day;
    private List<UserExerciseFromApi> userExercises = new ArrayList<>();

}
