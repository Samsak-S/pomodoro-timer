package com.example.pomodoro;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.pomodoro.model.SessionState;

import java.util.*;

public interface PomodoroRepository extends JpaRepository<PomodoroSession, Long>{
    Optional<PomodoroSession> findFirstByUserAndStateIn(User user, List<SessionState> states);    
    Optional<PomodoroSession> findFirstByUserAndStateInOrderByIdDesc(User user, List<SessionState> states);
}
