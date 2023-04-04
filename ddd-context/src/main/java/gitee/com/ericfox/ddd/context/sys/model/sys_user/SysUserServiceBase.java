package gitee.com.ericfox.ddd.context.sys.model.sys_user;

import gitee.com.ericfox.ddd.common.interfaces.infrastructure.Constants;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;

@CacheConfig(cacheNames = "ServiceCache:SysUserService", keyGenerator = Constants.SERVICE_CACHE_KEY_GENERATOR)
public abstract class SysUserServiceBase {
    @CacheEvict(allEntries = true, beforeInvocation = false)
    public void cacheEvict() {
    }
}
