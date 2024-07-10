package com.gymconnect.workoutservice.service;

import com.gymconnect.workoutservice.client.ExerciseClient;
import com.gymconnect.workoutservice.dto.*;
import com.gymconnect.workoutservice.model.UserExercise;
import com.gymconnect.workoutservice.model.Workout;
import com.gymconnect.workoutservice.model.WorkoutDay;
import com.gymconnect.workoutservice.repository.WorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.stream.Collectors;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WorkoutService {
    private final WorkoutRepository workoutRepository;
    private final ExerciseClient client;
    private final Executor asyncExecutor;

    public Workout createWorkout(WorkoutDto workoutDto) {
        Workout workout = new Workout(workoutDto.getUserId(), workoutDto.getName());
        return workoutRepository.save(workout);
    }

    public void updateWorkout(Workout workout) {
        workoutRepository.save(workout);
    }

    public List<Workout> findByUserIdAndName(UUID userId, String name) {
        return workoutRepository.findByUserIdAndName(userId, name);
    }

    public Optional<Workout> findById(UUID workoutId) {
        return workoutRepository.findById(workoutId);
    }

    public List<WorkoutFromApi> findByUserId(UUID userId) {
        List<Workout> workouts = workoutRepository.findWorkoutsByUserId(userId);
        List<WorkoutFromApi> workoutFromApiList = new ArrayList<>();

        for (Workout workout : workouts) {
            WorkoutFromApi workoutFromApi = new WorkoutFromApi();
            workoutFromApi.setId(workout.getId());
            workoutFromApi.setUserId(workout.getUserId());
            workoutFromApi.setName(workout.getName());

            for (WorkoutDay workoutDay : workout.getWorkoutDays()) {
                WorkoutDayFromApi workoutDayFromApi = new WorkoutDayFromApi();
                workoutDayFromApi.setId(workoutDay.getId());
                workoutDayFromApi.setDay(workoutDay.getDay().toString());

                List<CompletableFuture<UserExerciseFromApi>> futures = new ArrayList<>();
                for (UserExercise userExercise : workoutDay.getUserExercises()) {
                    CompletableFuture<UserExerciseFromApi> future = CompletableFuture.supplyAsync(() -> {
                        UserExerciseFromApi userExerciseFromApi = new UserExerciseFromApi();
                        userExerciseFromApi.setId(userExercise.getId());
                        userExerciseFromApi.setSets(userExercise.getSets());
                        userExerciseFromApi.setReps(userExercise.getReps());
                        userExerciseFromApi.setWeight(userExercise.getWeight());
                        userExerciseFromApi.setRest(userExercise.getRest());

                        ExerciseDto exercise = client.findExerciseById(userExercise.getExerciseId());
                        userExerciseFromApi.setExercise(exercise);
                        return userExerciseFromApi;
                    }, asyncExecutor);
                    futures.add(future);
                }

                List<UserExerciseFromApi> userExercisesFromApi = futures.stream()
                        .map(CompletableFuture::join)
                        .collect(Collectors.toList());

                workoutDayFromApi.setUserExercises(userExercisesFromApi);
                workoutFromApi.addWorkoutDay(workoutDayFromApi);
            }
            workoutFromApiList.add(workoutFromApi);
        }
        return workoutFromApiList;
    }

    public void deleteWorkout(UUID id) {
        workoutRepository.deleteById(id);
    }
}