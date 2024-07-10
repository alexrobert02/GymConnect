package com.gymconnect.exerciseservice.service;

import com.gymconnect.exerciseservice.dto.ExerciseDto;
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

@SuppressWarnings("UastIncorrectHttpHeaderInspection")
@Service
@Slf4j
public class ExerciseService {
    private static final Dotenv dotenv = Dotenv.load();
    private static final String url = "https://exercisedb.p.rapidapi.com/exercises";
    private static final String xRapidApiKey = dotenv.get("RAPID_API_KEY");
    private static final String xRapidApiHost = "exercisedb.p.rapidapi.com";
    private final RestTemplate restTemplate;

    public ExerciseService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<ExerciseDto> getAllExercises() {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-RapidAPI-Key", xRapidApiKey);
            headers.set("X-RapidAPI-Host", xRapidApiHost);
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<?> requestEntity = new HttpEntity<>(headers);

            ResponseEntity<List<ExerciseDto>> response = restTemplate.exchange(
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

    public List<ExerciseDto> getExerciseByName(String name, String limit) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-RapidAPI-Key", xRapidApiKey);
            headers.set("X-RapidAPI-Host", xRapidApiHost);
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<?> requestEntity = new HttpEntity<>(headers);

            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url + "/name/{name}")
                    .queryParam("limit", limit);

            ResponseEntity<List<ExerciseDto>> response = restTemplate.exchange(
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

    public List<ExerciseDto> getRandomExercisesByTarget(String target, String limit) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-RapidAPI-Key", xRapidApiKey);
            headers.set("X-RapidAPI-Host", xRapidApiHost);
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<?> requestEntity = new HttpEntity<>(headers);

            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url + "/target/{target}")
                    .queryParam("limit", 1500);

            return getRandomExercises(target, limit, requestEntity, builder);

        } catch (Exception e) {
            log.error("Something went wrong while getting value from RapidAPI", e);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Exception while calling endpoint of RapidAPI for exercise-db",
                    e
            );
        }
    }

    public List<ExerciseDto> getRandomExercises(String target, String limit, HttpEntity<?> requestEntity, UriComponentsBuilder builder) {
        ResponseEntity<List<ExerciseDto>> response = restTemplate.exchange(
                builder.buildAndExpand(target).toUriString(),
                HttpMethod.GET,
                requestEntity,
                new ParameterizedTypeReference<>() {
                },
                target
        );

        List<ExerciseDto> exercises = response.getBody();
        if (exercises != null && !exercises.isEmpty()) {
            Collections.shuffle(exercises);

            return exercises.subList(0, Math.min(Integer.parseInt(limit), exercises.size()));
        }

        return Collections.emptyList();
    }

    public List<ExerciseDto> getRandomExercisesByEquipment(String type, String limit) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-RapidAPI-Key", xRapidApiKey);
            headers.set("X-RapidAPI-Host", xRapidApiHost);
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<?> requestEntity = new HttpEntity<>(headers);

            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url + "/equipment/{type}")
                    .queryParam("limit", 1500);

            return getRandomExercises(type, limit, requestEntity, builder);

        } catch (Exception e) {
            log.error("Something went wrong while getting value from RapidAPI", e);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Exception while calling endpoint of RapidAPI for exercise-db",
                    e
            );
        }
    }

    public ExerciseDto getExerciseById(String id) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-RapidAPI-Key", xRapidApiKey);
            headers.set("X-RapidAPI-Host", xRapidApiHost);
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<?> requestEntity = new HttpEntity<>(headers);

            ResponseEntity<ExerciseDto> response = restTemplate.exchange(
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

    public List<String> getBodyPartList() {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-RapidAPI-Key", xRapidApiKey);
            headers.set("X-RapidAPI-Host", xRapidApiHost);
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<?> requestEntity = new HttpEntity<>(headers);

            ResponseEntity<List<String>> response = restTemplate.exchange(
                    url + "/bodyPartList",
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

    public List<ExerciseDto> getExercisesByBodyPart(String bodyPart, String limit) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-RapidAPI-Key", xRapidApiKey);
            headers.set("X-RapidAPI-Host", xRapidApiHost);
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<?> requestEntity = new HttpEntity<>(headers);

            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url + "/bodyPart/{bodyPart}")
                    .queryParam("limit", limit);

            ResponseEntity<List<ExerciseDto>> response = restTemplate.exchange(
                    builder.buildAndExpand(bodyPart).toUriString(),
                    HttpMethod.GET,
                    requestEntity,
                    new ParameterizedTypeReference<>() {
                    },
                    bodyPart
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
