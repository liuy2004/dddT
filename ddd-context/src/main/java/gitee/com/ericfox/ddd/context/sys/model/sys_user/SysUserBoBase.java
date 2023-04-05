package gitee.com.ericfox.ddd.context.sys.model.sys_user;

import gitee.com.ericfox.ddd.common.interfaces.domain.BaseCondition;
import gitee.com.ericfox.ddd.common.interfaces.domain.BaseContext;
import gitee.com.ericfox.ddd.common.toolkit.coding.SpringUtil;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SysUserBoBase {
    private static SysUserService _sysUserService;
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
     * uuid可以存储第三方主键
     */
    private String uuid;
    /**
     * 用户名
     */
    private String username;
    /**
     * 昵称
     */
    private String nickname;
    /**
     * 密码
     */
    private String password;
    /**
     * 平台
     */
    private String platform;
    /**
     * 用户信息
     */
    private String userinfo;
    /**
     * 状态
     */
    private String statusEnum;
    /**
     * 创建日期
     */
    private java.sql.Timestamp createDate;

    public synchronized SysUserService service() {
        if (_sysUserService == null) {
            _sysUserService = SpringUtil.getBean(SysUserService.class);
        }
        return _sysUserService;
    }
}