package com.gymconnect.authserver.workout.service;

import com.gymconnect.authserver.exercises.ExerciseDTO;
import com.gymconnect.authserver.exercises.ExercisesService;
import com.gymconnect.authserver.workout.dto.UserExerciseFromApi;
import com.gymconnect.authserver.workout.dto.WorkoutDto;
import com.gymconnect.authserver.workout.dto.WorkoutFromApi;
import com.gymconnect.authserver.workout.model.Day;
import com.gymconnect.authserver.workout.model.UserExercise;
import com.gymconnect.authserver.workout.model.Workout;
import com.gymconnect.authserver.workout.repository.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class WorkoutService {
    private final WorkoutRepository workoutRepository;
    private final ExercisesService exercisesService;
    @Autowired
    public WorkoutService(WorkoutRepository workoutRepository, ExercisesService exercisesService) {
        this.workoutRepository = workoutRepository;
        this.exercisesService = exercisesService;
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

    public List<WorkoutFromApi> findByUserId(UUID userId) {
        List<Workout> workouts = workoutRepository.findWorkoutsByUserId(userId);
        List<WorkoutFromApi> workoutFromApiList = new ArrayList<>();
        for(Workout workout: workouts) {
            WorkoutFromApi workoutFromApi = new WorkoutFromApi();
            workoutFromApi.setId(workout.getId());
            workoutFromApi.setUserId(workout.getUserId());
            workoutFromApi.setDay(workout.getDay().toString());

            for(UserExercise userExercise: workout.getUserExercises()) {
                UserExerciseFromApi userExerciseFromApi = new UserExerciseFromApi();
                userExerciseFromApi.setId(userExercise.getId());
                userExerciseFromApi.setSets(userExercise.getSets());
                userExerciseFromApi.setReps(userExercise.getReps());
                userExerciseFromApi.setWeights(userExercise.getWeights());
                userExerciseFromApi.setRest(userExercise.getRest());

                ExerciseDTO exercise = exercisesService.getExerciseById(userExercise.getExerciseId());
                userExerciseFromApi.setExercise(exercise);
                workoutFromApi.addUserExercise(userExerciseFromApi);
            }
            workoutFromApiList.add(workoutFromApi);
        }
        return workoutFromApiList;
    }

    public void deleteWorkout(UUID id) {
        workoutRepository.deleteById(id);
    }

    public List<Day> findRemainingWorkoutDaysByUserId(UUID userId) {
        // Get all workout days for the user
        List<Day> workoutDays = workoutRepository.findWorkoutsByUserId(userId)
                .stream()
                .map(Workout::getDay)
                .toList();

        // Get the set of all days
        EnumSet<Day> allDays = EnumSet.allOf(Day.class);

        // Remove workout days from all days to get remaining days
        workoutDays.forEach(allDays::remove);

        // Convert remaining days to a list
        return new ArrayList<>(allDays);
    }
}
