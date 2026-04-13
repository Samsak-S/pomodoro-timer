package com.example.pomodoro.mockUsers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.pomodoro.User;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/pomodoro/mock")
public class MockAuthControllers {
    @Autowired
    private UserRepository repository;

    @PostMapping("/auth/login")        
    public ResponseEntity<?> mockLogin(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");

        User user = repository.findByUsername("Alice").orElseThrow(() -> new RuntimeException("Invalid username"));
        if(username.equals(user.getUsername()) && password.equals(user.getPassword())) {
            Map<String, String> response = new HashMap<>();
            response.put("token", "m0ck-t0k3n-xyz-789");
            return ResponseEntity.ok(response);
        }
        else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Credentials");
        }
    }
}
