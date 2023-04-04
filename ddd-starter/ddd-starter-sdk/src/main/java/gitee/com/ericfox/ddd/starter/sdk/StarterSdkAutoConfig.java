package gitee.com.ericfox.ddd.starter.sdk;

import gitee.com.ericfox.ddd.starter.sdk.properties.StarterSdkProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@Slf4j
@AutoConfiguration
@EnableConfigurationProperties(StarterSdkProperties.class)
@ConditionalOnProperty(prefix = "custom.starter.sdk", value = "enable")
public class StarterSdkAutoConfig {
}
