package com.gymconnect.openaiservice.controller;



import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gymconnect.openaiservice.dto.WorkoutDayDto;
import com.gymconnect.openaiservice.service.DataTransformationService;
import com.gymconnect.openaiservice.service.OpenAiService;
import com.gymconnect.openaiservice.model.UserData;
import com.gymconnect.openaiservice.response.WorkoutDayResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/generate-workout")
@RequiredArgsConstructor
public class ExercisePlanController {

    private final OpenAiService openAiService;
    private final DataTransformationService dataTransformationService;
    private final ObjectMapper objectMapper = new ObjectMapper();


    @PostMapping
    public ResponseEntity<?> generateExercisePlan(@RequestBody UserData userData) {
        try {
            // Generate the prompt
            String prompt = generatePrompt(userData);

            // Call the OpenAiService to get the completion
            String result = openAiService.getCompletion(prompt);

            List<WorkoutDayDto> workoutDays = parseResponse(result);

            List<WorkoutDayResponse> response = dataTransformationService.transformExercises(workoutDays);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String generatePrompt(UserData userData) {
        return String.format(
                """
                        Based on the user data below, generate an exercise plan of %s days.
                        User data:
                        %s

                        Sample output JSON:
                        [{"day": "Monday","exercises": [{"exercise": "...", "sets": "...", "reps": "...", "weight": "...","rest": "..."}]}]

                        "exercise in JSON is a string with exercise name in lowercase and in singular form\
                        "reps" in JSON is a string with number of reps
                        "rest" in JSON is the rest to be taken between sets as a number, it should be considered in seconds
                        "weight" in JSON is the weight to be used for exercise as a number, it should be considered in kgs, else make it "---"

                        "The exercise must be specific. For example, instead of deadlifts, be specific like dumbbell deadlift or barbell romanian deadlift etc.\
                        Don't consider rest days as a workout day. For example, if the number of days per week is 5. Create 5 workout days and consider the other 2 days of the week as rest days

                        For rest days return only one javascript object in exercises array with exercise field as "Rest Day" and remaining fields as "---"

                        Answer:
                        """,
                userData.getNumberOfDaysPerWeek(),
                userData
        );
    }

    private List<WorkoutDayDto> parseResponse(String response) {
        try {
            return objectMapper.readValue(response, new TypeReference<>() {
            });
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse response", e);
        }
    }
}
