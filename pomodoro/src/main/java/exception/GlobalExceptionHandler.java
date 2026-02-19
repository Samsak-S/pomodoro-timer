package exception;

import org.apache.catalina.connector.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private ResponseEntity<Object> buildResponse(String message, HttpStatus status) {
        HashMap<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        return new ResponseEntity<> (body, status);
    }
    
    @ExceptionHandler(SessionConflictException.class)
    public ResponseEntity<Object> handleConflict(SessionConflictException ex) {
        return buildResponse(ex.getMessage(), HttpStatus.CONFLICT);
    }
}
