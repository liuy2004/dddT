package gitee.com.ericfox.ddd.starter.sdk.pattern;

import gitee.com.ericfox.ddd.common.exceptions.FrameworkApiException;
import gitee.com.ericfox.ddd.common.interfaces.starter.sdk.BaseSdkCommandArgs;
import gitee.com.ericfox.ddd.common.pattern.starter.sdk.SdkCommand;
import gitee.com.ericfox.ddd.common.toolkit.coding.CollUtil;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class SdkGenCodeCommand extends SdkCommand {
    public static final String COMMAND_NAME = "gen-code";

    public String getCommandName() {
        return COMMAND_NAME;
    }

    @Override
    public void undo() {
    }

    @Override
    public boolean isValidArg(String arg) {
        return SdkGenCodeCommand.Args.TABLE.isValidArg(arg);
    }

    @Override
    public List<?> run() {
        if (CollUtil.containsKeyCount(this.argsMap, CollUtil.newArrayList(
                Args.TABLE.getArgName(),
                Args.HELP.getArgName())) != 1) {
            throw new FrameworkApiException("参数不正确: " + this, HttpStatus.BAD_REQUEST);
        }
        if (argsMap.containsKey(Args.HELP.getArgName())) {
            return helpMode();
        }
        return CollUtil.newArrayList(this.toString());
    }

    public List<String> helpMode() {
        ArrayList<String> reuslt = CollUtil.newArrayList();
        for (Args value : Args.values()) {
            reuslt.add(value.getComment());
        }
        return reuslt;
    }

    @Override
    public List<String> getAllValidArgList() {
        return Args.HELP.getAllValidArgList();
    }

    @Getter
    public enum Args implements BaseSdkCommandArgs<SdkGenCodeCommand, SdkGenCodeCommand.Args> {
        TABLE("-table", 1, "-table 表名"),
        EXCLUDE("-exclude", 2, "-exclude 排除的文件"),
        INCLUDE("-include", 2, "-include 包含的文件"),
        OVERWRITE("--overwrite", 3, "--overwrite 是否覆盖"),
        HELP("--help", 4, "--help 输出帮助信息");
        private static List<String> allValidArgList = null;
        /**
         * 参数名
         */
        private final String argName;
        /**
         * 分组
         */
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
                for (SdkGenCodeCommand.Args value : values()) {
                    allValidArgList.add(value.getArgName());
                }
            }
            return allValidArgList;
        }

        public boolean isValidArg(String arg) {
            return getAllValidArgList().contains(arg);
        }
    }
}
