package com.example.pomodoro;

import jakarta.persistence.*;
import model.SessionType;
import model.SessionState;

import java.time.Duration;
import java.time.LocalDateTime;

@Entity
@Table(name = "sessions")
public class PomodoroSession {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    
    @Enumerated(EnumType.STRING)
    private SessionType type;
    @Enumerated(EnumType.STRING)
    private SessionState state;

    private LocalDateTime pauseTime;
    @Column(name = "total_pause_duration")
    private Duration totalPauseDuration;

    protected PomodoroSession() {}

    public PomodoroSession(LocalDateTime startTime, SessionType type) {
        this.startTime = startTime;
        this.type = type;
        this.state = SessionState.ACTIVE;
        this.totalPauseDuration = Duration.ZERO;
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

    public long getId() {
        return id;
    }

    public void pause() {
        if(state != SessionState.ACTIVE)
            throw new IllegalStateException("There is no active session");

        state = SessionState.PAUSED;
        pauseTime = LocalDateTime.now();
    }

    public void resume() {
        if(state != SessionState.PAUSED || pauseTime != null)
            throw new IllegalStateException("Paused session was not correctly initialized");

        Duration interval = Duration.between(pauseTime, LocalDateTime.now());
        totalPauseDuration = totalPauseDuration.plus(interval);
        pauseTime = null;

        state = SessionState.ACTIVE;
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

    public void complete() {
        if(state != SessionState.ACTIVE)
            throw new IllegalStateException("There is no active session");

        endTime = LocalDateTime.now();
        state = SessionState.COMPLETED;
    }

    @Override
    public String toString() {
        return "PomodoroSession{" + "startTime=" +  startTime + ", endTime=" + endTime + 
                ", state=" + state + ", type=" + type + ", pausedTime=" + pauseTime + ", totalPauseDuration=" + totalPauseDuration + "}";
    }
}
