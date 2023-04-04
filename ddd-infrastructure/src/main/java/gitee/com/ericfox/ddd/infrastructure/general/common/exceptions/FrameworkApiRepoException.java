package gitee.com.ericfox.ddd.infrastructure.general.common.exceptions;

import gitee.com.ericfox.ddd.common.exceptions.FrameworkApiException;
import org.springframework.http.HttpStatus;

/**
 * 持久化异常
 */
public class FrameworkApiRepoException extends FrameworkApiException {
    public FrameworkApiRepoException(String msg, HttpStatus httpStatus) {
        super(msg, httpStatus);
    }

    public FrameworkApiRepoException(String msg, HttpStatus httpStatus, Throwable throwable) {
        super(msg, httpStatus, throwable);
    }
}
