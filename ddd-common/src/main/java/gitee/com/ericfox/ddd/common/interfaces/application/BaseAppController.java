package gitee.com.ericfox.ddd.common.interfaces.application;

import gitee.com.ericfox.ddd.common.exceptions.FrameworkApiException;
import gitee.com.ericfox.ddd.common.interfaces.api.BaseHttpStatus;

public interface BaseAppController extends BaseHttpStatus {
    java.util.function.Consumer<? super Throwable> onErrorFunc = (e) -> {
        try {
            throw new FrameworkApiException(e.getMessage(), INTERNAL_SERVER_ERROR_500);
        } catch (Throwable ex) {
            throw new RuntimeException(ex);
        }
    };
}
