package gitee.com.ericfox.ddd.starter.bpm;

import gitee.com.ericfox.ddd.starter.bpm.properties.StarterBpmProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import javax.annotation.Resource;

@Slf4j
@AutoConfiguration
@EnableConfigurationProperties(StarterBpmProperties.class)
@ConditionalOnProperty(prefix = "custom.starter.bpm", value = "enable")
public class StarterBpmAutoConfig {
    @Resource
    private StarterBpmProperties starterMqProperties;
}
