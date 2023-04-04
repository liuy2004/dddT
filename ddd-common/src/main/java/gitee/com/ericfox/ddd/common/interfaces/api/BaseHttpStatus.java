package gitee.com.ericfox.ddd.common.interfaces.api;

import gitee.com.ericfox.ddd.common.exceptions.FrameworkApiFluxException;
import gitee.com.ericfox.ddd.common.exceptions.FrameworkApiMonoException;
import org.springframework.http.HttpStatus;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.io.Serializable;

/**
 * http请求状态码
 */
public interface BaseHttpStatus {
    HttpStatus CONTINUE_100 = HttpStatus.CONTINUE;
    HttpStatus OK_200 = HttpStatus.OK;
    HttpStatus CREATED_201 = HttpStatus.CREATED;
    HttpStatus NO_CONTENT_204 = HttpStatus.NO_CONTENT;
    HttpStatus RESET_CONTENT_205 = HttpStatus.RESET_CONTENT;
    HttpStatus MOVED_PERMANENTLY_301 = HttpStatus.MOVED_PERMANENTLY;
    HttpStatus FOUND_302 = HttpStatus.FOUND;
    HttpStatus NOT_MODIFIED_304 = HttpStatus.NOT_MODIFIED;
    HttpStatus BAD_REQUEST_400 = HttpStatus.BAD_REQUEST;
    HttpStatus UNAUTHORIZED_401 = HttpStatus.UNAUTHORIZED;
    HttpStatus FORBIDDEN_403 = HttpStatus.FORBIDDEN;
    HttpStatus NOT_FOUND_404 = HttpStatus.NOT_FOUND;
    HttpStatus METHOD_NOT_ALLOWED_405 = HttpStatus.METHOD_NOT_ALLOWED;
    HttpStatus UNPROCESSABLE_ENTITY_422 = HttpStatus.UNPROCESSABLE_ENTITY;
    HttpStatus TOO_MANY_REQUESTS_429 = HttpStatus.TOO_MANY_REQUESTS;
    HttpStatus INTERNAL_SERVER_ERROR_500 = HttpStatus.INTERNAL_SERVER_ERROR;
    HttpStatus BAD_GATEWAY_502 = HttpStatus.BAD_GATEWAY;
    HttpStatus SERVICE_UNAVAILABLE_503 = HttpStatus.SERVICE_UNAVAILABLE;
    HttpStatus GATEWAY_TIMEOUT_504 = HttpStatus.GATEWAY_TIMEOUT;

    default Mono<? extends Serializable> monoError(HttpStatus httpStatus) {
        return monoError(httpStatus, httpStatus.getReasonPhrase());
    }

    default Mono<? extends Serializable> monoError(HttpStatus httpStatus, String message) {
        return monoError(httpStatus, message, null);
    }

    default Mono<? extends Serializable> monoError(HttpStatus httpStatus, String message, Throwable throwable) {
        return Mono.error(new FrameworkApiMonoException(message, httpStatus, throwable));
    }

    default Flux<? extends Serializable> fluxError(HttpStatus httpStatus) {
        return fluxError(httpStatus, httpStatus.getReasonPhrase());
    }

    default Flux<? extends Serializable> fluxError(HttpStatus httpStatus, String message) {
        return fluxError(httpStatus, message, null);
    }

    default Flux<? extends Serializable> fluxError(HttpStatus httpStatus, String message, Throwable throwable) {
        return Flux.error(new FrameworkApiFluxException(message, httpStatus, throwable));
    }
}
