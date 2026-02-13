package com.example.pomodoro;

import model.SessionType;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;

import java.time.LocalDateTime;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/pomodoro")
public class PomodoroController {
    private final PomodoroService currentService;

    public PomodoroController(PomodoroService currentService) {
        this.currentService = currentService;
    }

    @PostMapping("/start")
    public PomodoroSession startPomodoro(@RequestBody SessionType type) {
        return currentService.startSession(type);
    }

    @PostMapping("/stop")
    public PomodoroSession stopPomodoro() {
        return currentService.stopSession();
    }

    @PostMapping("/pause")
    public PomodoroSession pausePomodoro() {
        return currentService.pauseSession();
    }

    @PostMapping("/resume")
    public PomodoroSession resumePomodoro() {
        return currentService.resumeSession();
    }

    @PostMapping("/cancel")
    public PomodoroSession cancelPomodoro() {
        return currentService.cancelSession();
    }

    @GetMapping("/current")
    public PomodoroSession currentPomodoro() {
        return currentService.currentSession();
    }
}