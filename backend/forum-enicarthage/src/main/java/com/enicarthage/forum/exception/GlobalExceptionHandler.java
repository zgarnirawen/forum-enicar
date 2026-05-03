package com.enicarthage.forum.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {
    record ErrorResponse(String code, String message) {}

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(404).body(new ErrorResponse("NOT_FOUND", ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleBusiness(IllegalArgumentException ex) {
        return ResponseEntity.status(400).body(new ErrorResponse("BAD_REQUEST", ex.getMessage()));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> handleState(IllegalStateException ex) {
        return ResponseEntity.status(409).body(new ErrorResponse("CONFLICT", ex.getMessage()));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccess(AccessDeniedException ex) {
        return ResponseEntity.status(403).body(new ErrorResponse("FORBIDDEN", "Acces refuse"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
        return ResponseEntity.status(500).body(new ErrorResponse("INTERNAL_ERROR", ex.getMessage()));
    }
}
