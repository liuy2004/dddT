package gitee.com.ericfox.ddd.api.controller.framework;

import gitee.com.ericfox.ddd.api.controller.framework.base.ApiFrameworkTokenControllerBase;
import gitee.com.ericfox.ddd.context.sys.model.sys_token.SysTokenDetailParam;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.io.Serializable;

@Controller
@RequestMapping("/sys/sysToken")
public class ApiFrameworkTokenController extends ApiFrameworkTokenControllerBase {
    @Override
    @PutMapping(value = "/create", produces = APPLICATION_JSON)
    public Mono<? extends Serializable> create(@RequestBody SysTokenDetailParam detailParam) {
        return monoError(METHOD_NOT_ALLOWED_405);
    }

    @Override
    @PatchMapping(value = "/edit", produces = APPLICATION_JSON)
    public Mono<? extends Serializable> edit(SysTokenDetailParam detailParam) {
        return monoError(METHOD_NOT_ALLOWED_405);
    }

    @Override
    @DeleteMapping(value = "/remove", produces = APPLICATION_JSON)
    public Mono<? extends Serializable> remove(SysTokenDetailParam detailParam) {
        return monoError(METHOD_NOT_ALLOWED_405);
    }

}
