package gitee.com.ericfox.ddd.starter.sdk.pattern;

import gitee.com.ericfox.ddd.common.interfaces.starter.sdk.BaseSdkCommandArgs;
import gitee.com.ericfox.ddd.common.pattern.starter.sdk.SdkCommand;
import gitee.com.ericfox.ddd.common.toolkit.coding.CollUtil;
import gitee.com.ericfox.ddd.common.toolkit.coding.SpringUtil;
import gitee.com.ericfox.ddd.starter.sdk.config.SdkConfig;
import lombok.Getter;
import lombok.SneakyThrows;

import java.util.List;

public class SdkHelpCommand extends SdkCommand {
    public static final String COMMAND_NAME = "help";

    public String getCommandName() {
        return COMMAND_NAME;
    }

    @Override
    public List<String> getAllValidArgList() {
        return Args.HELP.getAllValidArgList();
    }

    @Override
    @SneakyThrows
    public List<?> run() {
        if (argsMap.containsKey(Args.HELP.getArgName())) {
            return helpMode();
        }
        SdkConfig sdkConfig = SpringUtil.getBean(SdkConfig.class);
        List list = CollUtil.newArrayList();
        for (Class<? extends SdkCommand> clazz : sdkConfig.getCommandMap().values()) {
            list.add(clazz.getDeclaredField("COMMAND_NAME").get(null).toString());
        }
        return list;
    }

    @Override
    public void undo() {
    }

    public List<String> helpMode() {
        return CollUtil.newArrayList(Args.HELP.comment);
    }

    @Override
    public boolean isValidArg(String arg) {
        return Args.HELP.getAllValidArgList().contains(arg);
    }

    @Getter
    public enum Args implements BaseSdkCommandArgs<SdkHelpCommand, Args> {
        HELP("--help", 1, "help 命令可打印命令列表");
        private static List<String> allValidArgList = null;

        private final String argName;
        private final Integer group;
        private final String comment;

        Args(String argName, Integer group, String comment) {
            this.argName = argName;
            this.group = group;
            this.comment = comment;
        }

        @Override
        public synchronized List<String> getAllValidArgList() {
            if (allValidArgList == null) {
                allValidArgList = CollUtil.newArrayList();
                for (Args value : values()) {
                    allValidArgList.add(value.getArgName());
                }
            }
            return allValidArgList;
        }
    }
}
