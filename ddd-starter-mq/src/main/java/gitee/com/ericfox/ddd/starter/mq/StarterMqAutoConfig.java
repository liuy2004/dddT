package gitee.com.ericfox.ddd.starter.mq;

import gitee.com.ericfox.ddd.common.exceptions.FrameworkApiException;
import gitee.com.ericfox.ddd.common.toolkit.coding.ArrayUtil;
import gitee.com.ericfox.ddd.common.toolkit.coding.SpringUtil;
import gitee.com.ericfox.ddd.common.toolkit.coding.StrUtil;
import gitee.com.ericfox.ddd.starter.mq.config.RabbitMqConfig;
import gitee.com.ericfox.ddd.starter.mq.properties.StarterMqProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.http.HttpStatus;

import javax.annotation.Resource;

@Slf4j
@AutoConfiguration
@EnableConfigurationProperties(StarterMqProperties.class)
@ConditionalOnProperty(prefix = "custom.starter.mq", value = "enable")
public class StarterMqAutoConfig {
    @Resource
    private StarterMqProperties starterMqProperties;

    /**
     * 初始化
     */
    @Autowired
    public void initAll() {
        if (!starterMqProperties.isEnable()) {
            return;
        }
        if (ArrayUtil.isEmpty(starterMqProperties.getDefaultStrategy())) {
            throw new FrameworkApiException("请配置Mq的类型", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        SpringUtil.registerBean(StrUtil.toCamelCase(RabbitMqConfig.class.getSimpleName()), new RabbitMqConfig());
    }
}
