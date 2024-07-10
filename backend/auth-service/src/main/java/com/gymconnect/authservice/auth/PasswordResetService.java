package com.gymconnect.authservice.auth;

import com.gymconnect.authservice.config.JwtService;
import com.gymconnect.authservice.token.Token;
import com.gymconnect.authservice.token.TokenRepository;
import com.gymconnect.authservice.token.TokenType;
import com.gymconnect.authservice.user.User;
import com.gymconnect.authservice.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PasswordResetService {
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final EmailService emailService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public void sendPasswordResetEmail(String email) {

        var user = userRepository.findByEmail(email)
                .orElseThrow();
        var jwtToken = jwtService.generatePasswordResetToken(user);
        revokeAllUserPasswordResetTokens(user);
        saveUserPasswordResetToken(user, jwtToken);

        String resetLink = "http://localhost:3000/reset-password/" + jwtToken;
        String emailMessage = String.format("""
                You are receiving this because you (or someone else) have requested the reset of the password for your account.

                Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:

                %s

                If you did not request this, please ignore this email and your password will remain unchanged.""", resetLink);

        emailService.sendEmail(email, "Password Reset Request", emailMessage);
    }

    private void saveUserPasswordResetToken(User savedUser, String jwtToken) {
        var token = Token.builder()
                .user(savedUser)
                .token(jwtToken)
                .tokenType(TokenType.RESET_PASSWORD)
                .revoked(false)
                .expired(false)
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllUserPasswordResetTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidPasswordResetTokensByUser(user.getId());
        if (validUserTokens.isEmpty()) {
            return;
        }
        validUserTokens.forEach(t -> {
            t.setExpired(true);
            t.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    public void resetPassword(String token, String newPassword) {
        Token resetToken = tokenRepository.findByToken(token).orElseThrow(() -> new RuntimeException("Invalid token"));
        if (resetToken.isExpired() || resetToken.isRevoked()) {
            throw new RuntimeException("Token is not valid");
        }
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setExpired(true);
        tokenRepository.save(resetToken);
    }
}
