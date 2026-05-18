package com.example.pomodoro;
import com.example.pomodoro.model.SessionType;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class StartSessionRequestDto {

    @NotNull
    private SessionType type;
    @Positive
    private int sessionTime;
    @Min(0)
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