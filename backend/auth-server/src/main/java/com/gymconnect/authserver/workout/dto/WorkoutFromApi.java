package com.gymconnect.authserver.workout.dto;

import com.gymconnect.authserver.workout.model.UserExercise;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
public class WorkoutFromApi {
    private UUID id;
    private UUID userId;
    private String day;
    private List<UserExerciseFromApi> userExercises = new ArrayList<>();

    public void addUserExercise(UserExerciseFromApi userExercisefromApi) {
        userExercises.add(userExercisefromApi);
    }
}
