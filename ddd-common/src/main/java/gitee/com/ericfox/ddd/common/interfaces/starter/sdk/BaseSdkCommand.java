package gitee.com.ericfox.ddd.common.interfaces.starter.sdk;

import java.io.Serializable;
import java.util.List;

public interface BaseSdkCommand extends Serializable {
    /**
     * 获取所有有效参数列表
     */
    List<String> getAllValidArgList();
}
