package gitee.com.ericfox.ddd.context.sys.converter;

import gitee.com.ericfox.ddd.context.sys.model.sys_token.SysTokenBo;
import gitee.com.ericfox.ddd.context.sys.model.sys_token.SysTokenDto;
import gitee.com.ericfox.ddd.context.sys.model.sys_token.SysTokenVo;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface SysTokenConverter {
    SysTokenConverter INSTANCE = Mappers.getMapper(SysTokenConverter.class);

    SysTokenDto convertBo2Dto(SysTokenBo bo);

    SysTokenVo convertDto2Vo(SysTokenDto dto);
}
