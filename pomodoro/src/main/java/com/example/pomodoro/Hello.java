package com.example.pomodoro;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Hello {
    @GetMapping("/hello")
    public String newDay() {
        return "This is a new day";
    }
}
