package gitee.com.ericfox.ddd.common.exceptions;

import org.springframework.http.HttpStatusCode;

public class FrameworkApiMonoException extends FrameworkApiException {
    public FrameworkApiMonoException(String msg, HttpStatusCode httpStatus) {
        super(msg, httpStatus);
    }

    public FrameworkApiMonoException(String msg, HttpStatusCode httpStatus, Throwable throwable) {
        super(msg, httpStatus, throwable);
    }
}
