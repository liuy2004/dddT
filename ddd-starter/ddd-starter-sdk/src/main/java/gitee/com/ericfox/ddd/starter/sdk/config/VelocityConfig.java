package gitee.com.ericfox.ddd.starter.sdk.config;

import cn.hutool.extra.template.TemplateConfig;
import cn.hutool.extra.template.TemplateEngine;
import gitee.com.ericfox.ddd.common.toolkit.trans.TemplateUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class VelocityConfig {
    @Bean
    public TemplateEngine velocityEngine() {
        return TemplateUtil.createEngine(new TemplateConfig("starter/sdk/velocity2/vm.properties", TemplateConfig.ResourceMode.CLASSPATH));
    }
}
