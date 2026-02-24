package com.example.pomodoro;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;
import model.SessionState;

public interface PomodoroRepository extends JpaRepository<PomodoroSession, Long>{
    Optional<PomodoroSession> findFirstByStateIn(List<SessionState> state);    
}
