package com.example.pomodoro;

import java.time.LocalDateTime;
import com.example.pomodoro.model.*;

public record PomodoroSessionDto (
    long id,
    long userId,
    LocalDateTime startTime,
    LocalDateTime endTime,
    SessionType type,
    SessionState state,
    long totalPauseDuration,
    LocalDateTime pauseTime,
    int sessionTime,
    int streak
) {}
