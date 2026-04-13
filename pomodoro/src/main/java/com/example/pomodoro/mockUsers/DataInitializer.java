package com.example.pomodoro.mockUsers;

import com.example.pomodoro.User;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.CommandLineRunner;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner initDatabase(UserRepository repository) {
        return args-> {
            if(repository.count() == 0) {
                repository.save(new User("Alice", "alice@example.com", "password123"));
            }
        };
    }
    
}
