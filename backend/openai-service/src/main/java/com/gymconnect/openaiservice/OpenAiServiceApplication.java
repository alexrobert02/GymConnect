package com.gymconnect.openaiservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients
@SpringBootApplication
public class OpenAiServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(OpenAiServiceApplication.class, args);
	}

}
