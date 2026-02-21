package com.example.pomodoro;

import model.SessionType;
import exception.*;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

@Service
public class PomodoroService {

    private PomodoroSession session;

    public PomodoroSession startSession(SessionType type) {
        if(session != null) {
            throw new InvalidSessionActionException("This session is already in progress!");
        }
        session = new PomodoroSession(LocalDateTime.now() , type);

        return session;
    }

    public PomodoroSession pauseSession() {
        if(session == null) 
            throw new InvalidSessionActionException("There is no session to pause");

        try {
            session.pause();
        } 
        catch(IllegalStateException ex) {
            throw new InvalidSessionActionException(ex.getMessage());
        }

        return session;
    }

     public PomodoroSession resumeSession() {
        if(session == null) 
            throw new InvalidSessionActionException("There is no session to resume");
        try {
            session.resume();
        }
        catch(IllegalStateException ex) {
            throw new InvalidSessionActionException(ex.getMessage());
        }

        return session;
    } 

    public PomodoroSession completeSession() {
        if(session == null)
            throw new InvalidSessionActionException("There is no session to complete");
        try {
            session.complete();
        }
        catch(IllegalStateException ex) {
            throw new InvalidSessionActionException(ex.getMessage());
        }
        PomodoroSession finished = session;
        session = null;

        return finished;
    }

    public PomodoroSession cancelSession() {
        if(session == null)
            throw new InvalidSessionActionException("There are no active session to cancel");
        try {
            session.cancel();
        }
        catch(IllegalStateException ex) {
            throw new InvalidSessionActionException(ex.getMessage());
        }
        PomodoroSession cancelled = session;
        session = null;

        return cancelled;
    }

    public PomodoroSession currentSession() {
        if(session == null) {
            throw new SessionConflictException("No active session found.");
        }
        return session;
    }

}
