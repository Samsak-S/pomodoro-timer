package com.example.pomodoro;

import model.SessionState;
import model.SessionType;
import exception.*;
import java.util.List;
import java.util.Optional;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

@Service
public class PomodoroService {

    private final PomodoroRepository repository;

    public PomodoroService(PomodoroRepository repository) {
        this.repository = repository;
    }

    public Optional<PomodoroSession> getActiveOrPausedSession() {
        return repository.findFirstByStateIn(List.of(SessionState.ACTIVE, SessionState.PAUSED));
    }
    public PomodoroSession startSession(SessionType type) {
        if(getActiveOrPausedSession().isPresent()) {
            throw new InvalidSessionActionException("This session is already in progress!");
        }
        PomodoroSession thisSession = new PomodoroSession(LocalDateTime.now() , type);

        return repository.save(thisSession);
    }

    public PomodoroSession pauseSession() {
        PomodoroSession thisSession = getActiveOrPausedSession().orElseThrow(() -> new InvalidSessionActionException("There is no session to pause"));

        try {
            thisSession.pause();
        } 
        catch(IllegalStateException ex) {
            throw new InvalidSessionActionException(ex.getMessage());
        }

        return repository.save(thisSession);
    }

     public PomodoroSession resumeSession() {
        PomodoroSession thisSession = getActiveOrPausedSession().orElseThrow(() -> new InvalidSessionActionException("There is no session to resume"));
        try {
            thisSession.resume();
        }
        catch(IllegalStateException ex) {
            throw new InvalidSessionActionException(ex.getMessage());
        }

        return repository.save(thisSession);
    } 

    public PomodoroSession completeSession() {
        PomodoroSession thisSession = getActiveOrPausedSession().orElseThrow(() -> new InvalidSessionActionException("There is no session to complete"));
        try {
            thisSession.complete();
        }
        catch(IllegalStateException ex) {
            throw new InvalidSessionActionException(ex.getMessage());
        }
        return repository.save(thisSession);
    }

    public PomodoroSession cancelSession() {
        PomodoroSession thisSession = getActiveOrPausedSession().orElseThrow(() -> new InvalidSessionActionException("There is no session to complete"));
        try {
            thisSession.cancel();
        }
        catch(IllegalStateException ex) {
            throw new InvalidSessionActionException(ex.getMessage());
        }
        return repository.save(thisSession);
    }

    public PomodoroSession getCurrentSession() {
        return getActiveOrPausedSession().orElseThrow(() -> new InvalidSessionActionException("There is no session to get"));
    }

}
