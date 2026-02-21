package exception;

public class InvalidSessionActionException extends RuntimeException {
    public InvalidSessionActionException(String message) {
        super(message);
    }    
}
