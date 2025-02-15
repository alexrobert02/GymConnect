package com.gymconnect.workoutservice.dto;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class UserExerciseDto {

    private UUID workoutDayId;
    private String exerciseId;
    private Integer sets;
    private List<Integer> reps;
    private Double weight;
    private Integer rest;
}
