package exception;

public class SessionNotFoundException extends RuntimeException {
    SessionNotFoundException(String message) {
        super(message);
    }    
}
