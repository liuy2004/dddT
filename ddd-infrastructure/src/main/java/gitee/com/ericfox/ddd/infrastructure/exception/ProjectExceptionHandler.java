package gitee.com.ericfox.ddd.infrastructure.exception;

import gitee.com.ericfox.ddd.common.exceptions.FrameworkApiException;
import gitee.com.ericfox.ddd.infrastructure.general.common.exceptions.FrameworkApiRepoException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 统一异常处理
 */
@ControllerAdvice
@Slf4j
public class ProjectExceptionHandler {
    @ResponseBody
    @ExceptionHandler(FrameworkApiRepoException.class)
    public ResponseEntity<?> handlerException(HttpServletRequest request, FrameworkApiException exception) {
        ResponseEntity<?> responseEntity = exception.getResponseEntity();
        log.error(exception.getMessage(), exception);
        return responseEntity;
    }
}
