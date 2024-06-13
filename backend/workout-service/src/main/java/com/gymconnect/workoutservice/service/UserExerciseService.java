package com.gymconnect.workoutservice.service;

import com.gymconnect.workoutservice.model.UserExercise;
import com.gymconnect.workoutservice.repository.UserExerciseRepository;
import com.gymconnect.workoutservice.repository.WorkoutDayRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserExerciseService {
    private final UserExerciseRepository userExerciseRepository;
    private final WorkoutDayRepository workoutDayRepository;

    @Autowired
    public UserExerciseService(UserExerciseRepository userExerciseRepository, WorkoutDayRepository workoutDayRepository) {
        this.userExerciseRepository = userExerciseRepository;
        this.workoutDayRepository = workoutDayRepository;
    }

    public UserExercise findById(UUID id) {
        return userExerciseRepository.findById(id).orElse(null);
    }

    public void updateUserExercise(UserExercise userExercise) {
        userExerciseRepository.save(userExercise);
    }

    public void deleteUserExercise(UUID id) {
        userExerciseRepository.deleteById(id);
    }
}