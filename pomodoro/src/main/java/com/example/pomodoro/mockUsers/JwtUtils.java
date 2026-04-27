package com.example.pomodoro.mockUsers;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Jwts.SIG;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtils {

    private final String SECRET_KEY;
    private final long EXPIRATION_MS;
    private final SecretKey key;

    public JwtUtils(@Value("${jwt.secret}") String SECRET_KEY, @Value("${jwt.expiration}") long EXPIRATION_MS) {
        this.SECRET_KEY = SECRET_KEY;
        this.EXPIRATION_MS = EXPIRATION_MS;
        this.key = Keys.hmacShaKeyFor(this.SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }


    public String generateToken(String username) {

        long now = System.currentTimeMillis();

        return Jwts.builder()
            .subject(username)
            .issuedAt(new Date(now))
            .expiration(new Date(now + EXPIRATION_MS))
            .signWith(key, SIG.HS256)
            .compact();
    }
    
}
