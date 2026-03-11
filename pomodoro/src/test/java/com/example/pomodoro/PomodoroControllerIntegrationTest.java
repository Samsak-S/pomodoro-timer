package com.example.pomodoro;

import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class PomodoroControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PomodoroRepository repository;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
    }

    @Test
    void testStartSessionReturns200() throws Exception{
        mockMvc.perform(post("/api/pomodoro/start").content("\"FOCUS\"").contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.type").value("FOCUS"))
        .andExpect(jsonPath("$.sessionStatus").value("ACTIVE"));
    }

    @Test
    void testStartSessionReturns409() throws Exception{
        mockMvc.perform(post("/api/pomodoro/start").content("\"FOCUS\"").contentType(MediaType.APPLICATION_JSON));
        mockMvc.perform(post("/api/pomodoro/start").content("\"BREAK\"").contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.message").value("This session is already in progress!"));
    }

    @Test
    void testCurrentSessionReturns400() throws Exception{
        mockMvc.perform(get("/api/pomodoro/current"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.message").value("There is no session to get"));
    }
}
