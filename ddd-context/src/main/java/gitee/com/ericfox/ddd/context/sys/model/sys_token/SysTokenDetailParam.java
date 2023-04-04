package gitee.com.ericfox.ddd.context.sys.model.sys_token;

import gitee.com.ericfox.ddd.common.interfaces.api.BaseDetailParam;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SysTokenDetailParam implements BaseDetailParam {
    /**
     * 主键
     */
    private Long id;
    /**
     * 用户名
     */
    private String username;
    /**
     * 平台
     */
    private String platform;
    /**
     * 令牌
     */
    private String token;
    /**
     * 刷新令牌
     */
    private String refreshToken;
    /**
     * 过期时间
     */
    private Long expireDate;
    /**
     * 创建时间
     */
    private Long createDate;
}
