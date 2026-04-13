package com.example.pomodoro;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.pomodoro.model.SessionType;

import exception.SessionConflictException;

@ExtendWith(MockitoExtension.class)
public class PomodoroServiceTest {

    @Mock
    private PomodoroRepository repository;

    @InjectMocks
    private PomodoroService service;

    @Test
    public void startSessionIsSuccessful() {
        when(repository.findFirstByUserAndStateIn(any(), any())).thenReturn(Optional.empty());
        when(repository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        PomodoroSessionDto result = service.startSession(null, SessionType.BREAK, 25, 1);

        assertNotNull(result);
        verify(repository, times(1)).save(any());
    }

    @Test
    public void startSessionFails() {
        PomodoroSession session = new PomodoroSession(null, null, SessionType.FOCUS, 25, 1);
        when(repository.findFirstByUserAndStateIn(any(), any())).thenReturn(Optional.of(session));
        
        assertThrows(SessionConflictException.class, () -> {
            service.startSession(null, SessionType.FOCUS, 25, 1);
        });
    }
    
}
