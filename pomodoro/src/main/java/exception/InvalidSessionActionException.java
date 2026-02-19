package exception;

public class InvalidSessionActionException extends RuntimeException {
    InvalidSessionActionException(String message) {
        super(message);
    }    
}
