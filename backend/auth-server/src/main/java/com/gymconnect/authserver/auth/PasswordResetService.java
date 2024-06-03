package com.gymconnect.authserver.auth;

import com.gymconnect.authserver.config.JwtService;
import com.gymconnect.authserver.token.Token;
import com.gymconnect.authserver.token.TokenRepository;
import com.gymconnect.authserver.token.TokenType;
import com.gymconnect.authserver.user.User;
import com.gymconnect.authserver.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

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
        emailService.sendEmail(email, "Password Reset Request", "Click the link to reset your password: " + resetLink);
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
        System.out.println(validUserTokens);
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
