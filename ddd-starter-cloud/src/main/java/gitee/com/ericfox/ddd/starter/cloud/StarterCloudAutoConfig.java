package gitee.com.ericfox.ddd.starter.cloud;

import gitee.com.ericfox.ddd.starter.cloud.properties.StarterCloudProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@Slf4j
@AutoConfiguration
@EnableConfigurationProperties(StarterCloudProperties.class)
@ConditionalOnProperty(prefix = "custom.starter.cloud", value = "enable")
public class StarterCloudAutoConfig {
}
