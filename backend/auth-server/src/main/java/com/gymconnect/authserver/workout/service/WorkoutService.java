package com.gymconnect.authserver.workout.service;

import com.gymconnect.authserver.workout.dto.WorkoutDto;
import com.gymconnect.authserver.workout.model.Day;
import com.gymconnect.authserver.workout.model.Workout;
import com.gymconnect.authserver.workout.repository.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class WorkoutService {
    private final WorkoutRepository workoutRepository;
    @Autowired
    public WorkoutService(WorkoutRepository workoutRepository) {
        this.workoutRepository = workoutRepository;
    }

    public Workout createWorkout(WorkoutDto workoutDto) {
        Workout workout = new Workout(workoutDto.getUserId(), Day.valueOf(workoutDto.getDay()));
        return workoutRepository.save(workout);
    }

    public void updateWorkout(Workout workout) {
        workoutRepository.save(workout);
    }

    public List<Workout> findByUserIdAndDay(UUID userId, Day day) {
        return workoutRepository.findByUserIdAndDay(userId, day);
    }

    public Optional<Workout> findById(UUID workoutId) {
        return workoutRepository.findById(workoutId);
    }

    public List<Workout> findByUserId(UUID userId) {
        return workoutRepository.findWorkoutsByUserId(userId);
    }

    public void deleteWorkout(UUID id) {
        workoutRepository.deleteById(id);
    }
}
