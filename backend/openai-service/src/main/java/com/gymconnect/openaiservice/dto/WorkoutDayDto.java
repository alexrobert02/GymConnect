package com.gymconnect.openaiservice.dto;

import lombok.Data;

import java.util.List;

@Data
public class WorkoutDayDto {
    private String day;
    private List<UserExerciseDto> exercises;
}
