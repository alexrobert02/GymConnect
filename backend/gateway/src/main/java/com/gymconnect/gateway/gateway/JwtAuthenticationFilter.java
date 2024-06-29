//package com.gymconnect.gateway.gateway;
//
//import com.gymconnect.gateway.client.TokenClient;
//import lombok.RequiredArgsConstructor;
//import org.springframework.lang.NonNull;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
//import org.springframework.stereotype.Component;
//import org.springframework.stereotype.Service;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//
//import java.io.IOException;
//import java.util.Set;
//
//@Component
//@RequiredArgsConstructor
//public class JwtAuthenticationFilter extends OncePerRequestFilter {
//
//    private final UserDetailsService userDetailsService;
//    private final TokenClient client;
//    private final JwtService jwtService;
//
//    private static final Set<String> PUBLIC_ENDPOINTS = Set.of(
//            "/api/v1/auth/authenticate",
//            "/api/v1/auth/register",
//            "/api/v1/auth/forgot-password",
//            "/api/v1/users/check-email/**",
//            "/api/v1/users/reset-password/**",
//            "/api/v1/auth/logout",
//            "/api/v1/auth/token/**"
//    );
//
//    @Override
//    protected void doFilterInternal(
//            @NonNull HttpServletRequest request,
//            @NonNull HttpServletResponse response,
//            @NonNull FilterChain filterChain
//    ) throws ServletException, IOException {
//        String path = request.getRequestURI();
//        System.out.println("Request Path: " + path);
//
//        // Allow public endpoints without JWT validation
//        if (isPublicEndpoint(path)) {
//            System.out.println("Public endpoint, no JWT validation required");
//            filterChain.doFilter(request, response);
//            return;
//        }
//
//        final String authHeader = request.getHeader("Authorization");
//        System.out.println("Authorization Header: " + authHeader);
//
//        final String jwt;
//        final String userEmail;
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            System.out.println("Missing or invalid Authorization header");
//            filterChain.doFilter(request, response);
//            return;
//        }
//
//        jwt = authHeader.substring(7);
//        userEmail = jwtService.extractUsername(jwt);
//
//        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
//            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
//            var isTokenValid = client.validateToken(jwt);
//
//            if (jwtService.isTokenValid(jwt, userDetails) && isTokenValid) {
//                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
//                        userDetails,
//                        null,
//                        userDetails.getAuthorities()
//                );
//                authToken.setDetails(
//                        new WebAuthenticationDetailsSource().buildDetails(request)
//                );
//                SecurityContextHolder.getContext().setAuthentication(authToken);
//            }
//        }
//        filterChain.doFilter(request, response);
//    }
//
//    private boolean isPublicEndpoint(String path) {
//        return PUBLIC_ENDPOINTS.stream().anyMatch(path::startsWith);
//    }
//
//}
