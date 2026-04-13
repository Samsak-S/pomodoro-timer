package com.example.pomodoro;
import com.example.pomodoro.model.SessionType;

public class StartSessionRequestDto {

    private SessionType type;
    private int sessionTime;
    private int streak;

    public StartSessionRequestDto() {
    }

    public void setStreak(int streak) {
        this.streak = streak;
    }
    
    public int getStreak() {
        return streak;
    }

    public void setType(SessionType type) {
        this.type = type;
    }

    public void setSessionTime(int sessionTime) {
        this.sessionTime = sessionTime;
    }

    public SessionType getType() {
        return type;
    }

    public int getSessionTime() {
        return sessionTime;
    }
}