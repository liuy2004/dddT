package gitee.com.ericfox.ddd.context.sys.model.sys_user;

import gitee.com.ericfox.ddd.common.interfaces.api.BaseDto;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SysUserDto implements BaseDto {
    public static final String BUS_NAME = "SysUserDto";
}