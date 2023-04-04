package gitee.com.ericfox.ddd.common.pattern.starter.sdk;

import gitee.com.ericfox.ddd.common.interfaces.starter.sdk.BaseSdkCommand;
import gitee.com.ericfox.ddd.common.toolkit.coding.IdUtil;
import lombok.Data;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.StringJoiner;

@Data
public abstract class SdkCommand implements BaseSdkCommand {
    {
        id = IdUtil.getSnowflakeNextId();
    }

    /**
     * 是否包含其他指令
     */
    public static Boolean INCLUDE_OTHER_COMMAND = false;
    public static String COMMAND_NAME = null;

    /**
     * 指令id
     */
    protected long id;
    /**
     * 参数集合
     */
    protected Map<String, String> argsMap = new LinkedHashMap<>();
    /**
     * 下一个指令
     */
    protected SdkCommand nextCommand;

    abstract public String getCommandName();

    abstract public List<?> run();

    abstract public void undo();

    abstract public List<?> helpMode();

    abstract public boolean isValidArg(String arg);

    @Override
    public String toString() {
        StringJoiner stringJoiner = new StringJoiner(" ");
        stringJoiner.add(getCommandName());
        argsMap.forEach((key, value) -> {
            stringJoiner.add(key);
            stringJoiner.add(value);
        });
        if (this.nextCommand != null) {
            stringJoiner.add(this.nextCommand.toString());
        }
        return stringJoiner.toString();
    }
}
