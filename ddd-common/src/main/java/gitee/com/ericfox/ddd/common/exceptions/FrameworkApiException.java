package gitee.com.ericfox.ddd.common.exceptions;

import gitee.com.ericfox.ddd.common.interfaces.infrastructure.ProjectException;
import gitee.com.ericfox.ddd.common.toolkit.coding.MapUtil;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;

import java.util.Map;

/**
 * 持久化异常
 */
@Getter
@Setter
public class FrameworkApiException extends RuntimeException implements ProjectException<FrameworkApiException> {
    private ResponseEntity<?> responseEntity;

    public FrameworkApiException(String msg, HttpStatusCode httpStatus) {
        super(msg);
        Map<String, Object> body = MapUtil.newHashMap(2);
        body.put("message", msg);
        body.put("code", httpStatus.value());
        this.responseEntity = new ResponseEntity(body, httpStatus);
    }

    public FrameworkApiException(String msg, HttpStatusCode httpStatus, Throwable throwable) {
        super(msg, throwable);
        if (msg != null && throwable != null) {
            msg += throwable.getMessage();
        }
        Map<String, Object> body = MapUtil.newHashMap(2);
        body.put("message", msg);
        body.put("code", httpStatus.value());
        this.responseEntity = new ResponseEntity(body, httpStatus);
    }
}
