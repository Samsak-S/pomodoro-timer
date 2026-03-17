package com.example.pomodoro;

import jakarta.persistence.*;

import java.time.Duration;
import java.time.LocalDateTime;

import com.example.pomodoro.model.SessionState;
import com.example.pomodoro.model.SessionType;

@Entity
@Table(name = "sessions")
public class PomodoroSession {
    @Id
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
    private int totalPauseDuration;
    private int sessionTime;
    private int streak;

    protected PomodoroSession() {}

    public PomodoroSession(LocalDateTime startTime, SessionType type, int sessionTime, int streak) {
        this.startTime = startTime;
        this.type = type;
        this.sessionTime = sessionTime;
        this.state = SessionState.ACTIVE;
        this.totalPauseDuration = 0;
        this.streak = streak;
    }

    public int getStreak() {
        return streak;
    }

    public int getSessionTime() {
        return sessionTime;
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

    public SessionState getState() {
        return state;
    }

    public long getId() {
        return id;
    }

    public LocalDateTime getPauseTime() {
        return pauseTime;
    }

    public int getTotalPauseDuration() {
        return totalPauseDuration;
    }

    public void pause() {
        if(state != SessionState.ACTIVE)
            throw new IllegalStateException("There is no active session");

        setState(SessionState.PAUSED);
        pauseTime = LocalDateTime.now();
    }

    public void resume() {
        if(state != SessionState.PAUSED)
            throw new IllegalStateException("Paused session was not correctly initialized");

        Duration interval = Duration.between(pauseTime, LocalDateTime.now());
        totalPauseDuration = totalPauseDuration + (int) interval.toSeconds();
        pauseTime = null;

        setState(SessionState.ACTIVE);
    }

    public void cancel() {
        if(state != SessionState.ACTIVE && state != SessionState.PAUSED)
            throw new IllegalStateException("There is no active session");

        if(state == SessionState.PAUSED && pauseTime != null) {
            Duration interval = Duration.between(pauseTime, LocalDateTime.now());
            totalPauseDuration = totalPauseDuration + (int) interval.toSeconds();
            pauseTime = null;
        }
        endTime = LocalDateTime.now();
        setState(SessionState.CANCELLED);
    }

    public void complete() {
        if(state != SessionState.ACTIVE)
            throw new IllegalStateException("There is no active session");

        if((int)Duration.between(startTime, LocalDateTime.now()).toSeconds() - totalPauseDuration < sessionTime)
            throw new IllegalStateException("The session is yet to end");

        endTime = LocalDateTime.now();
        setState(SessionState.COMPLETED);
    }


    @Override
    public String toString() {
        return "PomodoroSession{" + "startTime=" +  startTime + ", endTime=" + endTime + 
                ", state=" + state + ", type=" + type + ", pausedTime=" + pauseTime + ", totalPauseDuration=" + totalPauseDuration + "}";
    }
}
