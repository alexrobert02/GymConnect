package com.gymconnect.authserver.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("alex_robert02@yahoo.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        // Send the email
        mailSender.send(message);

        System.out.println("Email sent.");
        System.out.println(message);
    }
}
