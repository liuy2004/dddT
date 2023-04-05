package test.context;

import gitee.com.ericfox.ddd.context.sys.converter.SysUserConverter;
import gitee.com.ericfox.ddd.context.sys.model.sys_user.SysUserBo;
import gitee.com.ericfox.ddd.context.sys.model.sys_user.SysUserDto;
import org.junit.jupiter.api.Test;

public class Main {
    @Test
    public void contextConvertTest() {
        SysUserBo bo = new SysUserBo();
        bo.setId(1L);
        SysUserDto dto = SysUserConverter.INSTANCE.convertBo2Dto(bo);
        System.out.println(dto);
    }
}
