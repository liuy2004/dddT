package gitee.com.ericfox.ddd.application;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(
        scanBasePackages = {
                "gitee.com.ericfox.ddd.application.*.controller",
                "gitee.com.ericfox.ddd.application.*.service",
                "gitee.com.ericfox.ddd.application.*.config",
                "gitee.com.ericfox.ddd.application.*.events",
                "gitee.com.ericfox.ddd.domain.*.events",
                "gitee.com.ericfox.ddd.domain.*.config",
                "gitee.com.ericfox.ddd.domain.*.properties",
                "gitee.com.ericfox.ddd.domain.*.service",
                "gitee.com.ericfox.ddd.application.*.events",
                "gitee.com.ericfox.ddd.starter.*.properties",
                "gitee.com.ericfox.ddd.starter.*.service",
                "gitee.com.ericfox.ddd.starter.*.config",
                "gitee.com.ericfox.ddd.context.*.converter",
                "gitee.com.ericfox.ddd.common.properties",
        }
)
public class AppApplication {
    public static void main(String[] args) {
        SpringApplication.run(AppApplication.class, args);
    }
}
