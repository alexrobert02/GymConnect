package com.gymconnect.authserver.workout.service;

import com.gymconnect.authserver.workout.model.UserExercise;
import com.gymconnect.authserver.workout.repository.UserExerciseRepository;
import com.gymconnect.authserver.workout.repository.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserExerciseService {
    private final UserExerciseRepository userExerciseRepository;
    private final WorkoutRepository workoutRepository;

    @Autowired
    public UserExerciseService(UserExerciseRepository userExerciseRepository, WorkoutRepository workoutRepository) {
        this.userExerciseRepository = userExerciseRepository;
        this.workoutRepository = workoutRepository;
    }

    public UserExercise getUserExerciseById(UUID id) {
        return userExerciseRepository.findById(id).orElse(null);
    }
}
