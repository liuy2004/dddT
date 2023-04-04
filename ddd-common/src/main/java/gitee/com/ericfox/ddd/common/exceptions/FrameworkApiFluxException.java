package gitee.com.ericfox.ddd.common.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

public class FrameworkApiFluxException extends FrameworkApiException {
    public FrameworkApiFluxException(String msg, HttpStatus httpStatus) {
        super(msg, httpStatus);
    }

    public FrameworkApiFluxException(String msg, HttpStatusCode httpStatus, Throwable throwable) {
        super(msg, httpStatus, throwable);
    }
}
