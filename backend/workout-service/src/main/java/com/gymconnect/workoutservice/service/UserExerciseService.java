package com.gymconnect.workoutservice.service;

import com.gymconnect.workoutservice.model.UserExercise;
import com.gymconnect.workoutservice.repository.UserExerciseRepository;
import com.gymconnect.workoutservice.repository.WorkoutDayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserExerciseService {
    private final UserExerciseRepository userExerciseRepository;

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