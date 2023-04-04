package gitee.com.ericfox.ddd.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(
        scanBasePackages = {
                "gitee.com.ericfox.ddd.api.controller",
                "gitee.com.ericfox.ddd.api.config",
                "gitee.com.ericfox.ddd.context.*.converter",
        }
)
public class ApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiApplication.class, args);
    }
}
