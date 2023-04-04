package gitee.com.ericfox.ddd.starter.sdk.pattern;

import gitee.com.ericfox.ddd.common.exceptions.FrameworkApiException;
import gitee.com.ericfox.ddd.common.interfaces.starter.sdk.BaseSdkCommandArgs;
import gitee.com.ericfox.ddd.common.pattern.starter.sdk.SdkCommand;
import gitee.com.ericfox.ddd.common.toolkit.coding.CollUtil;
import gitee.com.ericfox.ddd.common.toolkit.coding.SpringUtil;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.rsocket.RSocketRequester;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

/**
 * 数据库指令
 */
@Getter
@Setter
public class SdkDbCommand extends SdkCommand {
    public static final String COMMAND_NAME = "db";

    public String getCommandName() {
        return COMMAND_NAME;
    }

    @Override
    public List<?> run() {
        if (CollUtil.containsKeyCount(this.argsMap, CollUtil.newArrayList("--create", "--drop", "--update", "--delete", "--select")) != 1) {
            throw new FrameworkApiException("参数不正确: " + this, HttpStatus.BAD_REQUEST);
        }
        Mono<RSocketRequester> monoRequester = SpringUtil.getBean("monoRequester");
        monoRequester.map(RSocketRequester -> {
            return RSocketRequester.route("/sdk").data(argsMap.get(Args.BODY.argName)).retrieveMono(String.class);
        }).flatMap(Mono::from).block();
        return CollUtil.newArrayList(this.toString());
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
        return Args.BODY.isValidArg(arg);
    }

    @Override
    public List<String> getAllValidArgList() {
        return Args.HELP.getAllValidArgList();
    }

    @Getter
    public enum Args implements BaseSdkCommandArgs<SdkDbCommand, Args> {
        INSERT("--insert", 1, "--insert 数据库插入数据"),
        UPDATE("--update", 1, "--update 数据库更新数据"),
        DELETE("--delete", 1, "--delete 数据库删除数据"),

        TABLE("-table", 2, "-table 表名"),
        BODY("-body", 3, "-body 数据内容"),
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
                for (Args value : values()) {
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
