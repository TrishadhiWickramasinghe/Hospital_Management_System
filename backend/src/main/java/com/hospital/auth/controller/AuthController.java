package com.hospital.auth.controller;

import com.hospital.auth.dto.LoginRequest;
import com.hospital.auth.dto.LoginResponse;
import com.hospital.auth.dto.RegisterRequest;
import com.hospital.auth.service.AuthService;
import com.hospital.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
        public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(ApiResponse.<LoginResponse>builder()
                    .success(true)
                    .data(response)
                    .statusCode(200)
                    .timestamp(System.currentTimeMillis())
                    .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.<LoginResponse>builder()
                            .success(false)
                            .error(e.getMessage())
                            .statusCode(401)
                            .timestamp(System.currentTimeMillis())
                            .build());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<LoginResponse>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            LoginResponse response = authService.register(request);
            return ResponseEntity.status(201)
                    .body(ApiResponse.<LoginResponse>builder()
                            .success(true)
                            .data(response)
                            .statusCode(201)
                            .timestamp(System.currentTimeMillis())
                            .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400)
                    .body(ApiResponse.<LoginResponse>builder()
                            .success(false)
                            .error(e.getMessage())
                            .statusCode(400)
                            .timestamp(System.currentTimeMillis())
                            .build());
        }
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> health() {
        return ResponseEntity.status(200)
                .body(ApiResponse.<String>builder()
                        .success(true)
                        .data("Backend is running")
                        .statusCode(200)
                        .timestamp(System.currentTimeMillis())
                        .build());
    }
}
