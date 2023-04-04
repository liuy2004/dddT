package gitee.com.ericfox.ddd.common.interfaces.api;

import gitee.com.ericfox.ddd.common.interfaces.infrastructure.BasePo;

import java.io.Serializable;

/**
 * 一对多
 */
public interface BaseOneToManyDto<PO extends BasePo<PO>, DTO extends BaseOneToManyDto> extends Serializable {
}
