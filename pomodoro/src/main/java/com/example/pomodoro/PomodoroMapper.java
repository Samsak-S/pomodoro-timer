package com.example.pomodoro;

import org.springframework.stereotype.Component;

@Component
public class PomodoroMapper {
    public PomodoroSessionDto toDto(PomodoroSession session) {
        return new PomodoroSessionDto( 
            session.getId(),
            session.getUser().getId(),
            session.getStartTime(),
            session.getEndTime(),
            session.getType(),
            session.getState(),
            session.getTotalPauseDuration(),
            session.getSessionTime(),
            session.getStreak()
        );
    }
}
