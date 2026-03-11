package com.example.pomodoro;
import model.SessionType;

public class StartSessionRequest {

    private SessionType type;
    private int sessionTime;

    public StartSessionRequest() {
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
