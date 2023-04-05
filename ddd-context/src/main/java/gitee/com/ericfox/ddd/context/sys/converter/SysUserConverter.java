package gitee.com.ericfox.ddd.context.sys.converter;

import gitee.com.ericfox.ddd.context.sys.model.sys_user.SysUserBo;
import gitee.com.ericfox.ddd.context.sys.model.sys_user.SysUserDto;
import gitee.com.ericfox.ddd.context.sys.model.sys_user.SysUserVo;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface SysUserConverter {
    SysUserConverter INSTANCE = Mappers.getMapper(SysUserConverter.class);

    SysUserDto convertBo2Dto(SysUserBo entity);

    SysUserVo convertDto2Vo(SysUserDto dto);
}
