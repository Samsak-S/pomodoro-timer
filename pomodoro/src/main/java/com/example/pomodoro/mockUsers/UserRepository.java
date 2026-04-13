package com.example.pomodoro.mockUsers;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.pomodoro.*;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>{
    public Optional<User> findByUsername(String username);
}
