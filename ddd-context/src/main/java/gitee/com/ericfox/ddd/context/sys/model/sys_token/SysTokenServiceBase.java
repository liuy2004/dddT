package gitee.com.ericfox.ddd.context.sys.model.sys_token;

import gitee.com.ericfox.ddd.common.interfaces.infrastructure.Constants;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;

@CacheConfig(cacheNames = "ServiceCache:SysTokenService", keyGenerator = Constants.SERVICE_CACHE_KEY_GENERATOR)
public abstract class SysTokenServiceBase {
    @CacheEvict(allEntries = true, beforeInvocation = false)
    public void cacheEvict() {
    }
}
