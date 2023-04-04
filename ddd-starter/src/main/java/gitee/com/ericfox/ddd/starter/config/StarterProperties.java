package gitee.com.ericfox.ddd.starter.config;

import gitee.com.ericfox.ddd.starter.sdk.properties.StarterSdkProperties;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Setter
@Getter
@Component
@ConfigurationProperties(prefix = "custom.starter", ignoreInvalidFields = true)
public class StarterProperties {
    private StarterSdkProperties sdk;

    //private StarterBpmProperties bpm;

//    private StarterCacheProperties cache;

    //private StarterCloudProperties cloud;

//    private StarterMqProperties mq;

//    private StarterOauth2Properties oauth2;
}