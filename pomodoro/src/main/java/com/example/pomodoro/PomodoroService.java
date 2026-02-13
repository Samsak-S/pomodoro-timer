package com.example.pomodoro;

import model.SessionType;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

@Service
public class PomodoroService {

    private PomodoroSession session;

    public PomodoroSession startSession(SessionType type) {

        if(session != null) {
            throw new IllegalStateException("This session is already in progress!");
        }
        session = new PomodoroSession(LocalDateTime.now() , type);

        return session;
    }

    public PomodoroSession pauseSession() {

        if(session == null) 
            throw new IllegalStateException("There is no session to pause");
        session.pause();

        return session;

    }
     public PomodoroSession resumeSession() {

        if(session == null) 
            throw new IllegalStateException("There is no session to pause");
        session.resume();

        return session;
    } 

    public PomodoroSession stopSession() {

        if(session == null)
            throw new IllegalStateException("There is no active session to stop");
        session.stop();
        PomodoroSession finished = session;
        session = null;

        return finished;
    }

    public PomodoroSession cancelSession() {

        if(session == null)
            throw new IllegalStateException("There are no active session to cancel");
        session.cancel();
        PomodoroSession cancelled = session;
        session = null;

        return cancelled;
    }

    public PomodoroSession currentSession() {
        return session;
    }

}
