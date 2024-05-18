package com.gymconnect.authserver.workout.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
public class WorkoutFromApi {
    private UUID id;
    private UUID userId;
    private String name;
    private List<WorkoutDayFromApi> workoutDays = new ArrayList<>();
    public void addWorkoutDay(WorkoutDayFromApi workoutDayFromApi) {
        workoutDays.add(workoutDayFromApi);
    }
}
