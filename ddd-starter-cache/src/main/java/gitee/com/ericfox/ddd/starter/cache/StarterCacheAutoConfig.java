package gitee.com.ericfox.ddd.starter.cache;

import gitee.com.ericfox.ddd.starter.cache.properties.StarterCacheProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import javax.annotation.Resource;

@Slf4j
@AutoConfiguration
@EnableConfigurationProperties(StarterCacheProperties.class)
@ConditionalOnProperty(prefix = "custom.starter.cache", value = "enable")
public class StarterCacheAutoConfig {
    @Resource
    private StarterCacheProperties starterMqProperties;
}
