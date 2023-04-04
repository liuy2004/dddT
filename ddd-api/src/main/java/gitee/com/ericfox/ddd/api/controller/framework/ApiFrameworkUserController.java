package gitee.com.ericfox.ddd.api.controller.framework;

import gitee.com.ericfox.ddd.api.controller.framework.base.ApiFrameworkUserControllerBase;
import gitee.com.ericfox.ddd.context.sys.model.sys_user.SysUserDetailParam;
import gitee.com.ericfox.ddd.context.sys.model.sys_user.SysUserDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.io.Serializable;
import java.util.List;

@Controller
@RequestMapping("/sys/sysUser")
@Slf4j
public class ApiFrameworkUserController extends ApiFrameworkUserControllerBase {
    @Override
    @PutMapping(value = "/create", produces = APPLICATION_JSON)
    public Mono<? extends Serializable> create(@RequestBody SysUserDetailParam detailParam) {
        return monoError(METHOD_NOT_ALLOWED_405);
    }

    @Override
    @PatchMapping(value = "/edit", produces = APPLICATION_JSON)
    public Mono<? extends Serializable> edit(SysUserDetailParam detailParam) {
        return monoError(METHOD_NOT_ALLOWED_405);
    }

    @Override
    @DeleteMapping(value = "/remove", produces = APPLICATION_JSON)
    public Mono<? extends Serializable> remove(SysUserDetailParam detailParam) {
        return monoError(METHOD_NOT_ALLOWED_405);
    }

    @Override
    @DeleteMapping(value = "/multiRemove", produces = APPLICATION_JSON)
    public Mono<? extends Serializable> multiRemove(List<SysUserDetailParam> detailParamList) {
        return monoError(METHOD_NOT_ALLOWED_405);
    }

    /**
     * 登录
     */
    @PutMapping(value = "/login", produces = APPLICATION_JSON)
    public Mono<? extends Serializable> login(SysUserDetailParam detailParam) {
        return
                monoRequester.flatMap(rSocketRequester ->
                                rSocketRequester.route(SysUserDto.BUS_NAME + ".detail").data(detailParam).retrieveMono(Serializable.class))
                        .map(obj -> obj)
                        .doOnError(onMonoErrorFunc);
    }

    /**
     * 注册
     */
    @PostMapping(value = "/register", produces = APPLICATION_JSON)
    public Mono<? extends Serializable> register(SysUserDetailParam detailParam) {
        return
                monoRequester.flatMap(rSocketRequester ->
                                rSocketRequester.route(SysUserDto.BUS_NAME + ".register").data(detailParam).retrieveMono(Serializable.class))
                        .map(obj -> obj)
                        .doOnError(onMonoErrorFunc);
    }
}
