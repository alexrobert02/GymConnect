package com.gymconnect.authserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AuthServerApplication {

//	@Autowired
//	private EmailService emailService;

	public static void main(String[] args) {
		SpringApplication.run(AuthServerApplication.class, args);
	}

//	@EventListener(ApplicationReadyEvent.class)
//	public void sendMail(){
//		emailService.sendEmail("alex_robert02@yahoo.com",
//				"This is the subject",
//				"This is the Body of Email");
//	}

//	@Bean
//	public CommandLineRunner commandLineRunner(
//		AuthenticationService service
//	) {
//		return args -> {
//			var admin = RegisterRequest.builder()
//				.firstName("Admin")
//				.lastName("Admin")
//				.email("admin@mail.com")
//				.password("password")
//				.role(ADMIN)
//				.build();
//			var user = RegisterRequest.builder()
//				.firstName("Alex")
//				.lastName("Zaharia")
//				.email("alex@gmail.com")
//				.password("1234")
//				.role(USER)
//				.build();
//			service.register(user);
//			System.out.println("Admin token: " + service.register(admin).getAccessToken());
//		};
//	}
}
