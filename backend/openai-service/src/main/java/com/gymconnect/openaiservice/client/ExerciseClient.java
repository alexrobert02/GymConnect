package com.gymconnect.openaiservice.client;

import com.gymconnect.openaiservice.openai.ExerciseResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "exercise-service", url = "${application.config.exercises-url}")
public interface ExerciseClient {

    @GetMapping("/name/{name}")
    List<ExerciseResponse> findExerciseByName(@PathVariable("name") String name,
                                              @RequestParam(value = "limit", defaultValue = "10") Integer limit);

}

