package com.gymconnect.authserver.workout.service;

import com.gymconnect.authserver.exercises.ExercisesService;
import com.gymconnect.authserver.workout.dto.WorkoutDayDto;
import com.gymconnect.authserver.workout.model.Day;
import com.gymconnect.authserver.workout.model.Workout;
import com.gymconnect.authserver.workout.model.WorkoutDay;
import com.gymconnect.authserver.workout.repository.WorkoutDayRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class WorkoutDayService {
    private final WorkoutService workoutService;
    private final WorkoutDayRepository workoutDayRepository;
    private final ExercisesService exercisesService;
    @Autowired
    public WorkoutDayService(WorkoutService workoutService, WorkoutDayRepository workoutDayRepository, ExercisesService exercisesService) {
        this.workoutService = workoutService;
        this.workoutDayRepository = workoutDayRepository;
        this.exercisesService = exercisesService;
    }

    public WorkoutDay createWorkoutDay(WorkoutDayDto workoutDayDto) {
        WorkoutDay workoutDay = new WorkoutDay(Day.valueOf(workoutDayDto.getDay()));
        return workoutDayRepository.save(workoutDay);
    }

    public void updateWorkoutDay(WorkoutDay workoutDay) {
        workoutDayRepository.save(workoutDay);
    }

    public Optional<WorkoutDay> findById(UUID workoutDayId) {
        return workoutDayRepository.findById(workoutDayId);
    }

//    public List<WorkoutDayFromApi> findByUserId(UUID userId) {
//        List<WorkoutDay> workoutDays = workoutDayRepository.findWorkoutsByUserId(userId);
//        List<WorkoutDayFromApi> workoutDayFromApiList = new ArrayList<>();
//        for(WorkoutDay workoutDay : workoutDays) {
//            WorkoutDayFromApi workoutDayFromApi = new WorkoutDayFromApi();
//            workoutDayFromApi.setId(workoutDay.getId());
//            workoutDayFromApi.setUserId(workoutDay.getUserId());
//            workoutDayFromApi.setDay(workoutDay.getDay().toString());
//
//            for(UserExercise userExercise: workoutDay.getUserExercises()) {
//                UserExerciseFromApi userExerciseFromApi = new UserExerciseFromApi();
//                userExerciseFromApi.setId(userExercise.getId());
//                userExerciseFromApi.setSets(userExercise.getSets());
//                userExerciseFromApi.setReps(userExercise.getReps());
//                userExerciseFromApi.setWeights(userExercise.getWeights());
//                userExerciseFromApi.setRest(userExercise.getRest());
//
//                ExerciseDTO exercise = exercisesService.getExerciseById(userExercise.getExerciseId());
//                userExerciseFromApi.setExercise(exercise);
//                workoutDayFromApi.addUserExercise(userExerciseFromApi);
//            }
//            workoutDayFromApiList.add(workoutDayFromApi);
//        }
//        return workoutDayFromApiList;
//    }

    public void deleteWorkout(UUID id) {
        workoutDayRepository.deleteById(id);
    }

    public Optional<WorkoutDay> findByWorkoutIdAndDay(UUID workoutId, Day day) {
        Optional<Workout> optionalWorkout = workoutService.findById(workoutId);
        if(optionalWorkout.isPresent()) {
            Workout workout = optionalWorkout.get();
            List<WorkoutDay> workoutDays = workout.getWorkoutDays();
            for (WorkoutDay workoutDay : workoutDays) {
                if (workoutDay.getDay().equals(day)) {
                    return Optional.of(workoutDay);
                }
            }
        }
        return Optional.empty();
    }

    public List<Day> findRemainingWorkoutDaysByWorkoutId(UUID workoutId) {
        Optional<Workout> optionalWorkout = workoutService.findById(workoutId);
        if(optionalWorkout.isPresent()) {
            Workout workout = optionalWorkout.get();
            List<WorkoutDay> workoutDays = workout.getWorkoutDays();

            // Get all workout days for the user
            List<Day> remainingWorkoutDays = workoutDays
                    .stream()
                    .map(WorkoutDay::getDay)
                    .toList();

            // Get the set of all days
            EnumSet<Day> allDays = EnumSet.allOf(Day.class);

            // Remove workout days from all days to get remaining days
            remainingWorkoutDays.forEach(allDays::remove);

            // Convert remaining days to a list
            return new ArrayList<>(allDays);
        }
        return Collections.emptyList();
    }
}
