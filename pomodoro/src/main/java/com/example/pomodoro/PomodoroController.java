package com.example.pomodoro;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import com.example.pomodoro.mockUsers.*;

@RestController
@RequestMapping("/api/pomodoro")
public class PomodoroController {
    private final PomodoroService currentService;
    private final UserRepository repository;

    public PomodoroController(PomodoroService currentService, UserRepository repository) {
        this.currentService = currentService;
        this.repository = repository;
    }
    private User getMockUser(String username) {
        return repository.findByUsername(username).orElseThrow(() -> new RuntimeException("User Not Found! Use 'Alice' or 'Bob' in header"));
    }

    @PostMapping("/start")
    public PomodoroSessionDto startPomodoro(@RequestHeader(value= "X-User-Name", defaultValue = "Alice") String username, @RequestBody StartSessionRequestDto request) {
        User user = getMockUser(username);
        return currentService.startSession(user, request.getType(), request.getSessionTime(), request.getStreak());
    }

    @PostMapping("/complete")
    public PomodoroSessionDto completePomodoro(@RequestHeader(value= "X-User-Name", defaultValue = "Alice") String username) {
        User user = getMockUser(username);
        return currentService.completeSession(user);
    }

    @PostMapping("/pause")
    public PomodoroSessionDto pausePomodoro(@RequestHeader(value= "X-User-Name", defaultValue = "Alice") String username) {
        User user = getMockUser(username);
        return currentService.pauseSession(user);
    }

    @PostMapping("/resume")
    public PomodoroSessionDto resumePomodoro(@RequestHeader(value= "X-User-Name", defaultValue = "Alice") String username) {
        User user = getMockUser(username);
        return currentService.resumeSession(user);
    }

    @PostMapping("/cancel")
    public PomodoroSessionDto cancelPomodoro(@RequestHeader(value= "X-User-Name", defaultValue = "Alice") String username) {
        User user = getMockUser(username);
        return currentService.cancelSession(user);
    }

    @GetMapping("/current")
    public PomodoroSessionDto getCurrentPomodoro(@RequestHeader(value= "X-User-Name", defaultValue = "Alice") String username) {
        User user = getMockUser(username);
        return currentService.getCurrentSession(user);
    }
}