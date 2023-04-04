package gitee.com.ericfox.ddd.common.interfaces.starter.sdk;

import gitee.com.ericfox.ddd.common.pattern.starter.sdk.SdkCommand;
import reactor.core.publisher.FluxSink;

import java.util.List;

public interface SdkService {
    /**
     * 根据字符串解析指令
     */
    SdkCommand parseCommand(String str);

    /**
     * 执行指令
     */
    List<?> executeCommand(SdkCommand command, FluxSink<List<?>> flux);

    /**
     * 提示下一条指令
     */
    List<String> remindCommand(String command);
}
