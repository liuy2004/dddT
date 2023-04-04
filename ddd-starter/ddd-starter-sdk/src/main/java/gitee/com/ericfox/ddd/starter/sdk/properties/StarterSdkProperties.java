package gitee.com.ericfox.ddd.starter.sdk.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Setter
@Getter
@Component
@ConfigurationProperties(prefix = "custom.starter.sdk")
public class StarterSdkProperties {
    private String enable;
}
