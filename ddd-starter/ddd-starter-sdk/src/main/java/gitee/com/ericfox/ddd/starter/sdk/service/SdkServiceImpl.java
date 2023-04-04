package gitee.com.ericfox.ddd.starter.sdk.service;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ReUtil;
import cn.hutool.core.util.ReflectUtil;
import gitee.com.ericfox.ddd.common.exceptions.FrameworkApiException;
import gitee.com.ericfox.ddd.common.interfaces.api.BaseHttpStatus;
import gitee.com.ericfox.ddd.common.interfaces.starter.sdk.SdkService;
import gitee.com.ericfox.ddd.common.pattern.starter.sdk.SdkCommand;
import gitee.com.ericfox.ddd.common.toolkit.coding.StrUtil;
import gitee.com.ericfox.ddd.starter.sdk.config.SdkConfig;
import gitee.com.ericfox.ddd.starter.sdk.interfaces.SdkMessageBus;
import jakarta.annotation.Resource;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;
import reactor.core.publisher.FluxSink;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class SdkServiceImpl implements SdkService, BaseHttpStatus, SdkMessageBus {
    @Resource
    private SdkConfig sdkConfig;

    private Map<String, Class<? extends SdkCommand>> getCommandMap() {
        return sdkConfig.getCommandMap();
    }

    /**
     * 构造指令
     */
    @SneakyThrows
    @SuppressWarnings("unchecked")
    private <T extends SdkCommand> SdkCommand makeCommand(T resultCommand, List<String> argList) {
        if (CollUtil.isEmpty(argList)) {
            if (resultCommand == null) {
                throw new FrameworkApiException("指令不存在", BAD_REQUEST_400);
            }
            return resultCommand;
        }
        Map<String, Class<? extends SdkCommand>> commandMap = getCommandMap();
        for (int i = 0; i < argList.size(); i++) {
            String arg = argList.get(i);
            if (commandMap.containsKey(arg)) { //指令
                if (resultCommand == null) {
                    resultCommand = (T) ReflectUtil.newInstance(commandMap.get(arg));
                } else if (Boolean.valueOf(true).equals(resultCommand.getClass().getDeclaredField("INCLUDE_OTHER_COMMAND").get(null))) {
                    resultCommand.setNextCommand(makeCommand(null, argList.subList(i, argList.size())));
                    break;
                } else {
                    throw new FrameworkApiException(resultCommand.getCommandName() + "指令 无效的参数: " + arg, BAD_REQUEST_400);
                }
            } else if (!commandMap.containsKey(arg) && arg.startsWith("-")) { //参数
                if (resultCommand == null) {
                    throw new FrameworkApiException("指令不存在: " + arg, BAD_REQUEST_400);
                } else if (!resultCommand.isValidArg(arg)) {
                    throw new FrameworkApiException(resultCommand.getCommandName() + "指令 无效的参数: " + arg, BAD_REQUEST_400);
                } else if (arg.startsWith("--")) {
                    resultCommand.getArgsMap().put(arg, "");
                } else {
                    if (i + 1 >= argList.size()) {
                        throw new FrameworkApiException(resultCommand.getCommandName() + "指令 " + arg + "缺少对应的参数值", BAD_REQUEST_400);
                    }
                    resultCommand.getArgsMap().put(arg, argList.get(++i));
                }
            } else {
                throw new FrameworkApiException("无效的指令或参数: " + arg, BAD_REQUEST_400);
            }
        }
        return resultCommand;
    }

    /**
     * 解析指令
     */
    @Override
    public SdkCommand parseCommand(String str) {
        //替换掉空格
        LinkedList<String> argList = Stream.of(str.split("\\s")).filter(StrUtil::isNotBlank).collect(Collectors.toCollection(CollUtil::newLinkedList));
        return makeCommand(null, argList);
    }

    /**
     * 执行指令
     */
    @Override
    public List<?> executeCommand(SdkCommand command, FluxSink<List<?>> flux) {
        return command.run();
    }

    @Override
    public List<String> remindCommand(String command) {
        Map<String, Class<? extends SdkCommand>> commandMap = getCommandMap();
        List<String> result = CollUtil.newArrayList();
        String[] split = command.trim().split("\\s");
        int flag = -1; //-1: 未指定 0: 指令 1: 参数 2: 参数值
        SdkCommand currentCommand = null;
        String lastCommand = null;
        for (int i = 0; i < split.length; i++) {
            String str = split[i];
            if (!str.startsWith("-") && (i == 0 || ReUtil.isMatch("^\\-[^\\-]", split[i - 1]))) {
                flag = 0;
                lastCommand = str;
                if (commandMap.containsKey(str)) {
                    currentCommand = ReflectUtil.newInstance(commandMap.get(str));
                }
            } else if (str.startsWith("-")) {
                flag = 1;
            }
        }
        String prefix = ReUtil.replaceAll(command, split[split.length - 1] + "$", "");
        if (flag == 0) { //需要提示指令
            for (String key : commandMap.keySet()) {
                if (key.startsWith(lastCommand)) {
                    result.add(prefix + key);
                }
            }
        } else if (flag == 1 && currentCommand != null) { //需要提示参数
            for (String value : currentCommand.getAllValidArgList()) {
                if (value.startsWith(split[split.length - 1])) {
                    result.add(prefix + value);
                }
            }
        }
        return result;
    }
}
