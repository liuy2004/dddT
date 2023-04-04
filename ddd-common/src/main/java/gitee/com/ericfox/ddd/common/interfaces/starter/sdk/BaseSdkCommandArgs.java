package gitee.com.ericfox.ddd.common.interfaces.starter.sdk;

import gitee.com.ericfox.ddd.common.pattern.starter.sdk.SdkCommand;

import java.util.List;

public interface BaseSdkCommandArgs<COMMAND extends SdkCommand, ARGS extends BaseSdkCommandArgs<COMMAND, ARGS>> {
    String getArgName();

    Integer getGroup();

    String getComment();

    List<String> getAllValidArgList();

    default boolean isValidArg(String arg) {
        return getAllValidArgList().contains(arg);
    }
}
