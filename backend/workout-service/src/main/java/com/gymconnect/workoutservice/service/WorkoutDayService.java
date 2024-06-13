package com.gymconnect.workoutservice.service;

import com.gymconnect.workoutservice.dto.WorkoutDayDto;
import com.gymconnect.workoutservice.model.Day;
import com.gymconnect.workoutservice.model.Workout;
import com.gymconnect.workoutservice.model.WorkoutDay;
import com.gymconnect.workoutservice.repository.WorkoutDayRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class WorkoutDayService {
    private final WorkoutService workoutService;
    private final WorkoutDayRepository workoutDayRepository;
    @Autowired
    public WorkoutDayService(WorkoutService workoutService, WorkoutDayRepository workoutDayRepository) {
        this.workoutService = workoutService;
        this.workoutDayRepository = workoutDayRepository;
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
