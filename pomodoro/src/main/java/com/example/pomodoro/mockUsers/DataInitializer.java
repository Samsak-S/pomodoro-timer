package com.example.pomodoro.mockUsers;

import com.example.pomodoro.User;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.boot.CommandLineRunner;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner initDatabase(UserRepository repository, PasswordEncoder passwordEncoder) {
        return args-> {
            if(repository.count() == 0) {
                String encrytedPassword = passwordEncoder.encode("password123");
                repository.save(new User("Alice", "alice@example.com", encrytedPassword));
            }
        };
    }
    
}