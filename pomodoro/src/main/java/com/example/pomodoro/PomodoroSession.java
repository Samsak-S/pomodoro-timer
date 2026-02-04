package com.example.pomodoro;

import model.SessionType;
import model.SessionState;

import java.time.LocalDateTime;

public class PomodoroSession {
    private final LocalDateTime startTime;
    private final SessionType type;
    private LocalDateTime endTime;
    private SessionState state;

    public PomodoroSession(LocalDateTime startTime, SessionType type) {
        this.startTime = startTime;
        this.type = type;
        this.state = SessionState.NEW;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public SessionType getType() {
        return type;
    }


    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }


    public void setState(SessionState state) {
        this.state = state;
    }

    public SessionState getSessionStatus() {
        return state;
    }

    @Override
    public String toString() {
        return "PomodoroSession{" + "startTime=" +  startTime + ", endTime=" + endTime + 
                ", state=" + state + ", type=" + type + "}";
    }
}
