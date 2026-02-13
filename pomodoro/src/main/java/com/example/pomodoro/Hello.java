package com.example.pomodoro;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hello")
public class Hello {
    @GetMapping
    public String newDay() {
        return "<h1>This is a new day</h1>";
    }
}
