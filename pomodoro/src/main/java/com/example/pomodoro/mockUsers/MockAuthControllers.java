package com.example.pomodoro.mockUsers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/pomodoro/mock")
public class MockAuthControllers {
    private final UserRepository repository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    public MockAuthControllers(UserRepository repository) {
        this.repository = repository;
    }
    @PostMapping("/auth/login")        
    public ResponseEntity<?> mockLogin(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");

        return repository.findByUsername(username).map(user -> {
            if(passwordEncoder.matches(password, user.getPassword())) {
                Map<String, String> response = new HashMap<>();
                response.put("token", jwtUtils.generateToken(username));
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid password"));
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not found")));
    }
}
