package com.example.pomodoro;

import model.*;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;


public class PomodoroSessionTest {

    @Test
    void shouldStartAsActive() {
        PomodoroSession session = new PomodoroSession(LocalDateTime.now(), SessionType.FOCUS);
        assertEquals(session.getSessionStatus(), SessionState.ACTIVE);
    }

    @Test
    void shouldThrowExceptionWhenPausingInactiveSession() {
        PomodoroSession session = new PomodoroSession(LocalDateTime.now(), SessionType.FOCUS);
        session.complete(); // Now it's COMPLETED
        
        assertThrows(IllegalStateException.class, session::pause);
    }

    @Test
    void shouldCalculatePauseDurationCorrectly() throws InterruptedException {
        PomodoroSession session = new PomodoroSession(LocalDateTime.now(), SessionType.FOCUS);
        
        session.pause();
        Thread.sleep(100); // Simulate a short pause
        session.resume();
        
        assertTrue(session.getTotalPauseDuration().toMillis() >= 100, 
            "Pause duration should be at least 100ms");
        assertEquals(SessionState.ACTIVE, session.getSessionStatus());
    }    


}