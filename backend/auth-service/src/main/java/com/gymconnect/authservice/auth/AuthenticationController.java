package com.gymconnect.authservice.auth;

import com.gymconnect.authservice.config.LogoutService;
import com.gymconnect.authservice.token.TokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.token.TokenService;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

//@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;
    private final PasswordResetService passwordResetService;
    private final LogoutService logoutService;
    private final TokenRepository tokenRepository;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register (
            @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate (
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @PostMapping("/refresh-token")
    public void refreshToken (
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        service.refreshToken(request, response);
    }

    @PostMapping("/request-password-reset/{email}")
    public void requestPasswordReset(@PathVariable String email) {
        passwordResetService.sendPasswordResetEmail(email);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        logoutService.logout(request, response, authentication);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/validate_token/{token}")
    public ResponseEntity<Boolean> validateToken(@PathVariable String token) {
        var isTokenValid = tokenRepository.findByToken(token)
                .map(t -> !t.isExpired() && !t.isRevoked())
                .orElse(false);
        if (isTokenValid) {
            return ResponseEntity.ok(true);
        }
        return ResponseEntity.ok(false);
    }
}
