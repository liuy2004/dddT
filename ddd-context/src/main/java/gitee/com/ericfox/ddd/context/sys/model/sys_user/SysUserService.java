package gitee.com.ericfox.ddd.context.sys.model.sys_user;

import gitee.com.ericfox.ddd.common.annotations.ddd.DddService;
import gitee.com.ericfox.ddd.common.interfaces.infrastructure.Constants;
import org.springframework.cache.annotation.CacheConfig;

@DddService
@CacheConfig(cacheNames = "ServiceCache:SysUserService", keyGenerator = Constants.SERVICE_CACHE_KEY_GENERATOR)
public class SysUserService extends SysUserServiceBase {
}
