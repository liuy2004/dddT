package gitee.com.ericfox.ddd.starter.sdk.interfaces;

import gitee.com.ericfox.ddd.common.exceptions.FrameworkApiException;
import org.slf4j.Logger;
import org.springframework.http.HttpStatus;

public interface SdkMessageBus {

    default SdkMessageBus logInfo(Logger log, String msg, Object... objects) {
        return this;
    }

    default SdkMessageBus logWarn(Logger log, String msg, Object... objects) {
        return this;
    }

    default SdkMessageBus logDebug(Logger log, String msg, Object... objects) {
        return this;
    }

    default SdkMessageBus logError(Logger log, String msg, Object... objects) {
        return this;
    }

    default SdkMessageBus logError(Logger log, Throwable e, String msg, Object... objects) {
        return this;
    }

    default void terminate(Logger log, String msg, HttpStatus code) {
        throw new FrameworkApiException(msg, code);
    }
}
