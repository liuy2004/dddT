package gitee.com.ericfox.ddd.starter.filesystem;

import gitee.com.ericfox.ddd.starter.filesystem.properties.StarterFilesystemProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@Slf4j
@AutoConfiguration
@EnableConfigurationProperties(StarterFilesystemProperties.class)
@ConditionalOnProperty(prefix = "custom.starter.filesystem", value = "enable")
public class StarterFilesystemAutoConfig {
}
