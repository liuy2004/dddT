package gitee.com.ericfox.ddd.starter.sdk.pattern;

import gitee.com.ericfox.ddd.common.pattern.starter.sdk.SdkCommand;
import gitee.com.ericfox.ddd.common.toolkit.coding.CollUtil;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Slf4j
public class SdkForceCommand extends SdkCommand {
    public static Boolean INCLUDE_OTHER_COMMAND = true;
    public static String COMMAND_NAME = "force";

    public String getCommandName() {
        return "force";
    }

    @Override
    public List<?> run() {
        return CollUtil.newArrayList("");
    }

    @Override
    public void undo() {
    }

    @Override
    public List<?> helpMode() {
        ArrayList<String> reuslt = CollUtil.newArrayList();
        for (SdkGenCodeCommand.Args value : SdkGenCodeCommand.Args.values()) {
            reuslt.add(value.getComment());
        }
        return reuslt;
    }

    @Override
    public boolean isValidArg(String arg) {
        return false;
    }

    @Override
    public List<String> getAllValidArgList() {
        return null;
    }
}
