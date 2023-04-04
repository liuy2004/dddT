package gitee.com.ericfox.ddd.starter.sdk.config;

import gitee.com.ericfox.ddd.common.pattern.starter.sdk.SdkCommand;
import gitee.com.ericfox.ddd.common.toolkit.coding.ClassUtil;
import gitee.com.ericfox.ddd.common.toolkit.coding.CollUtil;
import gitee.com.ericfox.ddd.common.toolkit.coding.MapUtil;
import gitee.com.ericfox.ddd.starter.sdk.properties.StarterSdkProperties;
import gitee.com.ericfox.ddd.starter.sdk.service.SdkServiceImpl;
import jakarta.annotation.Resource;
import lombok.Getter;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;

import java.lang.reflect.Modifier;
import java.util.Map;
import java.util.Set;

@Configuration
@ConditionalOnProperty(prefix = "custom.starter.sdk", value = "enable")
@Slf4j
public class SdkConfig {
    @Resource
    private StarterSdkProperties starterSdkProperties;
    @Getter
    private final Map<String, Class<? extends SdkCommand>> commandMap = MapUtil.newHashMap();

    @Autowired
    @SneakyThrows
    @SuppressWarnings("unchecked")
    private void init() {
        starterSdkProperties.getEnable();
        String path = SdkServiceImpl.class.getName().replaceAll(".sdk.service.*", ".sdk.pattern");
        Set<Class<?>> classSet = ClassUtil.scanPackage(path);
        if (CollUtil.isNotEmpty(classSet)) {
            for (Class<?> clazz : classSet) {
                if (SdkCommand.class.isAssignableFrom(clazz) && !Modifier.isAbstract(clazz.getModifiers())) {
                    String commandName = clazz.getDeclaredField("COMMAND_NAME").get(null).toString();
                    commandMap.put(commandName, (Class<? extends SdkCommand>) clazz);
                }
            }
        }
    }
}
