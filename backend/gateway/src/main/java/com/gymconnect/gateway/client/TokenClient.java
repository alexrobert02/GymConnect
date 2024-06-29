//package com.gymconnect.gateway.client;
//
//import org.springframework.cloud.openfeign.FeignClient;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//
//@FeignClient(name = "auth-service", url = "${application.config.auth-url}")
//public interface TokenClient {
//
//    @GetMapping("/validate_token/{token}")
//    boolean validateToken(@PathVariable("token") String token);
//}
