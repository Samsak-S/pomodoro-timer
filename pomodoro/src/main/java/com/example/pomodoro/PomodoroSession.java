package com.example.pomodoro;

import model.SessionType;
import model.SessionState;

import java.time.Duration;
import java.time.LocalDateTime;

public class PomodoroSession {
    private final LocalDateTime startTime;
    private final SessionType type;
    private LocalDateTime endTime;
    private SessionState state;
    private LocalDateTime pauseTime;
    private Duration totalPauseDuration = Duration.ZERO;

    public PomodoroSession(LocalDateTime startTime, SessionType type) {
        this.startTime = startTime;
        this.type = type;
        this.state = SessionState.ACTIVE;
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


    public void pause() {
        if(state != SessionState.ACTIVE)
            throw new IllegalStateException("There is no active session");

        state = SessionState.PAUSED;
        pauseTime = LocalDateTime.now();
    }

    public void resume() {
        if(state != SessionState.PAUSED)
            throw new IllegalStateException("There is no paused session");

        Duration interval = Duration.between(pauseTime, LocalDateTime.now());
        totalPauseDuration = totalPauseDuration.plus(interval);
        pauseTime = null;

        state = SessionState.RESUMED;
    }

    public void cancel() {
        if(state != SessionState.ACTIVE && state != SessionState.PAUSED)
            throw new IllegalStateException("There is no active session");

        if(state == SessionState.PAUSED && pauseTime != null) {
            Duration interval = Duration.between(pauseTime, LocalDateTime.now());
            totalPauseDuration = totalPauseDuration.plus(interval);
            pauseTime = null;
        }
        endTime = LocalDateTime.now();
        state = SessionState.CANCELLED;
    }

    public void stop() {
        if(state != SessionState.ACTIVE)
            throw new IllegalStateException("There is no active session");

        if(state == SessionState.PAUSED && pauseTime != null) {
            Duration interval = Duration.between(pauseTime, LocalDateTime.now());
            totalPauseDuration = totalPauseDuration.plus(interval);
            pauseTime = null;
        }

        endTime = LocalDateTime.now();
        state = SessionState.COMPLETED;
    }

    @Override
    public String toString() {
        return "PomodoroSession{" + "startTime=" +  startTime + ", endTime=" + endTime + 
                ", state=" + state + ", type=" + type + ", pausedTime=" + pauseTime + ", totalPauseDuration=" + totalPauseDuration + "}";
    }
}
