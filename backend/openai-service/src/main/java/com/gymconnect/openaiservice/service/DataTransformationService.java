package com.gymconnect.openaiservice.service;

import com.gymconnect.openaiservice.client.ExerciseClient;
import com.gymconnect.openaiservice.dto.UserExerciseDto;
import com.gymconnect.openaiservice.dto.WorkoutDayDto;
import com.gymconnect.openaiservice.response.ExerciseResponse;
import com.gymconnect.openaiservice.response.UserExerciseResponse;
import com.gymconnect.openaiservice.response.WorkoutDayResponse;
import org.springframework.stereotype.Service;

import java.util.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

@Service
public class DataTransformationService {

    private final ExerciseClient client;
    private final Executor asyncExecutor;

    @Autowired
    public DataTransformationService(ExerciseClient client, @Qualifier("asyncExecutor") Executor asyncExecutor) {
        this.client = client;
        this.asyncExecutor = asyncExecutor;
    }

    public List<WorkoutDayResponse> transformExercises(List<WorkoutDayDto> workoutDays) {

        List<WorkoutDayResponse> workoutDaysResponse = new ArrayList<>();

        for (WorkoutDayDto workoutDay : workoutDays) {
            WorkoutDayResponse workoutDayResponse = new WorkoutDayResponse();
            workoutDayResponse.setDay(extractDay(workoutDay.getDay()));

            List<CompletableFuture<Optional<UserExerciseResponse>>> futures = new ArrayList<>();

            for (UserExerciseDto userExercise : workoutDay.getExercises()) {
                CompletableFuture<Optional<UserExerciseResponse>> future = CompletableFuture.supplyAsync(() -> {
                    ExerciseResponse exercise = getMatchedExercise(userExercise.getExercise());
                    if (exercise != null) {
                        UserExerciseResponse userExerciseResponse = new UserExerciseResponse();

                        userExerciseResponse.setExercise(exercise);
                        userExerciseResponse.setSets(transformToNumber(userExercise.getSets()));
                        userExerciseResponse.setReps(transformReps(userExercise.getReps(), userExerciseResponse.getSets()));
                        userExerciseResponse.setWeight(transformToNumber(userExercise.getWeight()));
                        userExerciseResponse.setRest(transformToNumber(userExercise.getRest()));
                        return Optional.of(userExerciseResponse);
                    } else {
                        return Optional.empty();
                    }
                }, asyncExecutor);
                futures.add(future);
            }

            List<UserExerciseResponse> userExercisesResponse = futures.stream()
                    .map(CompletableFuture::join)
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .collect(Collectors.toList());

            workoutDayResponse.setUserExercises(userExercisesResponse);
            workoutDaysResponse.add(workoutDayResponse);
        }

        return workoutDaysResponse;
    }

    private int transformToNumber(String weight) {
        return weight.chars()
                .filter(Character::isDigit)
                .mapToObj(c -> String.valueOf((char) c))
                .reduce((s1, s2) -> s1 + s2)
                .map(Integer::parseInt)
                .orElse(0);
    }

    public ExerciseResponse getMatchedExercise(String exerciseName) {
        List<ExerciseResponse> exercisesFromApi = client.findExerciseByName(matchExerciseName(exerciseName), 100);

        ExerciseResponse exercise = exercisesFromApi.stream()
                .filter(e -> e.getName().equals(exerciseName))
                .findFirst()
                .orElse(null);

        if (exercise == null && !exercisesFromApi.isEmpty()) {
            if (matchExerciseName(exerciseName).equals("sled 45"))
                return exercisesFromApi.get(2);
            if (matchExerciseName(exerciseName).equals("triceps dip"))
                return exercisesFromApi.get(2);
            return exercisesFromApi.get(0);
        }

        return exercise;
    }

    public String matchExerciseName(String exerciseName) {
        exerciseName = exerciseName.toLowerCase();
        int length = exerciseName.length();
        if (length > 1 && exerciseName.charAt(length - 1) == 's' && exerciseName.charAt(length - 2) != 's') {
            exerciseName = exerciseName.substring(0, length - 1);
        }

        exerciseName = exerciseName.replaceAll("\\b(tricep|bicep)\\b", "$1s");

        if (exerciseName.contains("dip"))
            if (exerciseName.equals("squat") || exerciseName.equals("barbell squat"))
                return "barbell full squat";

        if (exerciseName.equals("plank"))
            return "weighted front plank";

        if (exerciseName.equals("deadlift"))
            return randomChoice(Arrays.asList("barbell deadlift", "barbell romanian deadlift", "dumbbell romanian deadlift"));

        if (exerciseName.equals("dumbbell flye") || exerciseName.contains("fly"))
            return "dumbbell fly";

        if (exerciseName.equals("leg press"))
            return "sled 45";

        if (exerciseName.equals("hammer curl") || exerciseName.equals("biceps curl"))
            return "dumbbell " + exerciseName;

        if (exerciseName.equals("lat pulldown"))
            return "cable pulldown (pro lat bar)";

        if (exerciseName.equals("seated row"))
            return randomChoice(Arrays.asList("lever seated row", "lever narrow grip seated row", "cable seated row", "cable straight back seated row"));

        if (exerciseName.contains("shoulder press")) {
            if (exerciseName.contains("dumbbell"))
                return randomChoice(Arrays.asList("dumbbell seated shoulder press", "dumbbell standing overhead press"));
            else return randomChoice(Arrays.asList("barbell standing wide military press", "dumbbell seated shoulder press", "dumbbell standing overhead press"));
        }

        if (exerciseName.contains("military")) {
            return "barbell standing wide military press";
        }

        if (exerciseName.equals("dumbbell shoulder press"))
            return "dumbbell seated shoulder press";

        if (exerciseName.equals("bent over barbell row"))
            return "barbell bent over row";

        if (exerciseName.contains("crunche")) {
            if (exerciseName.equals("crunche"))
                return randomChoice(Arrays.asList("crunch floor", "cross body crunch"));
            else
                return "band bicycle crunch";
        }

        if (exerciseName.equals("leg curl"))
            return randomChoice(Arrays.asList("lever lying leg curl", "lever seated leg curl"));

        if (exerciseName.contains("hip thrust"))
            return "barbell lying lifting (on hip)";

        if (exerciseName.contains("lateral raise"))
            return "dumbbell lateral raise";

        if (exerciseName.contains("incline") && exerciseName.contains("press")) {
            if (exerciseName.contains("dumbbell"))
                return "dumbbell incline bench press";
            else if (exerciseName.contains("barbell"))
                return "barbell incline bench press";
        }

        if (exerciseName.contains("kickback"))
            return randomChoice(Arrays.asList("cable two arm tricep kickback", "dumbbell kickback", "dumbbell standing kickback"));

        return exerciseName;
    }

    public String randomChoice(List<String> options) {
        Random rand = new Random();
        return options.get(rand.nextInt(options.size()));
    }

    public String extractDay(String day) {
        String[] daysOfWeek = {"MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"};

        return Arrays.stream(daysOfWeek)
                .filter(dayOfWeek -> day.toUpperCase().contains(dayOfWeek))
                .findFirst()
                .orElse("No day found");
    }

    public List<Integer> transformReps(String reps, int sets) {
        int repValue;
        if (reps.contains("-")) {
            repValue = Integer.parseInt(reps.split("-")[0]);
        } else {
            repValue = transformToNumber(reps);
        }
        return Collections.nCopies(sets, repValue);
    }
}
