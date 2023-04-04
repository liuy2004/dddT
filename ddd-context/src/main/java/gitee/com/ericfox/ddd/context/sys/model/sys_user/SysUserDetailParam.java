package gitee.com.ericfox.ddd.context.sys.model.sys_user;

import gitee.com.ericfox.ddd.common.interfaces.api.BaseDetailParam;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SysUserDetailParam implements BaseDetailParam {
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
}
