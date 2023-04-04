package gitee.com.ericfox.ddd.common.interfaces.api;

import gitee.com.ericfox.ddd.common.exceptions.FrameworkApiException;
import gitee.com.ericfox.ddd.common.exceptions.FrameworkApiFluxException;
import gitee.com.ericfox.ddd.common.exceptions.FrameworkApiMonoException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.io.Serializable;
import java.util.List;

public interface BaseApiController<PAGE_PARAM extends BasePageParam, DETAIL_PARAM extends BaseDetailParam, DTO extends BaseDto> extends BaseHttpStatus {
    String APPLICATION_JSON = MediaType.APPLICATION_JSON_VALUE;
    String TEXT_EVENT_STREAM = MediaType.TEXT_EVENT_STREAM_VALUE;
    java.util.function.Consumer<? super Throwable> onMonoErrorFunc = (e) -> {
        if (e instanceof FrameworkApiException) {
            throw new FrameworkApiMonoException(e.getMessage(), ((FrameworkApiException) e).getResponseEntity().getStatusCode(), e);
        }
        throw new FrameworkApiMonoException(e.getMessage(), INTERNAL_SERVER_ERROR_500);
    };
    java.util.function.Consumer<? super Throwable> onFluxErrorFunc = (e) -> {
        if (e instanceof FrameworkApiException) {
            throw new FrameworkApiFluxException(e.getMessage(), ((FrameworkApiException) e).getResponseEntity().getStatusCode(), e);
        }
        throw new FrameworkApiFluxException(e.getMessage(), INTERNAL_SERVER_ERROR_500);
    };

    default Mono<? extends Serializable> detail(Long id) {
        return monoError(METHOD_NOT_ALLOWED_405);
    }

    default Mono<? extends Serializable> page(PAGE_PARAM pageParam) {
        return monoError(HttpStatus.METHOD_NOT_ALLOWED);
    }

    default Flux<? extends Serializable> list(PAGE_PARAM pageParam) {
        return fluxError(HttpStatus.METHOD_NOT_ALLOWED);
    }

    default Mono<? extends Serializable> create(DETAIL_PARAM detailParam) {
        return monoError(HttpStatus.METHOD_NOT_ALLOWED);
    }

    default Mono<? extends Serializable> edit(DETAIL_PARAM detailParam) {
        return monoError(HttpStatus.METHOD_NOT_ALLOWED);
    }

    default Mono<? extends Serializable> remove(DETAIL_PARAM detailParam) {
        return monoError(HttpStatus.METHOD_NOT_ALLOWED);
    }

    default Mono<? extends Serializable> multiRemove(List<DETAIL_PARAM> detailParamList) {
        return monoError(HttpStatus.METHOD_NOT_ALLOWED);
    }
}
