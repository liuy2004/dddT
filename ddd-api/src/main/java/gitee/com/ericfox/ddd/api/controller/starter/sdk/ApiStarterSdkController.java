package gitee.com.ericfox.ddd.api.controller.starter.sdk;

import gitee.com.ericfox.ddd.common.interfaces.api.BaseApiController;
import gitee.com.ericfox.ddd.common.interfaces.starter.sdk.SdkService;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.messaging.rsocket.RSocketRequester;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.io.Serializable;
import java.util.Map;

@Slf4j
@Controller
@ConditionalOnBean(SdkService.class)
@RequestMapping("/starter/sdk")
public class ApiStarterSdkController implements BaseApiController {
    @Resource
    private Mono<RSocketRequester> monoRequester;
    @Resource
    private Flux<RSocketRequester> fluxRequester;

    @GetMapping("/view/restful")
    public String restful(Model model) {
        model.addAttribute("viewPath", "/static/starter/sdk/view");
        model.addAttribute("sdkPath", "/ddd-sdk/index-rest.js");
        model.addAttribute("title", "命令行工具RestfulApi版");
        return "starter/sdk/view/index";
    }

    @GetMapping({"/view", "/view/socket"})
    public String socket(Model model) {
        model.addAttribute("viewPath", "/static/starter/sdk/view");
        model.addAttribute("sdkPath", "/ddd-sdk/index.js");
        model.addAttribute("title", "命令行工具WebSocket版");
        return "starter/sdk/view/index";
    }

    @GetMapping("/view/tcp")
    public String tcp(Model model) {
        model.addAttribute("viewPath", "/static/starter/sdk/view");
        model.addAttribute("sdkPath", "/ddd-sdk/index-tcp.js");
        model.addAttribute("title", "命令行工具Tcp版");
        return "starter/sdk/view/index";
    }

    @ResponseBody
    @PostMapping(value = "/execute", produces = APPLICATION_JSON)
    public Flux<? extends Serializable> execute(@RequestBody Map<String, Object> params) {
        return fluxRequester.flatMap(requester ->
                        requester.route("AppFrameworkStarterSdkController.execute")
                                .data(params)
                                .retrieveFlux(Serializable.class)
                ).map(result -> result)
                .doOnError(onFluxErrorFunc);
    }

    @ResponseBody
    @GetMapping(value = "/remindCommand", produces = APPLICATION_JSON)
    public Flux<? extends Serializable> remindCommand(@RequestParam Map<String, Object> params) {
        return fluxRequester.flatMap(requester -> requester
                        .route("AppFrameworkStarterSdkController.remindCommand")
                        .data(params)
                        .retrieveMono(Serializable.class))
                .map(result -> {
                    return result;
                })
                .doOnError(onMonoErrorFunc);
    }

    @GetMapping("/view/wiki")
    public String wikiHome(Model model) {
        model.addAttribute("viewPath", "/static/starter/sdk/view");
        model.addAttribute("editorPath", "/ddd-wiki/editor.js");
        model.addAttribute("directoryPath", "/ddd-wiki/directory.js");
        model.addAttribute("title", "开发文档中心");
        return "starter/sdk/view/wiki";
    }
}
