package com.gymconnect.openaiservice.openai;


import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

@Service
public class OpenAiService {
    private static final Dotenv dotenv = Dotenv.load();
    private static final String apiKey = dotenv.get("OPENAI_API_KEY");
    private static final String OPEN_AI_CHAT_COMPLETION_MODEL = "gpt-3.5-turbo";
    private static final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

    public String getCompletion(String prompt) {
        RestTemplate restTemplate = new RestTemplate();
        ObjectMapper mapper = new ObjectMapper();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Create the request payload
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", OPEN_AI_CHAT_COMPLETION_MODEL);
        requestBody.put("messages", new Object[]{
                Map.of("role", "user", "content", prompt)
        });
        requestBody.put("max_tokens", 2000);
        requestBody.put("temperature", 0.7);

        try {
            String jsonRequestBody = mapper.writeValueAsString(requestBody);
            HttpEntity<String> entity = new HttpEntity<>(jsonRequestBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(OPENAI_API_URL, HttpMethod.POST, entity, String.class);

            JsonNode root = mapper.readTree(response.getBody());
            return root.get("choices").get(0).get("message").get("content").asText();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
