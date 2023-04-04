package gitee.com.ericfox.ddd.starter.sdk.pattern;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.URLUtil;
import cn.hutool.crypto.SecureUtil;
import cn.hutool.extra.spring.SpringUtil;
import cn.hutool.json.JSONUtil;
import gitee.com.ericfox.ddd.common.exceptions.FrameworkApiException;
import gitee.com.ericfox.ddd.common.interfaces.infrastructure.Constants;
import gitee.com.ericfox.ddd.common.interfaces.starter.sdk.BaseSdkCommandArgs;
import gitee.com.ericfox.ddd.common.pattern.starter.sdk.SdkCommand;
import gitee.com.ericfox.ddd.common.toolkit.coding.CollUtil;
import gitee.com.ericfox.ddd.common.toolkit.coding.MapUtil;
import lombok.Getter;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static gitee.com.ericfox.ddd.common.interfaces.api.BaseHttpStatus.BAD_REQUEST_400;

public class SdkWikiCommand extends SdkCommand {
    public static final String COMMAND_NAME = "wiki";

    @Override
    public List<String> getAllValidArgList() {
        return Args.HELP.getAllValidArgList();
    }

    @Override
    public String getCommandName() {
        return COMMAND_NAME;
    }

    @Override
    public List<?> run() {
        if (argsMap.isEmpty() || argsMap.containsKey(Args.HELP.getArgName())) {
            return helpMode();
        } else if (argsMap.containsKey(Args.OPEN.getArgName())) {
            return openMode();
        } else if (argsMap.containsKey(Args.LS.getArgName())) {
            return lsMode();
        } else if (argsMap.containsKey(Args.TEXT.getArgName())) {
            return textMode();
        } else if (argsMap.containsKey(Args.USER_LIST.getArgName())) {
            return userListMode();
        } else if (argsMap.containsKey(Args.SAVE.getArgName())) {
            return saveMode();
        }
        return CollUtil.newArrayList("参数错误，请检查正确性");
    }

    @Override
    public void undo() {
    }

    @Override
    public List<?> helpMode() {
        ArrayList<String> reuslt = CollUtil.newArrayList();
        for (Args value : Args.values()) {
            reuslt.add(value.getComment());
        }
        return reuslt;
    }

    public List<?> openMode() {
        return CollUtil.newArrayList("http://localhost:" + SpringUtil.getProperty("server.port") + "/open/api/sdk/view/wiki");
    }

    public List<?> lsMode() {
        String rootPath = Constants.PROJECT_ROOT_PATH.replaceAll("\\\\", "/") + "/.wiki/documents";
        String finalPath = rootPath;
        if (argsMap.containsKey(Args.PATH.getArgName())) {
            finalPath += argsMap.get(Args.PATH.getArgName());
        }
        List<File> files = FileUtil.loopFiles(finalPath);
        ArrayList<Map<String, Object>> reuslt = CollUtil.newArrayList();
        for (File file : files) {
            Map<String, Object> map = MapUtil.newHashMap();
            map.put("id", SecureUtil.md5(file));
            map.put("label", FileUtil.getName(file));
            map.put("type", FileUtil.isDirectory(file) ? "dir" : "file");
            String relativePath = file.getAbsolutePath().replaceAll("\\\\", "/").replaceAll(rootPath + "/", "");
            if (relativePath.indexOf("/") > 0) {
                map.put("owner", relativePath.substring(0, relativePath.indexOf("/")));
            } else {
                map.put("owner", "Admin");
            }
            map.put("path", "/" + relativePath);
            reuslt.add(map);
        }
        return reuslt;
    }

    public List<?> userListMode() {
        String path = Constants.PROJECT_ROOT_PATH.replaceAll("\\\\", "/") + "/.wiki/documents/users/username.json";
        return CollUtil.newArrayList(JSONUtil.toList(FileUtil.readUtf8String(path), Map.class));
    }

    public List<?> saveMode() {
        String path = Constants.PROJECT_ROOT_PATH.replaceAll("\\\\", "/") + "/.wiki/documents";
        String filePath = path + argsMap.get(Args.PATH.getArgName());
        String content = URLUtil.decode(argsMap.get(Args.SAVE.getArgName()), StandardCharsets.UTF_8);
        FileUtil.writeUtf8String(content, filePath);
        return CollUtil.newArrayList("OK");
    }

    public List<?> textMode() {
        String path = Constants.PROJECT_ROOT_PATH.replaceAll("\\\\", "/") + "/.wiki/documents";
        if (argsMap.containsKey(Args.PATH.getArgName())) {
            path += argsMap.get(Args.PATH.getArgName());
            if (FileUtil.isFile(path)) {
                return CollUtil.newArrayList(FileUtil.readUtf8String(path));
            }
        }
        throw new FrameworkApiException("文档不存在", BAD_REQUEST_400);
    }

    @Override
    public boolean isValidArg(String arg) {
        return Args.HELP.getAllValidArgList().contains(arg);
    }

    @Getter
    public enum Args implements BaseSdkCommandArgs<SdkWikiCommand, Args> {
        HELP("--help", 1, "--help 命令可打印命令列表"),
        OPEN("--open", 1, "--open ※在新页面中编辑文档"),
        LS("--ls", 1, "--ls 打印目录与文档结构"),
        SAVE("-save", 1, "--save [文本内容] 保存文档（需配合-path指令）"),

        TEXT("--text", 1, "--text 返回对应文档的文本内容（需配合-path指令）"),
        PATH("-path", 2, "-path [路径] 指定文档的路径"),
        SEARCH("-search", 1, "--search （该功能未实现）"),
        USER_LIST("--user-list", 1, "--user-list 获取用户列表");
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
