package gitee.com.ericfox.ddd.api.controller.framework.base;

import gitee.com.ericfox.ddd.common.interfaces.api.BaseApiController;
import gitee.com.ericfox.ddd.context.sys.model.sys_user.SysUserDetailParam;
import gitee.com.ericfox.ddd.context.sys.model.sys_user.SysUserDto;
import gitee.com.ericfox.ddd.context.sys.model.sys_user.SysUserPageParam;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.rsocket.RSocketRequester;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.io.Serializable;
import java.util.List;

@Slf4j
@ResponseBody
public abstract class ApiFrameworkUserControllerBase implements BaseApiController<SysUserPageParam, SysUserDetailParam, SysUserDto> {
    @Resource
    protected Mono<RSocketRequester> monoRequester;
    @Resource
    protected Flux<RSocketRequester> fluxRequester;

    @GetMapping(value = "/{id}", produces = APPLICATION_JSON)
    public Mono<? extends Serializable> detail(@PathVariable Long id) {
        return
                monoRequester.flatMap(rSocketRequester ->
                                rSocketRequester.route(SysUserDto.BUS_NAME + ".detail").data(id).retrieveMono(Serializable.class))
                        .map(obj -> obj)
                        .doOnError(onMonoErrorFunc);
    }

    @GetMapping(value = "/page/{pageNum}/{pageSize}", produces = APPLICATION_JSON)
    public Mono<? extends Serializable> page(SysUserPageParam pageParam) {
        return
                monoRequester.flatMap(rSocketRequester ->
                                rSocketRequester.route(SysUserDto.BUS_NAME + ".page").data(pageParam).retrieveMono(Serializable.class))
                        .map(obj -> obj)
                        .doOnError(onMonoErrorFunc);
    }

    @Override
    @GetMapping(value = "/list/{pageSize}", produces = APPLICATION_JSON)
    public Flux<? extends Serializable> list(SysUserPageParam pageParam) {
        return
                fluxRequester.flatMap(rSocketRequester ->
                                rSocketRequester.route(SysUserDto.BUS_NAME + ".list").data(pageParam).retrieveFlux(Serializable.class))
                        .map(obj -> obj)
                        .doOnError(onMonoErrorFunc);
    }

    @Override
    @PutMapping(value = "/create", produces = APPLICATION_JSON)
    public Mono<? extends Serializable> create(@RequestBody SysUserDetailParam detailParam) {
        return
                monoRequester.flatMap(rSocketRequester ->
                                rSocketRequester.route(SysUserDto.BUS_NAME + ".create").data(detailParam).retrieveMono(Serializable.class))
                        .map(obj -> obj)
                        .doOnError(onMonoErrorFunc);
    }

    @Override
    @PatchMapping(value = "/edit", produces = APPLICATION_JSON)
    public Mono<? extends Serializable> edit(SysUserDetailParam detailParam) {
        return
                monoRequester.flatMap(rSocketRequester ->
                                rSocketRequester.route(SysUserDto.BUS_NAME + ".edit").data(detailParam).retrieveMono(Serializable.class))
                        .map(obj -> obj)
                        .doOnError(onMonoErrorFunc);
    }

    @Override
    @DeleteMapping(value = "/remove", produces = APPLICATION_JSON)
    public Mono<? extends Serializable> remove(SysUserDetailParam detailParam) {
        return
                monoRequester.flatMap(rSocketRequester ->
                                rSocketRequester.route(SysUserDto.BUS_NAME + ".remove").data(detailParam).retrieveMono(Serializable.class))
                        .map(obj -> obj)
                        .doOnError(onMonoErrorFunc);
    }

    @Override
    @DeleteMapping(value = "/multiRemove", produces = APPLICATION_JSON)
    public Mono<? extends Serializable> multiRemove(List<SysUserDetailParam> detailParamList) {
        return
                monoRequester.flatMap(rSocketRequester ->
                                rSocketRequester.route(SysUserDto.BUS_NAME + ".multiRemove").data(detailParamList).retrieveMono(Serializable.class))
                        .map(obj -> obj)
                        .doOnError(onMonoErrorFunc);
    }
}
