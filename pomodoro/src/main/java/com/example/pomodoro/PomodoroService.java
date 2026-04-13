package com.example.pomodoro;

import exception.*;
import java.util.List;
import java.util.Optional;

import java.time.LocalDateTime;
import org.springframework.stereotype.Service;

import com.example.pomodoro.model.SessionState;
import com.example.pomodoro.model.SessionType;

@Service
public class PomodoroService {

    private final PomodoroRepository repository;
    private final PomodoroMapper mapper;

    public PomodoroService(PomodoroRepository repository, PomodoroMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public Optional<PomodoroSession> getActiveOrPausedSession(User user) {
        return repository.findFirstByUserAndStateIn(user, List.of(SessionState.ACTIVE, SessionState.PAUSED));
    }

    public Optional<PomodoroSession> getActiveOrPausedOrCompletedSession(User user) {
        return repository.findFirstByUserAndStateInOrderByIdDesc(user, List.of(SessionState.ACTIVE, SessionState.PAUSED, SessionState.COMPLETED));
    }

    public PomodoroSessionDto startSession(User user, SessionType type, int sessionTime, int streak) {
        if(getActiveOrPausedSession(user).isPresent()) {
            throw new SessionConflictException("This session is already in progress!");
        }
        PomodoroSession thisSession = new PomodoroSession(user, LocalDateTime.now() , type, sessionTime, streak);

        return mapper.toDto(repository.save(thisSession));
    }

    public PomodoroSessionDto pauseSession(User user) {
        PomodoroSession thisSession = getActiveOrPausedSession(user).orElseThrow(() -> new InvalidSessionActionException("There is no session to pause"));

        try {
            thisSession.pause();
        } 
        catch(IllegalStateException ex) {
            throw new InvalidSessionActionException(ex.getMessage());
        }

        return mapper.toDto(repository.save(thisSession));
    }

     public PomodoroSessionDto resumeSession(User user) {
        PomodoroSession thisSession = getActiveOrPausedSession(user).orElseThrow(() -> new InvalidSessionActionException("There is no session to resume"));
        try {
            thisSession.resume();
        }
        catch(IllegalStateException ex) {
            throw new InvalidSessionActionException(ex.getMessage());
        }

        return mapper.toDto(repository.save(thisSession));
    } 

    public PomodoroSessionDto completeSession(User user) {
        PomodoroSession thisSession = getActiveOrPausedSession(user).orElseThrow(() -> new InvalidSessionActionException("There is no session to complete"));
        try {
            thisSession.complete();
        }
        catch(IllegalStateException ex) {
            throw new InvalidSessionActionException(ex.getMessage());
        }

        return mapper.toDto(repository.save(thisSession));
    }

    public PomodoroSessionDto cancelSession(User user) {
        PomodoroSession thisSession = getActiveOrPausedSession(user).orElseThrow(() -> new InvalidSessionActionException("There is no session to complete"));
        try {
            thisSession.cancel();
        }
        catch(IllegalStateException ex) {
            throw new InvalidSessionActionException(ex.getMessage());
        }

        return mapper.toDto(repository.save(thisSession));
    }

    public PomodoroSessionDto getCurrentSession(User user) {
        PomodoroSession temp =  getActiveOrPausedOrCompletedSession(user).orElseThrow(() -> new SessionNotFoundException("There is no session to get"));
        return mapper.toDto(temp);
    }
}