package com.example.pomodoro;

import model.SessionType;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/pomodoro")
public class PomodoroController {
    private PomodoroService currentService;

    public PomodoroController(PomodoroService currentService) {
        this.currentService = currentService;
    }

    @PostMapping("/start")
    public PomodoroSession startPomodoro(@RequestBody SessionType type) {
        return currentService.startSession(type);
    }

    @PostMapping("/complete")
    public PomodoroSession completePomodoro() {
        return currentService.completeSession();
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
    public PomodoroSession getCurrentPomodoro() {
        return currentService.getCurrentSession();
    }
}