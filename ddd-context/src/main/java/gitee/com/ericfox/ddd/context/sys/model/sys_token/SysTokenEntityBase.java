package gitee.com.ericfox.ddd.context.sys.model.sys_token;

import gitee.com.ericfox.ddd.common.interfaces.domain.BaseCondition;
import gitee.com.ericfox.ddd.common.interfaces.domain.BaseContext;
import gitee.com.ericfox.ddd.common.toolkit.coding.SpringUtil;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SysTokenEntityBase {
    private static SysTokenService _sysTokenService;
    protected BaseCondition<?> _condition;

    /**
     * 上下文-类型
     */
    private BaseContext.BaseDescription _description;
    /**
     * 上下文-时间
     */
    private BaseContext.BaseMoment _moment;
    /**
     * 上下文-角色
     */
    private BaseContext.BaseRule _rule;

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

    public synchronized SysTokenService service() {
        if (_sysTokenService == null) {
            _sysTokenService = SpringUtil.getBean(SysTokenService.class);
        }
        return _sysTokenService;
    }
}
