package com.gymconnect.authserver.workout.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class WorkoutDto {
    private UUID userId;
    private String day;
}
