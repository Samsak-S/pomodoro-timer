package com.example.pomodoro;

import model.SessionType;

import java.time.LocalDateTime;

public class PomodoroSession {
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private SessionType type;

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public SessionType getType() {
        return type;
    }

    public void setType(SessionType type) {
        this.type = type;
    }
}
