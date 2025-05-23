package com.tinashe.taskservice.config;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import feign.Response;
import feign.codec.ErrorDecoder;

public class CustomErrorDecoder implements ErrorDecoder {

    private final ErrorDecoder defaultDecoder = new Default();

    @Override
    public Exception decode(String methodKey, Response response) {
        return switch (response.status()) {
            case 400 -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bad request");
            case 401 -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
            case 403 -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
            case 404 -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found");
            default -> defaultDecoder.decode(methodKey, response);
        };
    }
}