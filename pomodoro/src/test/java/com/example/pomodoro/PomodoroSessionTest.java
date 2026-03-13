package com.example.pomodoro;

import org.junit.jupiter.api.Test;

import com.example.pomodoro.model.*;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;


public class PomodoroSessionTest {

    @Test
    void shouldStartAsActive() {
        PomodoroSession session = new PomodoroSession(LocalDateTime.now(), SessionType.FOCUS, 25);
        assertEquals(session.getState(), SessionState.ACTIVE);
    }

    @Test
    void shouldThrowExceptionWhenPausingInactiveSession() {
        PomodoroSession session = new PomodoroSession(LocalDateTime.now(), SessionType.FOCUS, 25);
        session.complete(); // Now it's COMPLETED
        
        assertThrows(IllegalStateException.class, session::pause);
    }

    @Test
    void shouldCalculatePauseDurationCorrectly() throws InterruptedException {
        PomodoroSession session = new PomodoroSession(LocalDateTime.now(), SessionType.FOCUS, 25);
        
        session.pause();
        Thread.sleep(100); // Simulate a short pause
        session.resume();
        
        assertTrue(session.getTotalPauseDuration() >= 100, "Paused session was not correctly initialized");
        assertEquals(SessionState.ACTIVE, session.getState());
    }    


}