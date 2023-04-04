package gitee.com.ericfox.ddd.starter.oauth2;

import gitee.com.ericfox.ddd.starter.oauth2.properties.StarterOauth2Properties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@Slf4j
@AutoConfiguration
@EnableConfigurationProperties(StarterOauth2Properties.class)
@ConditionalOnProperty(prefix = "custom.starter.oauth2", value = "enable")
public class StarterOauth2AutoConfig {
}
