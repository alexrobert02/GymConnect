package com.gymconnect.authserver.openai;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/exercise-plan")
@RequiredArgsConstructor
public class ExercisePlanController {

    private final OpenAiService openAiService;

    @PostMapping
    public ResponseEntity<?> generateExercisePlan(@RequestBody UserData userData) {
        try {
            // Generate the prompt
            String prompt = generatePrompt(userData);

            // Call the OpenAiService to get the completion
            String result = openAiService.getCompletion(prompt);

            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String generatePrompt(UserData userData) {
        return String.format(
                "Based on the user data below, generate an exercise plan of %s days.\n" +
                        "User data:\n%s\n\n" +
                        "Sample output JSON:\n" +
                        "[{\"day\": \"Monday\",\"exercises\": [{\"exercise\": \"...\", \"sets\": \"...\", \"reps\": \"...\", \"weight\": \"...\",\"rest\": \"...\"}]}]\n\n" +
                        "\"exercise in JSON is a string with exercise name in lowercase and in singular form" +
                        "\"reps\" in JSON is a string with number of reps\n" +
                        "\"rest\" in JSON is the rest to be taken between sets\n" +
                        "\"weight\" in JSON is the weight to be used for exercise as a number, it should be considered in kgs, else make it \"---\"\n\n" +
                        "\"The exercise must be specific. For example, instead of deadlifts, be specific like dumbbell deadlift or barbell romanian deadlift etc." +
                        "Don't consider rest days as a workout day. For example, if the number of days per week is 5. Create 5 workout days and consider the other 2 days of the week as rest days\n\n" +
                        "For rest days return only one javascript object in exercises array with exercise field as \"Rest Day\" and remaining fields as \"---\"\n\n" +
                        "Answer:\n",
                userData.getNumberOfDaysPerWeek(),
                userData.toString()
        );
    }
}