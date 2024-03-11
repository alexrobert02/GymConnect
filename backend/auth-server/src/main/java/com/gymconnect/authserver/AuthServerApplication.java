package com.gymconnect.authserver;

import com.gymconnect.authserver.auth.AuthenticationService;
import com.gymconnect.authserver.auth.RegisterRequest;
import com.gymconnect.authserver.user.Role;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import static com.gymconnect.authserver.user.Role.ADMIN;

@SpringBootApplication
public class AuthServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthServerApplication.class, args);
	}

	@Bean
	public CommandLineRunner commandLineRunner(
		AuthenticationService service
	) {
		return args -> {
			var admin = RegisterRequest.builder()
				.firstName("Admin")
					.lastName("Admin")
					.email("admin@mail.com")
					.password("password")
					.role(ADMIN)
				.build();
			System.out.println("Admin token: " + service.register(admin).getAccessToken());
		};
	}
}
