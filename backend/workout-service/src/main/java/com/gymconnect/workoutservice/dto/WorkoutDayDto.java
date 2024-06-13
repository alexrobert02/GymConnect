package com.gymconnect.workoutservice.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class WorkoutDayDto {
    private UUID workoutId;
    private String day;
}
