package com.gymconnect.workoutservice.client;

import com.gymconnect.workoutservice.dto.ExerciseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "exercise-service", url = "${application.config.exercises-url}")
public interface ExerciseClient {

    @GetMapping("/{id}")
    ExerciseDto findExerciseById(@PathVariable("id") String id);

}
