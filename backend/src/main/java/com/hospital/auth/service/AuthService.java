package com.hospital.auth.service;

import com.hospital.auth.dto.*;
import com.hospital.config.JwtUtil;
import com.hospital.shared.document.UserDocument;
import com.hospital.shared.repository.UserRepository;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest request) {
        UserDocument user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!user.isActive()) {
            throw new IllegalStateException("User account is disabled");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getRole().toString());
        Claims claims = jwtUtil.extractClaims(token);

        UserDto userDto = UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .iat(claims.getIssuedAt().getTime() / 1000)
                .exp(claims.getExpiration().getTime() / 1000)
                .build();

        return LoginResponse.builder()
                .token(token)
                .user(userDto)
                .build();
    }

    public LoginResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        if (request.getRole() == null) {
            request.setRole(UserDocument.UserRole.RECEPTIONIST);
        }

        LocalDateTime now = LocalDateTime.now();
        UserDocument user = UserDocument.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .createdAt(now)
                .updatedAt(now)
                .active(true)
                .build();

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getRole().toString());
        Claims claims = jwtUtil.extractClaims(token);

        UserDto userDto = UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .iat(claims.getIssuedAt().getTime() / 1000)
                .exp(claims.getExpiration().getTime() / 1000)
                .build();

        return LoginResponse.builder()
                .token(token)
                .user(userDto)
                .build();
    }
}
