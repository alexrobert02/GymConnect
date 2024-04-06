package com.gymconnect.authserver.exercises;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Slf4j
public class ExercisesService {

    private static final String url = "https://exercisedb.p.rapidapi.com/exercises";
    private static final String xRapidApiKey = "13bd31c4e7msh37b38bf58fde695p14e818jsn92c51b03dfba";
    private static final String xRapidApiHost = "exercisedb.p.rapidapi.com";

    private final RestTemplate restTemplate;

    public ExercisesService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<ExerciseDTO> getAllExercises() {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-RapidAPI-Key", xRapidApiKey);
            headers.set("X-RapidAPI-Host", xRapidApiHost);
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<?> requestEntity = new HttpEntity<>(headers);

            ResponseEntity<List<ExerciseDTO>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    requestEntity,
                    new ParameterizedTypeReference<>() {
                    }
            );
            return response.getBody();

        } catch (Exception e) {
            log.error("Something went wrong while getting value from RapidAPI", e);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Exception while calling endpoint of RapidAPI for exercise-db",
                    e
            );
        }
    }

    public List<ExerciseDTO> getExerciseByName(String name) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-RapidAPI-Key", xRapidApiKey);
            headers.set("X-RapidAPI-Host", xRapidApiHost);
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<?> requestEntity = new HttpEntity<>(headers);

            ResponseEntity<List<ExerciseDTO>> response = restTemplate.exchange(
                    url + "/name/{name}",
                    HttpMethod.GET,
                    requestEntity,
                    new ParameterizedTypeReference<>() {
                    },
                    name
            );
            return response.getBody();

        } catch (Exception e) {
            log.error("Something went wrong while getting value from RapidAPI", e);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Exception while calling endpoint of RapidAPI for exercise-db",
                    e
            );
        }
    }
}
