package com.gymconnect.authserver.exercises;

import io.github.cdimascio.dotenv.Dotenv;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Collections;
import java.util.List;

@Service
@Slf4j
public class ExercisesService {

    private static final String url = "https://exercisedb.p.rapidapi.com/exercises";
    private final String xRapidApiKey;
    private static final String xRapidApiHost = "exercisedb.p.rapidapi.com";
    private final RestTemplate restTemplate;

    public ExercisesService(RestTemplate restTemplate, Dotenv dotenv) {
        this.restTemplate = restTemplate;
        xRapidApiKey = dotenv.get("RAPID_API_KEY");
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

    public List<ExerciseDTO> getExerciseByName(String name, String limit) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-RapidAPI-Key", xRapidApiKey);
            headers.set("X-RapidAPI-Host", xRapidApiHost);
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<?> requestEntity = new HttpEntity<>(headers);

            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url + "/name/{name}")
                    .queryParam("limit", limit);

            ResponseEntity<List<ExerciseDTO>> response = restTemplate.exchange(
                    builder.buildAndExpand(name).toUriString(),
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

    public List<ExerciseDTO> getRandomExercisesByTarget(String target, String limit) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-RapidAPI-Key", xRapidApiKey);
            headers.set("X-RapidAPI-Host", xRapidApiHost);
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<?> requestEntity = new HttpEntity<>(headers);

            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url + "/target/{target}")
                    .queryParam("limit", 1500);

            ResponseEntity<List<ExerciseDTO>> response = restTemplate.exchange(
                    builder.buildAndExpand(target).toUriString(),
                    HttpMethod.GET,
                    requestEntity,
                    new ParameterizedTypeReference<>() {
                    },
                    target
            );

            List<ExerciseDTO> exercises = response.getBody();
            if (exercises != null && !exercises.isEmpty()) {
                Collections.shuffle(exercises);

                return exercises.subList(0, Math.min(Integer.parseInt(limit), exercises.size()));
            }

            return Collections.emptyList();

        } catch (Exception e) {
            log.error("Something went wrong while getting value from RapidAPI", e);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Exception while calling endpoint of RapidAPI for exercise-db",
                    e
            );
        }
    }

    public List<ExerciseDTO> getRandomExercisesByEquipment(String type, String limit) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-RapidAPI-Key", xRapidApiKey);
            headers.set("X-RapidAPI-Host", xRapidApiHost);
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<?> requestEntity = new HttpEntity<>(headers);

            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url + "/equipment/{type}")
                    .queryParam("limit", 1500);

            ResponseEntity<List<ExerciseDTO>> response = restTemplate.exchange(
                    builder.buildAndExpand(type).toUriString(),
                    HttpMethod.GET,
                    requestEntity,
                    new ParameterizedTypeReference<>() {
                    },
                    type
            );

            List<ExerciseDTO> exercises = response.getBody();
            if (exercises != null && !exercises.isEmpty()) {
                Collections.shuffle(exercises);

                return exercises.subList(0, Math.min(Integer.parseInt(limit), exercises.size()));
            }

            return Collections.emptyList();

        } catch (Exception e) {
            log.error("Something went wrong while getting value from RapidAPI", e);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Exception while calling endpoint of RapidAPI for exercise-db",
                    e
            );
        }
    }

    public ExerciseDTO getExerciseById(String id) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-RapidAPI-Key", xRapidApiKey);
            headers.set("X-RapidAPI-Host", xRapidApiHost);
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<?> requestEntity = new HttpEntity<>(headers);

            ResponseEntity<ExerciseDTO> response = restTemplate.exchange(
                    url + "/exercise/{id}",
                    HttpMethod.GET,
                    requestEntity,
                    new ParameterizedTypeReference<>() {
                    },
                    id
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
