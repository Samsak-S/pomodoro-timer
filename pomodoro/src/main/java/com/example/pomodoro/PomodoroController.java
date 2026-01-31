package com.example.pomodoro;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/pomodoro")
public class PomodoroController {
    @PostMapping
    public PomodoroSession creatSession(@RequestBody PomodoroSession session) {
        System.out.println(session);
        return session;
    }
}